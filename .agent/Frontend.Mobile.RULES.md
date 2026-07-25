# Frontend Mobile Rules

**Continuity:** Read `.agent/shared-mind.txt` at start. Update it + run `.agent/scripts/agen-run.sh .agent/post-agent-run.acmd` before exit. See `.agent/Agent.Continuity.RULES.md`.

These rules define how to build and extend the mobile app frontend. Treat this as a strict development contract. New mobile frontend work must follow these rules unless a deliberate architecture change is approved and documented.

The mobile frontend lives in `app`.

This app is a Capacitor + React app running web UI inside native iOS and Android shells. It is not a React Native app. Do not introduce React Native patterns, packages, or file conventions unless the stack is intentionally migrated.

## 1. Mobile Stack Is Fixed

Required stack:

- Vite for app build and development.
- React for UI.
- TanStack Router for routing.
- TanStack Query for server state.
- Capacitor for native shell and native plugin access.
- TypeScript with `strict: true`.

Do not bypass these foundations for new features.

Do not add route-level data fetching outside TanStack Query unless the data is static, local-only, or part of a native bridge bootstrap.

Do not call native Capacitor plugins directly from random screen components. Native access must go through a typed shared utility, plugin wrapper, or domain service.

## 2. File Naming Rules

Use lowercase kebab-case for frontend files and suffix files by layer.

Required naming:

- Screens: `feature-name.screen.tsx`
- Components: `feature-name.component.tsx`
- Sheets: `feature-name.sheet.tsx`
- Modals: `feature-name.modal.tsx`
- Hooks: `use-feature-name.hook.ts` or `use-feature-name.hook.tsx`
- API clients: `feature-name.api.ts`
- Types: `feature-name.types.ts`
- Utils: `feature-name.util.ts`
- Tests: `feature-name.test.ts` or `feature-name.test.tsx`

Correct:

```txt
src/app/stash-try-on.screen.tsx
src/components/stash/share-target-pre-preview.component.tsx
src/hooks/use-avatar.hook.ts
src/shared/api/avatar.api.ts
src/shared/types/avatar.types.ts
```

Wrong:

```txt
src/components/StashCard.tsx
src/hooks/avatarHooks.ts
src/shared/api/avatarApi.ts
src/app/StashTryOn.tsx
```

Existing inconsistent names may remain for compatibility, but new files must follow the required naming. When touching legacy files heavily, move them toward these rules instead of adding more inconsistency.

## 3. Screen Rules

Each screen file must export exactly one root screen component.

Screen files may:

- Read route params.
- Compose domain hooks.
- Hold small view-only state.
- Define simple event handlers.
- Choose loading, empty, error, and ready states.
- Render extracted components.

Screen files must not:

- Contain query or mutation definitions.
- Contain API calls directly.
- Contain native Capacitor plugin calls directly.
- Contain large mapping or transformation logic.
- Contain business rules that belong in hooks, shared utils, or backend code.
- Contain more than one screen/root component.

If a screen-root component becomes hard to scan, extract sections into kebab-case component files before adding more logic.

Complex derived state belongs in a named helper or domain hook. A screen may call the helper; it must not become the helper.

## 4. Component Rules

A component file may contain at most three React components.

Allowed:

- One exported component plus one or two small private subcomponents.
- Small local presentational subcomponents that are only meaningful inside that file.

Not allowed:

- Large component families in one file.
- Multiple exported feature components in one file.
- Screen components inside `src/components`.
- Business workflows hidden inside presentational components.

Extract when:

- JSX sections need their own state, effects, or handlers.
- A local subcomponent grows beyond a small presentational block.
- A file needs a fourth React component.
- A component mixes unrelated UI regions.

Components should receive explicit props and render UI. They should not know how to fetch their own domain data unless they are intentionally documented as a connected component.

## 5. TanStack Query Rules

TanStack Query hooks must be organized by domain.

Domain hooks live in hook files such as:

```txt
src/hooks/use-stash.hook.ts
src/hooks/use-avatar.hook.ts
src/hooks/use-notifications.hook.ts
```

