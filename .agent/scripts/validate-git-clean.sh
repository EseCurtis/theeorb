#!/usr/bin/env bash
# validate-git-clean.sh — enforces committed handoff state
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

cd "$ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "GIT CLEAN FAIL: not inside a git worktree" >&2
  exit 1
fi

if [[ -n "$(git status --short)" ]]; then
  echo "GIT CLEAN FAIL: uncommitted changes remain" >&2
  git status --short >&2
  exit 1
fi

echo "GIT CLEAN OK: worktree committed"
