#!/usr/bin/env python3
"""PGD Fitness Planner – Mini Local Server.

- GET  /             → index.html
- GET  /pfad/datei   → statische Dateien aus dem Projekt-Root
- GET  /pfad/_list   → JSON-Array (Dateien direkt, Ordner mit trailing /)
- PUT  /pfad/datei.json    → schreibt JSON (nur unter WRITABLE_DIRS)
- DELETE /pfad/datei.json  → löscht Datei
- DELETE /users/{id}       → löscht User-Ordner rekursiv
- POST /api/generate-plan  → ruft Claude API, erzeugt plan-v1.json aus Profil
"""
import http.server
import json
import os
import re
import shutil
import sys
import threading
import time
import urllib.request
import urllib.error
import webbrowser

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
USERS_REL = 'pgd-features/training-plan/users'
USERS_ABS = os.path.join(ROOT, USERS_REL)

# (relative_dir, set_of_readonly_filenames) – nur diese Pfade dürfen via PUT/DELETE
# beschrieben werden, alles andere bekommt 403.
WRITABLE_DIRS = [
    (USERS_REL, set()),  # users/<id>/{profile,plan-v1}.json + users/<id>/changes/*.json
]

USER_FOLDER_PATTERN = re.compile(rf'^{re.escape(USERS_REL)}/[^/]+/?$')

CLAUDE_MODEL = 'claude-sonnet-4-6'
CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'


def load_dotenv():
    """Lädt .env-Variablen aus Projekt-Root, falls vorhanden."""
    env_path = os.path.join(ROOT, '.env')
    if not os.path.exists(env_path):
        return
    with open(env_path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            k, v = line.split('=', 1)
            k = k.strip()
            v = v.strip().strip("'").strip('"')
            if k and k not in os.environ:
                os.environ[k] = v


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stdout.write(f'  {self.command} {self.path} → {args[1] if len(args) > 1 else ""}\n')

    # ---- GET ---------------------------------------------------------
    def do_GET(self):
        # Generisches _list-Endpoint
        if self.path.rstrip('/').endswith('/_list'):
            self._handle_list()
            return
        super().do_GET()

    def _handle_list(self):
        rel_dir = self.path.rstrip('/').rsplit('/_list', 1)[0].lstrip('/')
        full = os.path.normpath(os.path.join(ROOT, rel_dir))
        # Security: nur unter USERS_ABS oder ROOT-Unterordner ohne Path-Traversal
        if not full.startswith(ROOT + os.sep):
            self.send_error(403, 'Ungültiger Pfad')
            return
        if not os.path.isdir(full):
            self.send_error(404, f'{rel_dir} ist kein Ordner')
            return
        try:
            entries = []
            for name in sorted(os.listdir(full)):
                if name.startswith('.'):
                    continue
                p = os.path.join(full, name)
                if os.path.isdir(p):
                    entries.append(name + '/')
                elif name.endswith('.json'):
                    entries.append(name)
            body = json.dumps(entries).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self.send_error(500, f'Listing fehlgeschlagen: {e}')

    # ---- PUT ---------------------------------------------------------
    def do_PUT(self):
        full_path = self._validate_write_path()
        if not full_path:
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            body = self.rfile.read(length)
            json.loads(body)  # Validierung
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
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
        rel = self.path.lstrip('/').rstrip('/')
        # Rekursives Delete eines User-Ordners erlauben
        if USER_FOLDER_PATTERN.match(rel + '/') or USER_FOLDER_PATTERN.match(rel):
            full = os.path.normpath(os.path.join(ROOT, rel))
            if not full.startswith(USERS_ABS + os.sep):
                self.send_error(403, 'Ungültiger User-Pfad')
                return
            if not os.path.isdir(full):
                self.send_error(404)
                return
            try:
                shutil.rmtree(full)
                self.send_response(204)
                self.end_headers()
                return
            except Exception as e:
                self.send_error(500, f'User-Löschen fehlgeschlagen: {e}')
                return
        # Sonst: einzelne Datei
        full_path = self._validate_write_path()
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

    # ---- POST (Claude API Proxy) -------------------------------------
    def do_POST(self):
        if self.path != '/api/generate-plan':
            self.send_error(404, 'Nur /api/generate-plan unterstützt POST')
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            body = json.loads(self.rfile.read(length))
            profile = body.get('profile')
            if not profile:
                self.send_error(400, 'profile fehlt im Body')
                return
            plan = generate_plan_via_claude(profile)
            response_body = json.dumps({'plan': plan}, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(response_body)))
            self.end_headers()
            self.wfile.write(response_body)
        except RuntimeError as e:
            self.send_error(503, str(e))
        except urllib.error.HTTPError as e:
            detail = e.read().decode('utf-8', errors='replace')
            self.send_error(502, f'Claude API HTTP {e.code}: {detail[:200]}')
        except json.JSONDecodeError as e:
            self.send_error(502, f'Claude Antwort nicht parsebar: {e}')
        except Exception as e:
            self.send_error(500, f'Plan-Generierung fehlgeschlagen: {e}')

    # ---- helpers -----------------------------------------------------
    def _validate_write_path(self):
        """Gibt absoluten Pfad zurück, wenn sicher in einem WRITABLE_DIR und
        kein Protected File, sonst sendet Error und gibt None zurück."""
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


