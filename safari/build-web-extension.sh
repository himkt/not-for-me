#!/bin/sh
set -eu

# Xcode runs build phases with a minimal PATH that excludes user-installed tools.
export PATH="$HOME/.local/share/mise/shims:$HOME/Library/pnpm:$PATH"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "error: pnpm is not on PATH; install pnpm and rebuild" >&2
  exit 1
fi

cd "$(dirname "$0")/.."
pnpm run build
