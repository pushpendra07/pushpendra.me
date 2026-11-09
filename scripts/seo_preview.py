"""Serve the static build with the clean URLs used by Cloudflare Pages."""

import argparse
from functools import lru_cache, partial
import gzip
from io import BytesIO
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit



@lru_cache(maxsize=64)
def compressed_file(path, modified):
    return gzip.compress(path.read_bytes(), mtime=0)


class BuildHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory, **kwargs):
        self.root = Path(directory)
        super().__init__(*args, directory=directory, **kwargs)

    def send_head(self):
        url = urlsplit(self.path)
        target = Path(self.translate_path(url.path))
        redirect = None
        if target.is_file() and url.path.endswith('/index.html'):
            redirect = url.path.removesuffix('index.html')
        elif target.is_dir() and (target / 'index.html').is_file():
            if not url.path.endswith('/'):
                redirect = url.path + '/'
        elif not target.is_file():
            error_page = self.root / '404.html'
            if error_page.is_file():
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(error_page.stat().st_size))
                self.end_headers()
                return error_page.open('rb')
        if redirect:
            self.send_response(308)
            self.send_header('Location', urlunsplit(('', '', redirect, url.query, '')))
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        source = target / 'index.html' if target.is_dir() else target
        media = self.guess_type(str(source))
        accepts_gzip = any(encoding.strip() == 'gzip' for encoding in self.headers.get('Accept-Encoding', '').split(','))
        compressible = media.startswith('text/') or media in {'application/javascript', 'application/xml'}
        if source.is_file() and compressible and accepts_gzip:
            payload = compressed_file(source, source.stat().st_mtime_ns)
            self.send_response(200)
            self.send_header('Content-Type', media)
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Vary', 'Accept-Encoding')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            return BytesIO(payload)
        return super().send_head()

    def end_headers(self):
        headers = self.root / '_headers'
        if headers.is_file():
            for line in headers.read_text().splitlines():
                if line.startswith('  Content-Security-Policy: '):
                    self.send_header('Content-Security-Policy', line.partition(': ')[2])
                    break
        super().end_headers()

    def log_message(self, *_):
        pass


def build_server(directory='dist', port=0):
    return ThreadingHTTPServer(('127.0.0.1', port), partial(BuildHandler, directory=directory))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', default='dist')
    parser.add_argument('--port', type=int, default=4173)
    options = parser.parse_args()
    with build_server(options.directory, options.port) as server:
        server.serve_forever()