# === Claude API Integration =====================================
SYSTEM_PROMPT = """Du bist ein Fitness-Coach und erstellst personalisierte 6-Wochen-Trainingspläne.

OUTPUT: Antworte AUSSCHLIESSLICH mit einem gültigen JSON-Objekt. Kein Text davor oder danach, keine Code-Fences.

SCHEMA (exakt einhalten):
{
  "meta": {
    "version": "base",
    "schemaVersion": 4,
    "createdAt": "<YYYY-MM-DD>",
    "phaseName": "<Kurzer Ziel-Titel>"
  },
  "weeks": [
    {
      "weekIdx": <0-5>,
      "phase": "<Phasen-Name>",
      "dateRange": "<Datums-Bereich>",
      "goal": "<Wochenziel in 1 Satz>",
      "days": [
        {
          "dayIdx": <0-6>,
          "weekday": "Mo|Di|Mi|Do|Fr|Sa|So",
          "date": "<Tag. Monat>",
          "units": [
            {
              "unitId": "w<wIdx>-d<dIdx>-u<uIdx>",
              "category": "<Kategorie-Key>",
              "title": "<Titel>",
              "description": "<Kurze Beschreibung>",
              "detail": ["<Übung 1>", "<Übung 2>"],
              "duration": <Minuten>,
              "completed": false
            }
          ]
        }
      ]
    }
  ]
}

KATEGORIEN (genau diese Keys verwenden):
- mobility, yoga, balance (= Stabilität & Beweglichkeit)
- rad, laufen, paddeln, schwimmen, kraft, kraft-upper (= Paddel Power)
- kraft-lower, hiit, popup, surfen-eisbach, surfen-o2, surfen-jochen (= Surf Strength)
- erholung

PHASEN (Reihenfolge fest):
- Woche 0: "Slow Start"   (11.–17. Mai)
- Woche 1: "Get ready"    (18.–24. Mai)
- Woche 2: "Perform"      (25.–31. Mai)
- Woche 3: "Accelerate"   (1.–7. Juni)
- Woche 4: "Peak-Block"   (8.–14. Juni)
- Woche 5: "Tapering"     (15.–21. Juni)

WOCHENTAGE (dayIdx → weekday → Datum für Woche X):
- 0=Mo, 1=Di, 2=Mi, 3=Do, 4=Fr, 5=Sa, 6=So
- Beispiel Woche 0: Mo=11. Mai, Di=12. Mai, ..., So=17. Mai

CONSTRAINTS:
- 6 Wochen × 7 Tage = 42 Tage komplett (auch leere Tage als units: [])
- Max 3 Einheiten pro Tag
- unitId immer w<w>-d<d>-u<u> mit korrekten Indizes
- Berücksichtige Profil-Level: Anfänger kürzer/leichter, Fortgeschrittene mehr Volumen & Intensität
- Logische Progression: leichter Anfang → Peak in Woche 4 → Tapering in Woche 5
- An mind. 1 Tag/Woche eine Erholungs-Einheit (category: erholung) oder freier Tag

Antworte NUR mit dem JSON, keine Erklärung."""


def build_user_message(profile):
    profile_str = json.dumps(profile, indent=2, ensure_ascii=False)
    return (
        f"Erstelle einen personalisierten 6-Wochen-Trainingsplan für folgendes Profil.\n\n"
        f"Profil:\n{profile_str}\n\n"
        f"Wichtig: Antworte nur mit dem JSON-Objekt entsprechend dem Schema."
    )


def generate_plan_via_claude(profile):
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        raise RuntimeError(
            'ANTHROPIC_API_KEY nicht gesetzt. Bitte .env-Datei mit deinem '
            'Anthropic-Key im Projekt-Root anlegen.'
        )
    body = {
        'model': CLAUDE_MODEL,
        'max_tokens': 16000,
        'system': [
            {'type': 'text', 'text': SYSTEM_PROMPT, 'cache_control': {'type': 'ephemeral'}}
        ],
        'messages': [
            {'role': 'user', 'content': build_user_message(profile)}
        ]
    }
    data = json.dumps(body).encode('utf-8')
    req = urllib.request.Request(
        CLAUDE_API_URL,
        method='POST',
        data=data,
        headers={
            'x-api-key': api_key,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        }
    )
    with urllib.request.urlopen(req, timeout=120) as res:
        result = json.loads(res.read())
    blocks = result.get('content', [])
    text = ''.join(b.get('text', '') for b in blocks if b.get('type') == 'text').strip()
    # Markdown-Fences entfernen, falls Claude welche hinzufügt
    if text.startswith('```'):
        first_nl = text.find('\n')
        last_fence = text.rfind('```')
        if first_nl > 0 and last_fence > first_nl:
            text = text[first_nl + 1:last_fence].strip()
    return json.loads(text)


def open_browser_delayed():
    time.sleep(0.8)
    webbrowser.open(f'http://localhost:{PORT}/index.html')


def main():
    load_dotenv()
    os.chdir(ROOT)
    print('🏄  PGD Fitness Planner')
    print(f'    Server: http://localhost:{PORT}')
    print(f'    Verzeichnis: {ROOT}')
    api_status = 'aktiv' if os.environ.get('ANTHROPIC_API_KEY') else 'NICHT konfiguriert (.env fehlt)'
    print(f'    Claude API: {api_status}')
    print('    Browser öffnet sich gleich. Strg+C zum Beenden.\n')
    threading.Thread(target=open_browser_delayed, daemon=True).start()
    try:
        http.server.HTTPServer(('localhost', PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print('\nServer beendet.')
    except OSError as e:
        if e.errno == 48:
            print(f'Port {PORT} ist bereits belegt. Server läuft schon?')
            print(f'Öffne http://localhost:{PORT}/index.html im Browser.')
        else:
            raise


if __name__ == '__main__':
    main()
