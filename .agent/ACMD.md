# Agen — Agent Command Language

**Extension:** `.acmd`  
**Version:** 1  
**Runner:** `.agent/scripts/agen-run.sh`

Agen is the native post-agent command language for this repo. Agents do not invent ad-hoc shell scripts for post-run work. They declare work in `.acmd` files and the runner executes it.

---

## Syntax

| Sigil | Meaning |
|-------|---------|
| `⟦program⟧` | Names this `.acmd` file |
| `⟦version⟧` | Schema version (must be `1`) |
| `⟦require⟧` | Mandatory contract checked before exit |
| `⟦when⟧ changed «glob»` | Run nested `⟦do⟧` only if paths match |
| `⟦when⟧ always` | Alias of `⟦always⟧` |
| `⟦always⟧` | Always run nested `⟦do⟧` |
| `⟦do⟧ exec «cmd»` | Run shell command; fail on non-zero exit |
| `⟦do⟧ log «text»` | Print to runner log |
| `⟦do⟧ skip «reason»` | Skip with reason (non-fatal) |
| `⟦fail⟧ «reason»` | Abort runner with error |

**Comments:** lines starting with `#`  
**Strings:** `«double-angle quoted»` only  
**Globs:** `«app/**»`, `«server/**»`, `«web/**»`, `«.agent/**»`

---

## Handover contract

Every agent session that changes code **must** update `.agent/shared-mind.txt` before finishing.

Required sections (exact headings):

```txt
## STATUS
## LAST SESSION
## NEXT
## BLOCKERS
## TOUCHED
## COMMANDS
```

`⟦require⟧ handover @ .agent/shared-mind.txt` validates these headings exist and `STATUS` is not `UNKNOWN`.

---

## Example

```acmd
⟦program⟧ post-agent-run
⟦version⟧ 1

⟦require⟧ handover @ .agent/shared-mind.txt
  fields: STATUS, LAST_SESSION, NEXT, BLOCKERS, TOUCHED, COMMANDS

⟦when⟧ changed «app/**»
  ⟦do⟧ exec «cd app && pnpm exec tsc --noEmit»

⟦always⟧
  ⟦do⟧ log «agen post-agent-run finished»
```

---

## Rules for agents

1. **Read** `.agent/shared-mind.txt` at session start.
2. **Write** `.agent/shared-mind.txt` at session end (overwrite session block, preserve history tail if useful).
3. **Never** finish without running: `.agent/scripts/agen-run.sh .agent/post-agent-run.acmd`
4. **Never** add post-run shell steps outside `.acmd` without updating `post-agent-run.acmd` first.
5. If a new recurring post-run task is needed, add it to `post-agent-run.acmd`, not to chat.

---

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | All required checks and commands passed |
| `1` | Handover or command failure |
| `2` | Invalid `.acmd` syntax |
