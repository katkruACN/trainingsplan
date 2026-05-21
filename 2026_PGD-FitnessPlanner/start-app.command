#!/bin/bash
# PGD Fitness Planner – Server starten
# Doppelklick auf diese Datei startet den lokalen Mini-Server und öffnet die App.
cd "$(dirname "$0")"
exec python3 server.py
