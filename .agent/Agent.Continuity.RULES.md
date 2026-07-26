# Agent Continuity Rules

**Priority:** MAX — overrides convenience. Every agent session must comply.

---

## 1. Shared mind is mandatory

| When | Action |
|------|--------|
| Session **start** | Read `.agent/shared-mind.txt` before planning or editing |
| Session **end** | Rewrite `STATUS`, `LAST_SESSION`, `NEXT`, `BLOCKERS`, `TOUCHED`, `COMMANDS` in `.agent/shared-mind.txt` |
| Subagent handoff | Subagents write findings into `LAST SESSION` or `NEXT` before returning |

**Forbidden:** ending a session with `STATUS: UNKNOWN` or stale `LAST SESSION` after making changes.

---

## 2. Post-agent-run is mandatory

After repo changes, before telling the user you are done:

```sh
.agent/scripts/agen-run.sh .agent/post-agent-run.acmd
```

If it fails, fix the failure or document the blocker in `BLOCKERS` and `STATUS`.

**Forbidden:** claiming "done" when post-agent-run failed silently.

---

## 3. Git checkpoints are mandatory

Every agent session that changes the repo must create git checkpoints before edits, at each meaningful milestone, and after verification.

| When | Action |
|------|--------|
| Before new edits | If the worktree is dirty, commit the existing state before making new changes |
| During work | Commit every meaningful completed milestone before starting the next milestone |
| After verification | Commit all session changes after updating `.agent/shared-mind.txt` and running required checks |

Required sequence:

```sh
git status --short
# If dirty before edits:
git add .
git commit -m "checkpoint: before agent changes"

# Make one coherent milestone worth of changes.
git add .
git commit -m "<type>: <milestone summary>"

# Repeat milestone commits as work progresses.

# Update .agent/shared-mind.txt and run verification.
git add .
git commit -m "<type>: <final summary>"
.agent/scripts/agen-run.sh .agent/post-agent-run.acmd
```

Milestone commits are required when any of these boundaries are reached:
- A feature slice works independently, such as backend schema/API, frontend layout, or asset workflow.
- A risky refactor is complete before dependent changes begin.
- Generated assets or migrations are produced.
- A verification pass succeeds for a subset of the work.
- The next step would touch a different surface, such as moving from `server/` to `app/` or `web/`.

The post-run program validates that the worktree is clean. If it fails because the worktree is dirty, commit the remaining changes and run post-agent-run again.

Allowed exceptions:
- User explicitly says not to commit.
- Git is unavailable or the repository has no commits yet; document the blocker in `BLOCKERS`.
- A generated file changes during post-run and should not be committed; add the correct ignore rule, commit that rule, and rerun post-agent-run.

**Forbidden:**
- Doing all substantial work in one final commit when multiple meaningful milestones were completed.
- Ending a repo-changing session with uncommitted changes unless the user explicitly requested no commits.

### Manual changes are protected

Treat every uncommitted change as user-owned unless the current agent can prove it wrote the change in the same uninterrupted action. A dirty file is never permission to correct, tidy, overwrite, or revert it.

Required flow when the worktree is dirty:

1. Inspect `git diff` and preserve the exact change in a checkpoint commit before starting new work, unless the user explicitly says not to commit.
2. Keep the checkpoint isolated from agent work; do not fold manual edits into a feature commit.
3. Before editing any file, re-check `git status --short`. If a file changed after the initial checkpoint, stop editing that file. Do not restore it, rename its classes, or remove its content without the user's explicit instruction.
4. If a post-run finds a fresh manual change, preserve it in a new checkpoint and rerun post-run. Never "repair" a manual change merely because it breaks the agent's implementation, lint, or visual result.

**Forbidden:**
- Reverting, overwriting, hiding, deleting, or "fixing" a manual edit without an explicit user request.
- Reusing a manual diff as if it were an agent-authored change in a later feature commit.

---

## 4. Agen is the only post-run DSL

Post-run automation lives in `.acmd` files using **Agen v1** (see `.agent/ACMD.md`).

**Forbidden:**
- One-off post-run shell scripts in chat without adding to `post-agent-run.acmd`
- Skipping `⟦require⟧ handover` checks

**Allowed:**
- Adding new `⟦when⟧ changed «glob»` blocks to `post-agent-run.acmd` when a package needs recurring verification

---

## 5. Handover content contract

`LAST SESSION` — what you did, files touched, decisions made (3–8 bullets)  
`NEXT` — exact next steps for the next agent (actionable, ordered)  
`BLOCKERS` — `none` or concrete blockers with paths/commands  
`TOUCHED` — glob or path list  
`COMMANDS` — commands you ran and pass/fail  

Write for a **cold-start agent** with no chat history.

---

## 6. What works for all agents vs Cursor only

| Layer | Portable (any agent) | Cursor only |
|-------|----------------------|-------------|
| Handover | `.agent/shared-mind.txt` | — |
| Rules docs | `.agent/*.RULES.md`, `.agent/Agent.Continuity.RULES.md` | — |
| Post-run | `.agent/post-agent-run.acmd` + `agen-run.sh` (manual or CI) | — |
| Auto-inject rules | — | `.cursor/rules/*.mdc` (`alwaysApply`) |
| Auto-enforce on stop | — | `.cursor/hooks.json` → `post-agent-stop.sh` |

**All agents** (Codex, Claude Code, other IDEs): must read `.agent/shared-mind.txt` and follow `.agent/Agent.Continuity.RULES.md` when the user or repo points them there. They must run `agen-run.sh` before claiming done.

**Cursor agents only** get automatic rule injection and `stop` hook follow-ups. If you use a non-Cursor agent, you enforce continuity by instruction or CI running `agen-run.sh`.

---

## 7. Hook enforcement (Cursor)

`.cursor/hooks.json` runs `post-agent-stop.sh` on agent `stop`.  
If handover is invalid, the hook requests a follow-up to fix `.agent/shared-mind.txt`.

Cursor agents must treat hook failures as blocking.

---

## 8. Relationship to other rules

- `.agent/Server.RULES.md` — server code shape
- `.agent/Frontend.Mobile.RULES.md` — app code shape
- `.agent/Frontend.Web.RULES.md` — web code shape
- **This file** — session continuity (always applies)

When in conflict on session exit: **continuity rules win**.

---

## 9. Checklist (every session end)

- [ ] Read shared-mind at start (acknowledge in thinking or first action)
- [ ] Committed any pre-existing dirty worktree before new edits, unless user said not to commit
- [ ] Committed each meaningful milestone before starting the next milestone
- [ ] Preserved all manual/uncommitted edits in isolated checkpoints without modifying them
- [ ] Updated `.agent/shared-mind.txt` all required sections
- [ ] Ran relevant verification commands
- [ ] Committed all session changes
- [ ] Ran `.agent/scripts/agen-run.sh .agent/post-agent-run.acmd` and it passed with a clean worktree
- [ ] `STATUS` reflects true state (DONE / IN_PROGRESS / BLOCKED)
- [ ] `NEXT` is actionable without chat context
