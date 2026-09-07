import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class DevHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def start_server(preferred_port=8081):
    port = preferred_port
    while port < 65535:
        try:
            server = ThreadingHTTPServer(('0.0.0.0', port), DevHandler)
            print(f"Threading dev server running on port {port}")
            print(f"Local URL: http://localhost:{port}/")
            server.serve_forever()
            break
        except OSError:
            print(f"Port {port} in use, trying port {port + 1}...")
            port += 1

if __name__ == '__main__':
    requested_port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
    start_server(requested_port)
