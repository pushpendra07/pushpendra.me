"""Run repeatable Lighthouse lab checks on the production output."""

import argparse
import json
import os
from pathlib import Path
from statistics import median
import subprocess
from threading import Thread

from seo_preview import build_server

LIGHTHOUSE = '13.6.0'
CATEGORIES = ('performance', 'accessibility', 'best-practices', 'seo')
METRICS = {
    'lcp_ms': 'largest-contentful-paint', 'fcp_ms': 'first-contentful-paint',
    'cls': 'cumulative-layout-shift', 'tbt_ms': 'total-blocking-time', 'speed_index_ms': 'speed-index',
}
# Advisory ceilings/floors leave room for runner and Chrome variance.
BUDGETS = {
    'mobile': {'performance_min': 90, 'lcp_ms_max': 2500, 'tbt_ms_max': 300, 'cls_max': 0.1},
    'desktop': {'performance_min': 95, 'lcp_ms_max': 1500, 'tbt_ms_max': 200, 'cls_max': 0.1},
}


def collect(url, profile, options, directory):
    command = ['node', options.lighthouse_cli] if options.lighthouse_cli else [
        'npm', 'exec', '--yes', f'--package=lighthouse@{LIGHTHOUSE}', '--', 'lighthouse',
    ]
    if options.chrome_path:
        os.environ['CHROME_PATH'] = options.chrome_path
    flags = [
        '--quiet', '--output=json', '--output=html',
        '--only-categories=' + ','.join(CATEGORIES),
        '--chrome-flags=--headless=new --no-first-run',
        '--blocked-url-patterns=*://*.googletagmanager.com/*',
        '--blocked-url-patterns=*://*.clarity.ms/*',
        '--blocked-url-patterns=*://*.cloudflareinsights.com/*',
    ]
    if profile == 'desktop':
        flags.append('--preset=desktop')
    samples = []
    for run in range(1, options.runs + 1):
        prefix = directory / f'{profile}-{run}'
        subprocess.run([*command, url, *flags, f'--output-path={prefix}'], check=True, timeout=120)
        result = json.loads(prefix.with_suffix('.report.json').read_text())
        if result.get('runtimeError'):
            raise RuntimeError(f'{profile} run {run} failed to collect Lighthouse metrics')
        audits = result['audits']
        sample = {key: 100 * result['categories'][key]['score'] for key in CATEGORIES}
        sample.update({key: audits[name]['numericValue'] for key, name in METRICS.items()})
        transfers = {item['resourceType']: item['transferSize']
                     for item in audits['resource-summary']['details']['items']}
        sample.update({key + '_bytes': transfers.get(key, 0)
                       for key in ('script', 'stylesheet', 'image', 'document', 'font', 'total')})
        samples.append(sample)
    return {
        'lighthouse': result['lighthouseVersion'],
        'browser': result['environment']['hostUserAgent'],
        'samples': samples,
        'median': {key: round(median(sample[key] for sample in samples), 3) for key in samples[0]},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', type=Path, default=Path('dist'))
    parser.add_argument('--reports', type=Path, default=Path('seo-reports/lighthouse'))
    parser.add_argument('--runs', type=int, default=3, choices=range(1, 6))
    parser.add_argument('--route', action='append', help='Repeat to measure several canonical paths. Default: /')
    parser.add_argument('--lighthouse-cli', help='Use an already installed Lighthouse CLI entry point')
    parser.add_argument('--chrome-path', help='Use a specific Chrome executable')
    options = parser.parse_args()
    routes = options.route or ['/']
    for route in routes:
        if not route.startswith('/') or not route.endswith('/') or '..' in route.split('/') or not (options.dist / route.strip('/') / 'index.html').is_file():
            parser.error(f'No built canonical page for {route}. Run npm run build first.')
    report = {}
    with build_server(str(options.dist)) as server:
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            for route in routes:
                directory = options.reports / (route.strip('/').replace('/', '-') or 'home')
                directory.mkdir(parents=True, exist_ok=True)
                url = f'http://127.0.0.1:{server.server_port}{route}'
                report[route] = {}
                for profile, budgets in BUDGETS.items():
                    result = collect(url, profile, options, directory)
                    values = result['median']
                    report[route][profile] = result
                    for budget, limit in budgets.items():
                        key, bound = budget.rsplit('_', 1)
                        value = values[key]
                        if (bound == 'min' and value < limit) or (bound == 'max' and value > limit):
                            print(f'Advisory: {route} {profile} {key}={value} exceeds {bound} budget {limit}.')
                    print(f"{route} {profile}: performance {values['performance']:.0f}, LCP {values['lcp_ms']:.0f} ms, CLS {values['cls']:.3f}")
        finally:
            server.shutdown()
            thread.join()
    (options.reports / 'summary.json').write_text(json.dumps(report, indent=2) + '\n')


if __name__ == '__main__':
    main()
