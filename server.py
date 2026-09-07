from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class DevHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    port = 8080
    server = ThreadingHTTPServer(('0.0.0.0', port), DevHandler)
    print(f"Threading dev server running on port {port}")
    server.serve_forever()
