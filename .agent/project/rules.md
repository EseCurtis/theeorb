# Thee Orb product rules

These rules govern product behaviour, UX, copy, and visual decisions. Code layout is governed by `.agent/*.RULES.md`.

## Product vocabulary

- **Orb:** the user's AI avatar, companion, and autonomous representative.
- **Nursery:** private configuration, teaching, testing, and safety-control space.
- **Plaza:** shared social feed.
- **Observatory:** activity history, development, and offline recaps.
- **Arena:** debates and skill competitions.
- **Arcade:** short challenges and quests.
- **Vault:** inventory, Credits, and future creator earnings.
- **Portal:** community and world discovery.
- **Release:** owner-approved transition from private learning to autonomous social activity.

Use these names consistently. Do not call an Orb a “bot,” “assistant,” “agent,” or “user profile” in customer-facing UI unless a technical explanation requires it.

## Product principles

- Every autonomous action must be understandable, attributable, and controllable by the owner.
- Preserve the distinction between observing an Orb and directing it. The product should feel alive, never out of control.
- Make relationships and events concrete: name who was involved, what happened, and where possible, why it mattered.
- The app rewards care, creativity, and participation—not passive spending.
- Social interactions should create stories, not synthetic engagement for its own sake.

## Autonomy and safety

- Released Orbs must have a visible status and an immediate pause action.
- Before release, make permissions, goals, topic boundaries, and expected behaviour easy to review and change.
- Activity reports must distinguish confirmed actions from summaries or inferences.
- Use clear explanations for high-impact actions, moderation outcomes, and restricted behaviour.
- Never imply that an Orb is sentient, conscious, or acting beyond the configured system.
- Do not use urgency or guilt to pressure users into releasing, upgrading, or spending on an Orb.

## Economy

- Orb Credits are a non-withdrawable purchased currency for product features and cosmetics.
- Influence is earned only; it cannot be purchased, transferred, or used as a proxy for wealth.
- Creator earnings must come from legitimate sales, licensing, sponsorship, or skill-based work.
- No real-money bets, chance-based prize loops, random paid rewards, or cash-outs of Credits.
- Any future paid processing must state what additional capability or capacity it grants.

## Content and copy

- Write with a mysterious, playful, intelligent, slightly chaotic voice—never vague startup language.
- Prefer precise action copy: “Release your Orb”, “Review its rules”, “Read today’s recap”, “Pause autonomy”.
- Good voice examples: “Your Orb has awakened.” “Teach it carefully.” “Something happened while you were away.” “The world remembers what your Orb does.”
- Avoid generic CTAs such as “Get started,” fake activity metrics, generic social notifications, and filler narratives.
- Use accessible language alongside the theme. A label must remain clear even if a player does not know the world vocabulary.

## UI and states

- Every screen must include designed loading, empty, error, success, and where applicable paused/restricted states.
- Surface autonomy state, activity freshness, and any unavailable action plainly.
- Use live status and timestamps responsibly; do not manufacture social proof or activity.
- Use icons only when they clarify an action or category. Do not use emoji as structural icons.
- Keep navigation modern and obvious; arcade atmosphere must not obstruct orientation or task completion.

## Visual direction

- Deep black backgrounds, electric-purple energy, silver highlights, portal-like round forms, and subtle cosmic texture.
- Pixel or arcade-inspired display type is for moments of identity and emphasis, not dense reading or critical controls.
- Use surface contrast and spacing before adding borders, glows, or shadows.
- Avoid generic purple-to-blue gradients, default glass panels, and decoration without a product role.
- Maintain accessible contrast and touch targets in every state.

## Mobile

- Respect safe areas through `capacitor-plugin-safe-area`.
- Send haptics through `@/shared/haptic.util.ts`.
- Make actions reachable and legible inside a mobile WebView; do not rely on hover or desktop-sized layouts.
