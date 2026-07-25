#!/usr/bin/env bash
# session-start.sh — remind agents to read shared-mind at session start
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MIND="${ROOT}/.agent/shared-mind.txt"

if [[ ! -f "$MIND" ]]; then
  echo '{}'
  exit 0
fi

# sessionStart hook: emit follow-up context when supported
printf '%s\n' '{}'
exit 0