Query keys must live beside the domain hooks that use them.

Domain hooks may:

- Define `useQuery`, `useInfiniteQuery`, and `useMutation`.
- Own cache updates and invalidation.
- Map raw API responses into UI-ready return values.
- Expose clear action names such as `refreshStashItems`, `generateAvatar`, or `removeCartItem`.

Domain hooks must not:

- Return raw mutation objects to screens by default.
- Force screens to understand cache keys.
- Hide unrelated domains in one hook file.
- Use `readonly` modifiers in hook input types or query key inputs just for style.

Prefer simple mutable-looking input types:

```ts
type GenerateTryOnInput = {
  selectedStashItemIds: string[]
  selectedOutfitSizesBySlot?: AvatarTryOnOutfitSizesBySlot
}
```

Avoid noisy hook contracts:

```ts
type GenerateTryOnInput = {
  readonly selectedStashItemIds: readonly string[]
  readonly selectedOutfitSizesBySlot?: Readonly<AvatarTryOnOutfitSizesBySlot>
}
```

Use immutability where it protects real state. Do not add `readonly` ceremony to every frontend object.

## 6. API And Data Flow Rules

Screens and components must not call `fetch`, `axios`, or API client methods directly for server state.

Required flow:

```txt
screen -> domain hook -> shared API client -> HTTP client -> backend
```

Native bridge flow:

```txt
screen -> shared utility/domain service -> typed Capacitor plugin wrapper -> native plugin
```

API clients live under `src/shared/api`.

Types shared across screens, hooks, and API clients live under `src/shared/types`.

Local-only UI helpers live near the feature unless they are reused across multiple domains.

## 7. TypeScript And ESLint Rules

Strict TypeScript must remain enabled.

Hard requirements:

- Use type-only imports for types.
- Do not add `any` in new code unless isolated, unavoidable, and explained by a nearby type boundary.
- Do not disable lint rules in feature code.
- Do not leave production `console.log` statements.
- Prefer guard clauses over deep nesting.
- Prefer named helpers over deeply nested JSX expressions.
- Keep import groups organized and deduplicated.
- Throw `Error` objects, not strings or arbitrary values.

Do not weaken TypeScript or ESLint configuration to make a feature pass.

## 8. UI And Native Shell Rules

Use existing mobile layout primitives and shared UI utilities before creating new primitives.

Do not create duplicate button, text, view, image, modal, sheet, or skeleton primitives when an existing shared component covers the need.

`View` and `Text` are mandatory for app UI composition:

- Use `View` from `@/components/layout/view.component` for layout containers instead of raw `<div>`.
- Use `Text` from `@/components/layout/text.component` for non-interactive text instead of raw `<span>`, `<p>`, heading tags, or loose text nodes.
- Screen and component files under `app/src` must import and use these primitives when rendering layout or text.
- Existing legacy files may be migrated when touched, but new app UI must not add raw layout/text elements.

Allowed exceptions:

- The primitive implementation files themselves may render raw HTML.
- Semantic controls may use their native elements, such as `button`, `a`, `input`, `label`, `form`, `select`, `textarea`, `img`, `svg`, `ul`, `ol`, and `li`.
- Route/root bootstrap files may render framework-required providers or outlets directly when no UI is being composed.
- Third-party library render props may use the element shape required by that library, but wrap surrounding layout/text in `View` and `Text`.

Respect native-shell constraints:

- Safe areas must be handled through existing safe-area helpers.
- Haptics must go through the shared haptic utility.
- External links must go through the shared store/link utility where applicable.
- Native plugin initialization must stay centralized.

Mobile UI must be responsive inside the WebView and must not assume desktop browser dimensions.

## 9. Compatibility Rules

Existing legacy files may remain until touched.

When modifying a legacy file:

- Do not make the structure worse.
- Extract complex logic when the change area already touches it.
- Keep public hook return shapes backward-compatible unless all call sites are updated.
- Preserve route names and native bridge behavior unless the feature explicitly requires a migration.
