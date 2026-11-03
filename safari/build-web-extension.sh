#!/bin/sh
set -eu

# Xcode runs build phases with a minimal PATH that excludes user-installed tools.
export PATH="$HOME/.local/share/mise/shims:$HOME/.bun/bin:$PATH"

if ! command -v bun >/dev/null 2>&1; then
  echo "error: bun is not on PATH; install it (for example with 'mise install') and rebuild" >&2
  exit 1
fi

cd "$(dirname "$0")/.."
bun run build
