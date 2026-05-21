#!/usr/bin/env python3
"""PGD Fitness Planner – Mini Local Server.

Stellt die App via HTTP bereit, damit die App ohne File System Access API
direkt JSON-Dateien lesen und schreiben kann.

- GET /             → index.html
- GET /pfad/datei   → statische Dateien aus dem Projekt-Root
- GET /pgd-features/training-plan/trainingsplan-changes/_list
                    → JSON-Array aller Snapshot-Dateien
- PUT /pgd-features/training-plan/trainingsplan-changes/YYYY-MM-DD.json
                    → schreibt JSON-Snapshot (base.json ist gesperrt)
- DELETE /pgd-features/training-plan/trainingsplan-changes/YYYY-MM-DD.json
                    → löscht Snapshot-Datei (base.json + .md gesperrt)
"""
import http.server
import json
import os
import sys
import threading
import time
import webbrowser

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
CHANGES_REL = 'pgd-features/training-plan/trainingsplan-changes'
CHANGES_ABS = os.path.join(ROOT, CHANGES_REL)
LIST_PATH = f'/{CHANGES_REL}/_list'

# (relative_dir, set_of_readonly_filenames) – nur diese Pfade dürfen via PUT/DELETE
# beschrieben werden, alles andere bekommt 403.
WRITABLE_DIRS = [
    (CHANGES_REL, {'base.json', 'pgd-versioning.md'}),
    ('pgd-features/inputform', set()),  # profile.json u.a.
]


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # JSON-Dateien sollen nicht gecacht werden, damit Edits sofort sichtbar sind
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stdout.write(f'  {self.command} {self.path} → {args[1] if len(args) > 1 else ""}\n')

    # ---- GET ---------------------------------------------------------
    def do_GET(self):
        if self.path.rstrip('/') == LIST_PATH:
            try:
                files = sorted(
                    f for f in os.listdir(CHANGES_ABS)
                    if f.endswith('.json')
                )
                body = json.dumps(files).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            except Exception as e:
                self.send_error(500, f'Listing fehlgeschlagen: {e}')
                return
        super().do_GET()

    # ---- PUT ---------------------------------------------------------
    def do_PUT(self):
        full_path = self._validate_changes_path()
        if not full_path:
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            body = self.rfile.read(length)
            json.loads(body)  # Validierung
            with open(full_path, 'wb') as f:
                f.write(body)
            self.send_response(204)
            self.end_headers()
        except json.JSONDecodeError as e:
            self.send_error(400, f'Ungültiges JSON: {e}')
        except Exception as e:
            self.send_error(500, f'Schreiben fehlgeschlagen: {e}')

    # ---- DELETE ------------------------------------------------------
    def do_DELETE(self):
        full_path = self._validate_changes_path()
        if not full_path:
            return
        try:
            os.remove(full_path)
            self.send_response(204)
            self.end_headers()
        except FileNotFoundError:
            self.send_error(404)
        except Exception as e:
            self.send_error(500, f'Löschen fehlgeschlagen: {e}')

    # ---- helpers -----------------------------------------------------
    def _validate_changes_path(self):
        """Gibt den absoluten Pfad zurück, wenn sicher in einem WRITABLE_DIR und
        kein Protected File, sonst sendet einen Fehler und gibt None zurück."""
        rel = self.path.lstrip('/')
        filename = os.path.basename(rel)
        if not filename.endswith('.json'):
            self.send_error(403, 'Nur .json-Dateien')
            return None
        for (allowed_rel, protected) in WRITABLE_DIRS:
            if not rel.startswith(f'{allowed_rel}/'):
                continue
            if filename in protected:
                self.send_error(403, f'{filename} ist readonly')
                return None
            full = os.path.normpath(os.path.join(ROOT, rel))
            allowed_abs = os.path.join(ROOT, allowed_rel)
            if not full.startswith(allowed_abs + os.sep):
                self.send_error(403, 'Ungültiger Pfad')
                return None
            return full
        allowed_list = ', '.join(d for (d, _) in WRITABLE_DIRS)
        self.send_error(403, f'PUT/DELETE nur in: {allowed_list}')
        return None


def open_browser_delayed():
    time.sleep(0.8)
    webbrowser.open(f'http://localhost:{PORT}/index.html')


def main():
    os.chdir(ROOT)
    print('🏄  PGD Fitness Planner')
    print(f'    Server: http://localhost:{PORT}')
    print(f'    Verzeichnis: {ROOT}')
    print('    Browser öffnet sich gleich. Strg+C zum Beenden.\n')
    threading.Thread(target=open_browser_delayed, daemon=True).start()
    try:
        http.server.HTTPServer(('localhost', PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print('\nServer beendet.')
    except OSError as e:
        if e.errno == 48:
            print(f'Port {PORT} ist bereits belegt. Vermutlich läuft der Server schon.')
            print(f'Öffne einfach http://localhost:{PORT}/index.html im Browser.')
        else:
            raise


if __name__ == '__main__':
    main()
