"""Check built SEO output and HTTP responses. External URLs are inventoried only."""

import argparse
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from threading import Thread
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urldefrag, urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as XML

from seo_preview import build_server

SITE = 'https://pushpendra.me'
SITEMAP = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
IMAGE = '{http://www.google.com/schemas/sitemap-image/1.1}'
INDEX_DIRECTIVES = re.compile(r'\b(?:noindex|none)\b', re.I)


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = defaultdict(list)
        self.ids = Counter()
        self.headings = []
        self.text = defaultdict(list)
        self.capture = None
        self.feed(html)
        self.close()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags[tag].append(attrs)
        if attrs.get('id'):
            self.ids[attrs['id']] += 1
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.headings.append(int(tag[1]))
        if tag in {'title', 'h1'} or (tag == 'script' and attrs.get('type') == 'application/ld+json'):
            self.capture = tag
            self.text[tag].append('')

    def handle_data(self, data):
        if self.capture:
            self.text[self.capture][-1] += data

    def handle_endtag(self, tag):
        if tag == self.capture:
            self.capture = None

    def meta(self, key, attr='name'):
        return [tag.get('content') or '' for tag in self.tags['meta']
                if (tag.get(attr) or '').lower() == key]


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch(url):
    try:
        try:
            response = build_opener(NoRedirect()).open(
                Request(url, headers={'User-Agent': 'PortfolioSEOAudit/1.0'}), timeout=10)
        except HTTPError as error:
            response = error
        with response:
            media = response.headers.get_content_type()
            body = response.read()
            text = body.decode('utf-8', errors='replace') if media.startswith('text/') or media.endswith('/xml') else ''
            return response.code, media, text, response.headers
    except (URLError, OSError) as error:
        return 0, '', '', {'reason': str(error.reason if isinstance(error, URLError) else error)}


def local_path(url):
    parsed = urlsplit(url)
    return parsed.path + (('?' + parsed.query) if parsed.query else '')


def valid_https(url):
    if not isinstance(url, str):
        return False
    try:
        parsed = urlsplit(url)
        return parsed.scheme == 'https' and bool(parsed.hostname)
    except ValueError:
        return False


def check_schema(page, path, require):
    expected = 'ProfilePage' if path == '/' else 'SoftwareApplication' if path.startswith('/products/') else 'Article'
    scripts = page.text['script']
    require(len(scripts) == 1, 'json-ld', path, 'Expected one JSON-LD block')
    for script in scripts:
        try:
            data = json.loads(script)
        except json.JSONDecodeError as error:
            require(False, 'json-ld', path, f'Invalid JSON-LD at line {error.lineno}, column {error.colno}')
            continue
        if not require(isinstance(data, dict) and data.get('@context') == 'https://schema.org'
                       and data.get('@type') == expected and data.get('url') == SITE + path,
                       'json-ld', path, f'Expected schema.org {expected} for the canonical URL'):
            continue
        entity = data.get('mainEntity' if expected == 'ProfilePage' else 'author')
        require(isinstance(entity, dict) and entity.get('@type') == 'Person'
                and isinstance(entity.get('name'), str) and bool(entity['name'].strip())
                and entity.get('@id') == SITE + '/#person' and entity.get('url') == SITE + '/',
                'json-ld', path, 'Expected the named portfolio owner with a stable Person identity')
        label = 'headline' if expected == 'Article' else 'name'
        require(isinstance(data.get(label), str) and bool(data[label].strip()), 'json-ld', path, f'Missing {label}')
        if expected == 'ProfilePage' and isinstance(entity, dict):
            profiles = entity.get('sameAs')
            require(isinstance(profiles, list) and bool(profiles) and all(map(valid_https, profiles)),
                    'json-ld', path, 'Person sameAs must contain absolute HTTPS profile URLs')
            require(valid_https(entity.get('image')), 'json-ld', path, 'Person image must use HTTPS')
        if expected != 'ProfilePage':
            require(isinstance(data.get('description'), str) and bool(data['description'].strip())
                    and valid_https(data.get('image')), 'json-ld', path, 'Missing description or HTTPS image')


