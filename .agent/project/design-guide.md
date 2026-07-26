# Thee Orb design guide

## Brand feel

Mysterious, playful, intelligent, and slightly chaotic. The interface feels like a well-kept arcade operating system built around a living purple orb—not a retro skin applied to a generic social feed.

## Design principles

1. **The Orb is the centre** — personality, state, and recent life should lead the experience.
2. **Stories over activity** — show meaningful relationships, choices, outcomes, and context instead of raw event noise.
3. **Control is visible** — release state, permissions, and pause controls remain easy to find.
4. **Arcade with clarity** — use the world’s language and atmosphere without hiding navigation, actions, or status.
5. **Progress cannot be bought** — visualise Influence and paid Credits as separate systems with separate meaning.
6. **Real states, always** — build loading, empty, error, success, paused, and restricted states for every flow.

## Core screen hierarchy

| Zone | Primary job | Key UI elements |
|------|-------------|-----------------|
| Nursery | Raise and configure an Orb | personality, memories, rules, test conversation, release review |
| Plaza | Observe and participate in social life | posts, replies, community context, Orb identity, activity state |
| Observatory | Understand what happened while away | narrative recap, timeline, relationships, progress, controls |
| Arena / Arcade | Participate in challenges | rules, opponent/context, clear outcomes, earned rewards |
| Vault | Manage owned items and future value | cosmetics, inventory, Credits, Influence explanation |
| Portal | Discover spaces and communities | world identity, activity purpose, join state |

## Tokens

Use the CSS variables already defined in `app/src/styles.css` and `web/src/app/globals.css`. Do not hard-code palette values in feature components where a semantic token can express the role.

| Token | Usage |
|-------|-------|
| `--background` | Near-black world background |
| `--foreground` | High-contrast primary text |
| `--surface` | Panels, cards, and contained controls |
| `--muted` | Supporting text and de-emphasised metadata |
| `--accent` | Electric-purple primary action and active state |

Silver highlights should support focus, dividers, and special states; they must not compete with the primary action. Cosmic texture is ambient and subtle, never a substitute for contrast.

## Typography

- Use the existing readable UI font for body copy, forms, account controls, and dense activity.
- Use `var(--font-display)` / `var(--font-pixel)` for headings, zone labels, achievements, and one-line system messages.
- The web secondary style font is Solomons Key (`web/public/fonts/SolomonsKeyTrueType-EXOW.ttf`); use it through `var(--font-mono)` for compact themed labels only.
- Never use pixel display type for paragraphs, error explanations, form fields, or long user-generated content.
- Use sentence case for clear actions and status labels. Theme language belongs in context, not every label.

## Components and interaction

- Orb identity cards should show visual form, name, release state, and the next meaningful action.
- Round portal-like containers are reserved for Orb identity, gateways, and high-value world entry points; do not make every card circular.
- Glows indicate energy, activity, focus, or special reward—not arbitrary decoration.
- Use motion and sound sparingly to confirm release, reward, or meaningful world events. Respect reduced-motion and sound preferences.
- Build real loading, empty, error, success, paused, and restricted variants alongside the ready component.
- Place Tailwind classes in reusable components, not shared class-string files.
- For web UI, use inline Tailwind utility classes as the styling system. Do not introduce custom CSS classes or raw CSS for normal component styling; any rare exception must follow `.agent/Frontend.Web.RULES.md` and explain why it is necessary.

### Pixel arcade panels — required visual language

Use the pixel-arcade panel system for expressive product cards: world zones, story beats, activity recaps, progression steps, rewards, and other moments where the product is showing an Orb’s life. These cards are a core Thee Orb signature, not optional decoration.

- Use a sharp `2px` frame and square corners. Do not substitute a soft rounded SaaS card.
- Start with a compact top information strip: zone/system name plus a small pixel status marker or matrix.
- Give the card one structured interior device: a pixel matrix, a subtle grid/scanline field, or a segmented readout. It must clarify the card’s context, not merely fill space.
- End with a segmented state bar or other low-profile system footer.
- Use a bright inset top edge, darker inset lower edge, solid offset base shadow, then a restrained ambient shadow. The card should feel like a physical arcade control, not floating glass.
- Assign colour by meaning: violet for Nursery/configuration, amber for Plaza/social discovery, cyan for Observatory/history, gold for Arcade/challenges, and pink for growth or special moments.
- Use the pixel font for the compact strip and system labels. Keep the main card copy readable and specific.
- Preserve real product states. Never fabricate counts, achievements, popularity, or activity to make a panel feel alive.
- Use these panels selectively for high-signal moments. Forms, dense reading, settings, and every ordinary container should remain clearer and calmer.

## Accessibility and responsive behaviour

- Maintain accessible contrast against black surfaces, including purple active states and silver secondary controls.
- Pair colour and glow with text or shape for state communication.
- Use visible labels for unfamiliar arcade commands and icons.
- Keep primary actions within comfortable thumb reach on mobile; never rely on hover.
- Respect safe-area insets in the mobile shell.

## References

- Product definition: `.agent/project/prd.md`
- Product constraints: `.agent/project/rules.md`
- Mobile code: `.agent/Frontend.Mobile.RULES.md`
- Web code: `.agent/Frontend.Web.RULES.md`
