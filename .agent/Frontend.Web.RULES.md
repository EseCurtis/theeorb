# Frontend Web Rules

**Continuity:** Read `.agent/shared-mind.txt` at start. Update it + run `.agent/scripts/agen-run.sh .agent/post-agent-run.acmd` before exit. See `.agent/Agent.Continuity.RULES.md`.

These rules define how to build and extend the website frontend. Treat this as a strict development contract. New web frontend work must follow these rules unless a deliberate architecture change is approved and documented.

The website frontend lives in `website`.

## 1. Web Stack Is Fixed

Required stack:

- Next.js App Router for routes, layouts, and server/client boundaries.
- React for UI.
- TanStack Query for client server-state where interactive client fetching is needed.
- TypeScript with `strict: true`.
- ESLint through the existing Next.js lint configuration.

Do not introduce a second routing system, global client-state framework, or ad hoc data layer for new web features without an approved architecture change.

Server Components should remain server components by default. Add `"use client"` only when a component needs browser APIs, React state, effects, event handlers, TanStack Query, or client-only libraries.

## 2. File Naming Rules

Use lowercase kebab-case for frontend files and suffix files by layer.

Required naming outside App Router reserved files:

- Components: `feature-name.component.tsx`
- Client components: `feature-name.client.tsx` when the client boundary is the main point of the file.
- Hooks: `use-feature-name.hook.ts` or `use-feature-name.hook.tsx`
- API clients: `feature-name.api.ts`
- Types: `feature-name.types.ts`
- Utils: `feature-name.util.ts`
- Tests: `feature-name.test.ts` or `feature-name.test.tsx`

Next.js App Router reserved files keep their framework names:

```txt
app/route-name/page.tsx
app/route-name/layout.tsx
app/route-name/loading.tsx
app/route-name/error.tsx
app/api/route-name/route.ts
```

Correct:

```txt
components/lead/dashboard-overview.component.tsx
components/analytics/meta-pixel.component.tsx
hooks/use-infinite-tabs.hook.tsx
lib/shopify/shopify.service.ts
```

Wrong:

```txt
components/DashboardOverview.tsx
hooks/dashboardHooks.ts
components/lead/dashboardQuery.ts
```

Existing inconsistent names may remain for compatibility, but new files must follow the required naming. When touching legacy files heavily, move them toward these rules instead of adding more inconsistency.

## 3. Page And Route Rules

Each `page.tsx` file must export exactly one root page component.

Page files may:

- Read route params and search params.
- Fetch server data needed for initial render.
- Compose extracted sections and client components.
- Choose metadata, loading, empty, error, and ready states.

Page files must not:

- Contain large client workflows.
- Contain TanStack Query hook definitions.
- Contain mutation orchestration.
- Contain mapping-heavy transforms.
- Contain multiple page/root components.

If a page needs interactivity, put that interactivity in an extracted client component. Keep the page as the route composition entrypoint.

API route files must stay focused on HTTP entry and delegate business logic to server-side modules. Do not hide frontend component logic in route modules.

## 4. Component Rules

A component file may contain at most three React components.

Allowed:

- One exported component plus one or two small private subcomponents.
- Small local presentational subcomponents that are only meaningful inside that file.

Not allowed:

- Large component families in one file.
- Multiple exported feature components in one file.
- Page components outside `app/**/page.tsx`.
- Business workflows hidden inside presentational components.

Extract when:

- JSX sections need their own state, effects, or handlers.
- A local subcomponent grows beyond a small presentational block.
- A file needs a fourth React component.
- A component mixes unrelated UI regions.

Components should receive explicit props and render UI. They should not fetch their own domain data unless they are intentionally documented as a connected component.

## 5. TanStack Query Rules

TanStack Query hooks must be organized by domain.

Domain hooks live in hook files or domain query files with clear ownership, such as:

```txt
hooks/use-orders.hook.ts
hooks/use-dashboard-overview.hook.ts
components/lead/dashboard/dashboard-query.ts
```

New domain hooks should prefer `hooks/use-feature-name.hook.ts` unless a domain already has a local query module.

Query keys must live beside the domain hooks that use them.

Domain hooks may:

- Define `useQuery`, `useInfiniteQuery`, and `useMutation`.
- Own cache updates and invalidation.
- Map raw API responses into UI-ready return values.
- Expose clear action names such as `refreshOrders`, `submitLead`, or `loadDashboard`.

Domain hooks must not:

- Return raw mutation objects to pages by default.
- Force pages or visual components to understand cache keys.
- Hide unrelated domains in one hook file.
- Use `readonly` modifiers in hook input types or query key inputs just for style.

Prefer simple mutable-looking input types:

```ts
type DashboardOverviewInput = {
  token: string
  range: string
}
```

Avoid noisy hook contracts:

```ts
type DashboardOverviewInput = {
  readonly token: string
  readonly range: string
}
```

Use immutability where it protects real state. Do not add `readonly` ceremony to every frontend object.

## 6. Data Flow Rules

Server-rendered data flow:

```txt
page/layout -> server utility/service -> backend/database/provider
```

Client-interactive data flow:

```txt
client component -> domain hook -> API client/server action/route -> backend
```

Do not call API endpoints directly from deeply nested visual components when a domain hook can own the behavior.

Do not duplicate server and client data-fetching logic. If both are needed, share the pure transformation helpers and keep environment-specific fetching separated.

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

Do not weaken TypeScript, Next.js, or ESLint configuration to make a feature pass.

## 8. Client Boundary Rules

Only client components may use:

- Browser APIs.
- React state and effects.
- Event handlers.
- TanStack Query.
- Client analytics pixels.
- Client-only UI libraries.

Keep `"use client"` files narrow. A client component should not pull an entire page into the client bundle when a smaller interactive section can be extracted.

Server Components must not import client-only modules. Client Components may receive server-prepared props when that keeps the client boundary small.

## 9. Compatibility Rules

Existing legacy files may remain until touched.

When modifying a legacy file:

- Do not make the structure worse.
- Extract complex logic when the change area already touches it.
- Keep public hook return shapes backward-compatible unless all call sites are updated.
- Preserve App Router paths and public URLs unless the feature explicitly requires a migration.