def check_page(page, path, headers, require, titles, descriptions, targets):
    def single(values, field):
        require(len(values) == 1 and bool(values[0].strip()), field, path, f'Expected one nonempty {field}')
        return values[0].strip() if values else ''

    titles[single(page.text['title'], 'title').casefold()].append(path)
    descriptions[single(page.meta('description'), 'description').casefold()].append(path)
    canonicals = [tag.get('href') for tag in page.tags['link'] if 'canonical' in (tag.get('rel') or '').lower().split()]
    require(canonicals == [SITE + path], 'canonical', path, 'Expected exactly one self-referencing production canonical')
    robot_meta = [tag.get('content') or '' for tag in page.tags['meta']
                  if (tag.get('name') or '').lower() in {'robots', 'googlebot', 'bingbot'}]
    require(not any(INDEX_DIRECTIVES.search(value) for value in robot_meta + [headers.get('X-Robots-Tag', '')]),
            'indexability', path, 'Unexpected noindex directive')
    single(page.text['h1'], 'h1')
    require(not any(after > before + 1 for before, after in zip(page.headings, page.headings[1:])),
            'headings', path, 'Heading hierarchy skips a level')
    require(bool(page.tags['main']), 'prerender', path, 'Main content missing from the HTTP response')

    og = {key: single(page.meta('og:' + key, 'property'), 'og:' + key)
          for key in ('title', 'description', 'type', 'url', 'image', 'image:width', 'image:height')}
    twitter = {key: single(page.meta('twitter:' + key), 'twitter:' + key)
               for key in ('card', 'title', 'description', 'image')}
    require(og['url'] == SITE + path and og['type'] == ('website' if path == '/' else 'article'),
            'social', path, 'Open Graph URL or type does not match the route')
    require(twitter['card'] == 'summary_large_image' and all(twitter[key] == og[key] for key in ('title', 'description', 'image')),
            'social', path, 'Twitter card fields should agree with Open Graph')
    require(og['image'].startswith(SITE + '/') and og['image:width'].isdigit() and og['image:height'].isdigit(),
            'social', path, 'Expected an absolute production share image URL and dimensions')
    if og['image'].startswith(SITE + '/'):
        targets[local_path(og['image'])].add(path)
    check_schema(page, path, require)

    for img in page.tags['img']:
        src = img.get('src') or ''
        decorative = (src in {'/favicon.svg', '/images/avatar-64.webp'}
                      or src.startswith('/images/certs/')
                      or img.get('aria-hidden') == 'true' or img.get('role') in {'presentation', 'none'})
        alt = img.get('alt')
        require(alt is not None and (bool(alt.strip()) or decorative),
                'image-alt', path, f'Missing meaningful alt for {src}')
        require(all((img.get(key) or '').isdigit() and int(img[key]) > 0 for key in ('width', 'height')),
                'image-size', path, f'Missing intrinsic dimensions for {src}')


def check_robots(body, paths, require):
    agents = []
    has_wildcard_group = False
    group_has_rules = False
    sitemaps = []
    for number, line in enumerate(body.splitlines(), start=1):
        line = line.split('#', 1)[0].strip()
        if not line:
            continue
        key, separator, value = line.partition(':')
        key, value = key.strip().lower(), value.strip()
        require(separator and re.fullmatch(r'[a-z-]+', key), 'robots', '/robots.txt', f'Invalid record at line {number}')
        if key == 'user-agent':
            if group_has_rules:
                agents, group_has_rules = [], False
            agents.append(value)
            require(bool(re.fullmatch(r'[a-zA-Z_-]+|\*', value)), 'robots', '/robots.txt', f'Invalid user-agent at line {number}')
        elif key in {'allow', 'disallow'}:
            group_has_rules = True
            has_wildcard_group |= '*' in agents
            require(agents and (not value or value.startswith('/')), 'robots', '/robots.txt', f'Invalid crawl rule at line {number}')
        elif key == 'sitemap':
            sitemaps.append(value)
    require(has_wildcard_group and sitemaps == [SITE + '/sitemap.xml'], 'robots', '/robots.txt',
            'Expected a wildcard group and the production sitemap')
    robots = RobotFileParser()
    robots.parse(body.splitlines())
    for path in sorted(paths):
        for agent in ('Googlebot', 'Bingbot', 'GPTBot', '*'):
            require(robots.can_fetch(agent, SITE + path), 'robots', path, f'Unexpected crawl block for {agent}')


def check_sitemap(body, paths, require, targets):
    try:
        root = XML.fromstring(body)
    except XML.ParseError as error:
        require(False, 'sitemap', '/sitemap.xml', f'Invalid XML: {error}')
        return set()
    require(root.tag == SITEMAP + 'urlset', 'sitemap', '/sitemap.xml', 'Expected the sitemap namespace and urlset')
    locs = []
    for entry in root:
        loc = entry.findall(SITEMAP + 'loc')
        if not require(entry.tag == SITEMAP + 'url' and len(loc) == 1 and bool(loc[0].text),
                       'sitemap', '/sitemap.xml', 'Expected exactly one loc in each url'):
            continue
        locs.append(loc[0].text)
        for image in entry.findall(IMAGE + 'image'):
            url = image.findtext(IMAGE + 'loc', '')
            if require(url.startswith(SITE + '/'), 'sitemap', loc[0].text, 'Expected a production sitemap image'):
                targets[local_path(url)].add(loc[0].text)
    require(len(locs) == len(set(locs)), 'sitemap', '/sitemap.xml', 'Duplicate sitemap URLs')
    for url in sorted(set(locs) - {SITE + path for path in paths}):
        require(False, 'sitemap', url, 'Unexpected or noncanonical sitemap URL')
    for path in sorted(paths - {local_path(url) for url in locs if url.startswith(SITE + '/')}):
        require(False, 'sitemap', path, 'Built route is absent from sitemap')
    return {local_path(url) for url in locs if url.startswith(SITE + '/')}


