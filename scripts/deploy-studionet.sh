#!/usr/bin/env bash
set -euo pipefail
if ! command -v genlayer >/dev/null 2>&1; then echo "GenLayer CLI not found. Install current CLI first: npm install -g genlayer" >&2; exit 1; fi
echo "Using active GenLayer CLI account; this script never reads or writes secret material."
genlayer network studionet
genlayer account show --rpc https://studio.genlayer.com/api
genlayer deploy --contract contracts/canonmesh.py --rpc https://studio.genlayer.com/api
echo "Record only verified public deployment facts in DEPLOYMENT.json and handoff.md."
