"""Local static server with no-cache for HTML/CSS/JS.

Usage:  python serve.py
Then:   http://localhost:8080/
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = 8080
NO_CACHE_EXT = {".html", ".css", ".js", ".mjs", ".json", ".svg", ".map"}


class NoCacheHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        path = self.path.split("?", 1)[0]
        ext = Path(path).suffix.lower()
        if path in ("/", "") or path.endswith("/") or ext in NO_CACHE_EXT:
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def log_error(self, fmt, *args):
        if "/assets/images/" in (self.path or ""):
            return
        super().log_error(fmt, *args)

    def log_message(self, fmt, *args):
        msg = fmt % args
        if " 404 " in msg and "/assets/images/" in msg:
            return
        super().log_message(fmt, *args)


if __name__ == "__main__":
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), NoCacheHandler)
    print(f"Serwer: http://localhost:{PORT}/  (bez cache HTML/CSS/JS)")
    print("Zatrzymaj: Ctrl+C")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nZatrzymano.")