def audit(base, paths):
    issues = []
    targets, navigation, external, anchors = (defaultdict(set) for _ in range(4))
    pages, statuses = {}, {}
    titles, descriptions = defaultdict(list), defaultdict(list)
    checks = 0

    def require(ok, rule, path, message):
        nonlocal checks
        checks += 1
        if not ok:
            issues.append(dict(rule=rule, path=path, message=message))
        return bool(ok)

    with ThreadPoolExecutor(max_workers=4) as pool:
        def collect(urls):
            pending = sorted(set(urls) - statuses.keys())
            statuses.update(zip(pending, pool.map(fetch, (base + path for path in pending))))

        collect({'/robots.txt', '/sitemap.xml', '/.well-known/seo-audit-missing/', *paths})
        code, media, body, _ = statuses['/robots.txt']
        if require(code == 200 and media == 'text/plain', 'robots', '/robots.txt', f'Expected HTTP 200 text/plain, got {code} {media}'):
            robots_body = body
        else:
            robots_body = ''
        code, media, body, _ = statuses['/sitemap.xml']
        sitemap_paths = set()
        if require(code == 200 and media in {'application/xml', 'text/xml'}, 'sitemap', '/sitemap.xml', f'Expected HTTP 200 XML, got {code} {media}'):
            sitemap_paths = check_sitemap(body, paths, require, targets)
        code, media, body, headers = statuses['/.well-known/seo-audit-missing/']
        require(code == 404 and media == 'text/html', 'status', '/.well-known/seo-audit-missing/', f'Expected HTTP 404 HTML, got {code} {media}')
        require(any(INDEX_DIRECTIVES.search(value) for value in Page(body).meta('robots') + [headers.get('X-Robots-Tag', '')]),
                'indexability', '/.well-known/seo-audit-missing/', 'Fallback page should declare noindex')

        collect(sitemap_paths)
        for path in sorted(paths | sitemap_paths):
            code, media, body, headers = statuses[path]
            if not require(code == 200 and media == 'text/html', 'status', path, f'Expected HTTP 200 HTML, got {code} {media}'):
                continue
            page = pages[path] = Page(body)
            check_page(page, path, headers, require, titles, descriptions, targets)
            for tag, attr in [('a', 'href'), ('link', 'href'), ('img', 'src'), ('script', 'src'), ('source', 'src')]:
                for node in page.tags[tag]:
                    values = [node[attr]] if node.get(attr) else []
                    if node.get('srcset'):
                        values.extend(item.strip().split()[0] for item in node['srcset'].split(',') if item.strip())
                    for raw in values:
                        try:
                            url, fragment = urldefrag(urljoin(SITE + path, raw))
                            parsed = urlsplit(url)
                        except ValueError:
                            require(False, 'broken-link', path, f'Malformed URL in {tag} {attr}')
                            continue
                        if parsed.scheme not in {'http', 'https'}:
                            continue
                        if parsed.hostname not in {'pushpendra.me', 'www.pushpendra.me'}:
                            if tag == 'a':
                                external[url].add(path)
                            continue
                        dest = local_path(url)
                        targets[dest].add(path)
                        if tag == 'a':
                            require(url.startswith(SITE + '/'), 'link-canonical', path, f'Noncanonical origin in {raw}')
                            if parsed.path in paths:
                                require(not parsed.query, 'link-canonical', path, f'Internal page link has a query: {raw}')
                                if parsed.path != path:
                                    navigation[path].add(parsed.path)
                            if fragment:
                                anchors[dest, unquote(fragment)].add(path)

        for label, values in [('title', titles), ('description', descriptions)]:
            for duplicates in values.values():
                require(len(duplicates) == 1, label, ', '.join(duplicates), f'Duplicate {label}')
        reachable, pending = {'/'}, ['/']
        while pending:
            new = navigation[pending.pop()] - reachable
            reachable.update(new)
            pending.extend(new)
        for path in sorted(paths - reachable):
            require(False, 'orphan', path, 'Unreachable from the homepage through prerendered navigation links')
        if robots_body:
            check_robots(robots_body, paths | targets.keys(), require)
        collect(targets)

        redirects = []
        variants = {path + 'index.html': path for path in paths}
        variants.update({path.rstrip('/'): path for path in paths - {'/'}})
        queries = {path + '?utm_source=seo-audit': path for path in paths}
        collect(variants.keys() | queries.keys())

        def follow(start):
            chain = [start]
            while 300 <= statuses[chain[-1]][0] < 400:
                current = chain[-1]
                location = statuses[current][3].get('Location')
                if not location:
                    return chain, 'Missing Location'
                try:
                    target = urljoin(base + current, location)
                except ValueError:
                    return chain, 'Malformed Location'
                if not target.startswith(base + '/'):
                    return chain, 'Redirect leaves the audit origin'
                step = local_path(target)
                chain.append(step)
                if step in chain[:-1]:
                    return chain, 'Redirect loop'
                if len(chain) > 8:
                    return chain, 'Redirect limit exceeded'
                collect([step])
            return chain, ''

        for target in sorted(targets.keys() | variants.keys() | queries.keys()):
            chain, error = follow(target)
            code, media, body, _ = statuses.get(chain[-1], (0, '', '', {}))
            if len(chain) > 1 or error:
                redirects.append(dict(path=target, chain=chain,
                                      statuses=[statuses.get(step, (0,))[0] for step in chain], error=error))
                require(not error and len(chain) == 2, 'redirect', target, error or 'Redirect chain exceeds one hop')
            if target in targets:
                sources = ', '.join(sorted(targets[target]))
                require(len(chain) == 1 and not error, 'link-canonical', target, f'Linked redirect from {sources}')
                require(code == 200, 'broken-link', target, f'HTTP {code} from {sources}')
                if target.startswith('/og/'):
                    require(media.startswith('image/'), 'social', target, f'Expected image, got {media}')
            if target in variants:
                require(not error and chain == [target, variants[target]] and code == 200,
                        'redirect', target, f'Expected one redirect to {variants[target]}')
            if target in queries:
                canonical = [tag.get('href') for tag in Page(body).tags['link'] if tag.get('rel') == 'canonical']
                require(not error and code == 200 and canonical == [SITE + queries[target]],
                        'canonical', target, 'Tracking query must resolve to the clean canonical')

        for (target, fragment), sources in sorted(anchors.items()):
            if target in pages:
                require(pages[target].ids[fragment] == 1, 'anchor', target, f'Missing or duplicate #{fragment} from {", ".join(sorted(sources))}')

    return dict(origin=base, checks=checks, routes=sorted(paths), sitemap_routes=sorted(sitemap_paths),
                linked_resources=len(targets), issues=issues, redirects=redirects,
                external_links={url: sorted(sources) for url, sources in sorted(external.items())})


