#!/usr/bin/env bash

pids=()

cleanup() {
  echo "Stopping..."
  for pid in "${pids[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Starting Sabo Foundation dev servers (backend + admin)..."
(cd Backend && npm run dev) & pids+=($!)
(cd admin && npm run dev) & pids+=($!)

wait