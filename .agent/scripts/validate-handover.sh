#!/usr/bin/env bash
# validate-handover.sh — enforces .agent/shared-mind.txt contract
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MIND="${ROOT}/.agent/shared-mind.txt"

required_sections=(
  "## STATUS"
  "## LAST SESSION"
  "## NEXT"
  "## BLOCKERS"
  "## TOUCHED"
  "## COMMANDS"
)

if [[ ! -f "$MIND" ]]; then
  echo "HANDOVER FAIL: missing $MIND" >&2
  exit 1
fi

for section in "${required_sections[@]}"; do
  if ! grep -q "^${section}$" "$MIND"; then
    echo "HANDOVER FAIL: missing section ${section}" >&2
    exit 1
  fi
done

status_line="$(awk '/^## STATUS$/{found=1; next} found && NF{print; exit}' "$MIND")"
if [[ -z "${status_line// }" ]]; then
  echo "HANDOVER FAIL: STATUS section is empty" >&2
  exit 1
fi

if echo "$status_line" | grep -qi 'UNKNOWN'; then
  echo "HANDOVER FAIL: STATUS must not be UNKNOWN at session end" >&2
  exit 1
fi

echo "HANDOVER OK: shared-mind.txt valid"
