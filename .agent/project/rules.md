# Product UI rules (template)

Product-specific rules for copy, layout, and visuals.  
For code structure, use `.agent/*.RULES.md` instead.

## Content
- Use product-specific language, not generic SaaS filler
- No fake metrics unless backed by real data
- Every screen needs empty, loading, and error states

## Visual
- Prefer surface contrast and spacing over borders and heavy shadows
- No default AI gradients (purple→blue, etc.) unless the brand requires them
- Icons only when they clarify an action or category

## Mobile
- Safe area via `capacitor-plugin-safe-area` — do not bypass
- Haptics via `@/shared/haptic.util.ts`

## When unsure
Simplify. Remove one gradient, one shadow, one buzzword — then re-check.
