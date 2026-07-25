# Design guide (template)

## Brand feel
<!-- e.g. calm, direct, product-first -->

## Design principles
1. **Product first** — content and actions over chrome
2. **Real states** — empty, loading, error, success for every flow
3. **One visual language** — pick a direction and stay consistent
4. **Spacing over decoration** — hierarchy from layout, not effects

## Tokens
Use CSS variables already in `app/src/styles.css` and `web/src/app/globals.css`.

| Token | Usage |
|-------|--------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--surface` | Cards, panels |
| `--muted` | Secondary text |
| `--accent` | Primary actions |

## Typography
<!-- List fonts and scale when decided -->

## Components
Put Tailwind classes in reusable components — not shared class-string files.

## References
- Mobile code: `.agent/Frontend.Mobile.RULES.md`
- Web code: `.agent/Frontend.Web.RULES.md`
- Product UI rules: `.agent/project/rules.md`
