#!/usr/bin/env bash
# Ply quick bench - laptop friendly (<1 min, no DB)
# Usage: ./quick.sh [server]  |  DUR=2s THREADS=2 CONC="32 128" ./quick.sh ply
set -euo pipefail
cd "$(dirname "$0")"

WRK=${WRK:-wrk}
DUR=${DUR:-2s}
THREADS=${THREADS:-2}
CONC=${CONC:-"32"}
REPS=${REPS:-1}
TARGET=${1:-ply}

PORT=8080
if [ "$TARGET" != "ply" ]; then
  echo "quick.sh only supports ply locally (use run.sh for full matrix)"
  exit 1
fi

if ! command -v "$WRK" >/dev/null 2>&1; then
  echo "wrk not found, fallback to go bench:"
  echo "  go test ./internal/router -bench=. -benchtime=100000x -benchmem -run=^\$"
  go test ./internal/router -bench=. -benchtime=100000x -benchmem -run='^$'
  exit 0
fi

if [ ! -x "./bin/ply" ]; then
  echo "build bin/ply first: (cd bench && go build -o bin/ply ./servers/ply 2>/dev/null || go build -o bin/ply ./ply)"
  exit 1
fi

PORT="$PORT" ./bin/ply >"/tmp/opencode/ply-quick.log" 2>&1 &
pid=$!
for _ in $(seq 1 50); do
  if curl -sf "http://127.0.0.1:$PORT/plaintext" >/dev/null 2>&1; then break; fi
  if ! kill -0 "$pid" 2>/dev/null; then echo "FAIL: ply crashed"; tail -20 /tmp/opencode/ply-quick.log; exit 1; fi
  sleep 0.2
done

for ep in plaintext json user/42 plaintextfast jsonfast; do
  path="/$ep"
  if [ "$ep" = "user/42" ]; then path="/user/42"; fi
  for c in $CONC; do
    for _ in $(seq 1 "$REPS"); do
      echo "== $ep c=$c =="
      "$WRK" -t"$THREADS" -c"$c" -d"$DUR" --latency --timeout 5s "http://127.0.0.1:$PORT$path" 2>&1 | grep -E "Requests/sec|Latency|50%|99%|Socket errors" || true
    done
  done
done

kill "$pid" 2>/dev/null || true
wait "$pid" 2>/dev/null || true
echo "== QUICK DONE (DUR=$DUR THREADS=$THREADS CONC=$CONC) =="
echo "Note: laptop numbers are relative only. For publishable numbers use CI bench."
