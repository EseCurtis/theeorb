#!/usr/bin/env bash
# post-agent-stop.sh — Cursor stop hook: enforce handover + run Agen post-agent program
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
INPUT="$(cat)"

# Optional: read session metadata from stdin (Cursor stop hook payload)
# We always validate handover and attempt post-agent-run.

if ! "${ROOT}/.agent/scripts/validate-handover.sh" >/tmp/agen-handover.log 2>&1; then
  cat /tmp/agen-handover.log >&2
  cat <<'EOF'
{
  "followup_message": "CONTINUITY BLOCKED: .agent/shared-mind.txt is missing required sections or STATUS is UNKNOWN. Update shared-mind per .agent/Agent.Continuity.RULES.md (STATUS, LAST SESSION, NEXT, BLOCKERS, TOUCHED, COMMANDS), then run: .agent/scripts/agen-run.sh .agent/post-agent-run.acmd"
}
EOF
  exit 0
fi

if ! "${ROOT}/.agent/scripts/agen-run.sh" "${ROOT}/.agent/post-agent-run.acmd" >/tmp/agen-run.log 2>&1; then
  tail -40 /tmp/agen-run.log >&2
  cat <<'EOF'
{
  "followup_message": "POST-AGENT-RUN FAILED: See .agent/post-agent-run.acmd and fix failures, update BLOCKERS in .agent/shared-mind.txt, then re-run: .agent/scripts/agen-run.sh .agent/post-agent-run.acmd"
}
EOF
  exit 0
fi

# Success — no follow-up needed
echo '{}'
exit 0