def write_reports(report, directory):
    directory.mkdir(parents=True, exist_ok=True)
    (directory / 'audit.json').write_text(json.dumps(report, indent=2) + '\n')
    lines = ['# SEO and internal link audit', '',
             f"Origin: {report['origin']}",
             f"Checks: {report['checks']} · Routes: {len(report['routes'])} · Linked targets: {report['linked_resources']}", '',
             '## Findings', '']
    lines += [f"- **{item['rule']}** `{item['path']}` — {item['message']}" for item in report['issues']] or ['No deterministic failures.']
    lines += ['', '## Redirects', '']
    for item in report['redirects']:
        hops = ' → '.join(f'{path} ({code})' for path, code in zip(item['chain'], item['statuses']))
        lines.append(f"- `{hops}` {item['error']}".rstrip())
    lines += ['', '## External links', '', 'Inventoried from HTML without requesting external sites.', '']
    lines += [f"- {url} — {', '.join(sources)}" for url, sources in report['external_links'].items()]
    (directory / 'audit.md').write_text('\n'.join(lines) + '\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', help='Audit the deployed site instead of the loopback preview')
    parser.add_argument('--dist', type=Path, default=Path('dist'))
    parser.add_argument('--reports', type=Path, default=Path('seo-reports'))
    options = parser.parse_args()
    paths = {'/' + str(file.relative_to(options.dist)).removesuffix('index.html')
             for file in options.dist.rglob('index.html')}
    if '/' not in paths:
        parser.error('Production output is missing. Run npm run build first.')
    if options.base_url:
        report = audit(options.base_url.rstrip('/'), paths)
    else:
        with build_server(str(options.dist)) as server:
            thread = Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                report = audit(f'http://127.0.0.1:{server.server_port}', paths)
            finally:
                server.shutdown()
                thread.join()
    write_reports(report, options.reports)
    print(f"SEO audit: {report['checks']} checks, {len(report['routes'])} pages, {len(report['issues'])} issues. Reports: {options.reports}")
    return bool(report['issues'])


if __name__ == '__main__':
    raise SystemExit(main())
