# TheeOrb design guide

## Brand feel

Mysterious, playful, warm, and intelligent: a polished arcade operating system for deliberate human connections. The Orb is the visual centre, while the people and their consent remain the product centre.

## Experience principles

1. **Consent is visible** — recommendation, acceptance, match, and chat states never blur together.
2. **An Orb explains, not decides** — explain compatibility in direct language and preserve owner choice.
3. **Privacy is felt** — use city and approximate distance, not maps, contact data, or private dialogue.
4. **Arcade with calm** — use pixel panels for discovery, match moments, and Orb history; keep forms and chat crisp.
5. **Real states always** — never use fake activity to fill an empty Discover, Matches, or Chats view.

## Primary navigation

| Destination | Job |
| --- | --- |
| Discover | Review five daily Orb recommendations, clearly marked Dating or Friendship. |
| Matches | Review pending mutual decisions and established connections. |
| Chats | Read and send text messages only after a mutual match. |
| Orb | Train the Orb in the Nursery and review its matching activity. |
| Settings | Profile, photos, preferences, discovery pause, safety, and account controls. |

## Setup flow

Use a progressive, resumable flow with a visible step indicator and back action:

1. Account and adult eligibility.
2. Identity, intent, and matching preferences.
3. Four-to-six photos, bio, and prompts.
4. Location and discovery controls.
5. Orb identity and matching boundaries.

Use clear field labels, helper text, field-level errors, upload progress, and a safe recovery path. Pixel type may label steps and panels; it remains universal in the app only when it preserves legibility at body size.

## Visual system

- Deep black background, electric violet as the primary action colour, and semantically assigned amber (Discover), cyan (Orb history), pink (safety/special), and green (confirmed match) accents.
- Follow existing semantic tokens instead of new raw colours in feature code where a token is available.
- Use the established pixel-arcade panel system selectively: sharp 2px frame, compact system strip, purposeful interior readout, segmented footer, inset edges, and solid offset base shadow.
- Buttons and interactive cards use the existing rounded, dimensional purple treatment with clear pressed and disabled states.
- No emoji structural icons. Use labelled controls and a consistent vector icon family where an icon adds clarity.

## Accessibility

- Keep touch targets at least 44px, respect safe areas, and pair colour with text or shape.
- Preserve readable contrast and visible labels in all states.
- Support reduced motion and do not rely on swipe-only decisions; every pass or accept action needs a visible control.
