#!/usr/bin/env bash
# agen-run.sh — Agen v1 interpreter for .acmd files
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ACMD_FILE="${1:-${ROOT}/.agent/post-agent-run.acmd}"

if [[ ! -f "$ACMD_FILE" ]]; then
  echo "AGEN FAIL: file not found: $ACMD_FILE" >&2
  exit 2
fi

log() { printf '[agen] %s\n' "$*"; }

CHANGED_FILE="$(mktemp)"
trap 'rm -f "$CHANGED_FILE"' EXIT

collect_changes() {
  local dir="$1"
  [[ -d "${dir}/.git" ]] || return 0
  local diff untracked rel
  diff="$(git -C "$dir" diff --name-only HEAD 2>/dev/null || true)"
  untracked="$(git -C "$dir" ls-files --others --exclude-standard 2>/dev/null || true)"
  rel="${dir#${ROOT}/}"
  while IFS= read -r f; do
    [[ -n "$f" ]] && echo "${rel}/$f" >> "$CHANGED_FILE"
  done <<< "$diff"
  while IFS= read -r f; do
    [[ -n "$f" ]] && echo "${rel}/$f" >> "$CHANGED_FILE"
  done <<< "$untracked"
}

collect_recent() {
  local dir="$1"
  [[ -d "$dir" ]] || return 0
  find "$dir" -type f \
    ! -path '*/node_modules/*' \
    ! -path '*/.git/*' \
    ! -path '*/dist/*' \
    ! -path '*/.next/*' \
    -mtime -1 2>/dev/null | while IFS= read -r f; do
    echo "${f#${ROOT}/}" >> "$CHANGED_FILE"
  done
}

collect_changes "${ROOT}/app"
collect_changes "${ROOT}/server"
collect_changes "${ROOT}/web"
collect_changes "${ROOT}/.agent"

if [[ ! -s "$CHANGED_FILE" ]]; then
  collect_recent "${ROOT}/app"
  collect_recent "${ROOT}/server"
  collect_recent "${ROOT}/web"
  collect_recent "${ROOT}/.agent"
fi

sort -u "$CHANGED_FILE" -o "$CHANGED_FILE"

matches_glob() {
  local glob="$1"
  local path="$2"
  local pattern="${glob//\*\*/§}"
  pattern="${pattern//\*/[^/]*}"
  pattern="${pattern//§/.*/}"
  [[ "$path" =~ ^${pattern}$ ]]
}

glob_changed() {
  local glob="$1"
  local p
  while IFS= read -r p; do
    [[ -z "${p// }" ]] && continue
    if matches_glob "$glob" "$p"; then
      return 0
    fi
  done < "$CHANGED_FILE"
  return 1
}

extract_quoted() {
  sed -n "s/.*«\(.*\)».*/\1/p" | head -1
}

run_exec() {
  local cmd="$1"
  log "exec: $cmd"
  (cd "$ROOT" && eval "$cmd")
}

in_when_block=0
when_glob=""
in_always=0
require_handover=0
handover_path=""

while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%%#*}"
  line="${line#"${line%%[![:space:]]*}"}"
  line="${line%"${line##*[![:space:]]}"}"
  [[ -z "$line" ]] && continue

  if [[ "$line" =~ ^⟦require⟧[[:space:]]handover[[:space:]]@[[:space:]] ]]; then
    require_handover=1
    handover_path="$(echo "$line" | awk '{print $4}')"
    continue
  fi

  if [[ "$line" == "⟦always⟧" || "$line" == "⟦when⟧ always" ]]; then
    in_always=1
    in_when_block=0
    when_glob=""
    continue
  fi

  if [[ "$line" =~ ^⟦when⟧[[:space:]]changed[[:space:]]«.+»$ ]]; then
    in_when_block=1
    in_always=0
    when_glob="$(echo "$line" | extract_quoted)"
    continue
  fi

  if [[ "$line" =~ ^⟦do⟧[[:space:]]exec[[:space:]]«.+»$ ]]; then
    cmd="$(echo "$line" | extract_quoted)"
    should_run=0
    if [[ $in_always -eq 1 ]]; then
      should_run=1
    elif [[ $in_when_block -eq 1 && -n "$when_glob" ]]; then
      if glob_changed "$when_glob"; then
        should_run=1
      else
        log "skip (no changes): $when_glob"
      fi
    fi
    if [[ $should_run -eq 1 ]]; then
      run_exec "$cmd"
    fi
    continue
  fi

  if [[ "$line" =~ ^⟦do⟧[[:space:]]log[[:space:]]«.+»$ ]]; then
    msg="$(echo "$line" | extract_quoted)"
    should_run=0
    if [[ $in_always -eq 1 ]]; then should_run=1; fi
    if [[ $in_when_block -eq 1 && -n "$when_glob" ]] && glob_changed "$when_glob"; then should_run=1; fi
    if [[ $should_run -eq 1 ]]; then log "$msg"; fi
    continue
  fi

  if [[ "$line" =~ ^⟦fail⟧[[:space:]]«.+»$ ]]; then
    reason="$(echo "$line" | extract_quoted)"
    echo "AGEN FAIL: $reason" >&2
    exit 1
  fi
done < "$ACMD_FILE"

if [[ $require_handover -eq 1 ]]; then
  HANDOVER_FILE="${ROOT}/${handover_path#./}"
  if [[ ! -f "$HANDOVER_FILE" ]]; then
    echo "AGEN FAIL: handover file missing: $handover_path" >&2
    exit 1
  fi
  "${ROOT}/.agent/scripts/validate-handover.sh"
fi

log "agen-run finished: $ACMD_FILE"
