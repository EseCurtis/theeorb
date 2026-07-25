# Starter Initialization

Use this file when turning the starter into a real product. The `.required/` folder is the source of truth for app identity, brand assets, Firebase credentials, social login IDs, and generated native/web assets.

## 1. Fill App Info

Edit `.required/appinfo.json`:

- `app.name`, `app.shortName`, `app.id`, `app.urlScheme`
- `colors` and `darkColors`
- `capacitor.server`
- `socialLogin.providers`
- Google/Apple client IDs and redirect URLs
- `socialLogin.iosUrlSchemes`, including any reversed Google iOS client URL scheme

## 2. Add Firebase Files

Replace the placeholder files with real Firebase project files:

```txt
.required/firebase/google-services.json
.required/firebase/GoogleService-Info.plist
```

## 3. Add Brand Files

Replace the placeholder files with real PNG assets:

```txt
.required/brand/logo-color.png
.required/brand/logo-black.png
.required/brand/logo-white.png
.required/brand/icon.png
.required/brand/splash.png
.required/brand/splash-dark.png
.required/brand/notification-icon.png
```

Minimum source sizes:

- `icon.png`: 1024 x 1024, square, PNG
- `splash.png`: 2732 x 2732, PNG
- `splash-dark.png`: 2732 x 2732, PNG
- `notification-icon.png`: 512 x 512, transparent background, monochrome white symbol

## 4. Generate The Logo Set With AI

Use this prompt with an AI image tool that supports image reference input. Attach one clean sample logo and ask for transparent PNG exports.

```txt
RESPECT EVERY SINGLE LINE AND WORD OF THIS PROMPT

Use the attached sample logo as the exact brand mark reference. Preserve its core shape, proportions, visual identity, and recognizability. Do not invent a new logo, mascot, wordmark, or decorative scene.

Generate a complete production app asset set as separate transparent PNG files:

1. logo-color.png
   - Full-color version of the provided logo.
   - Transparent background.
   - Centered with clean padding.
   - 2048 x 2048.

2. logo-black.png
   - Solid black version of the same logo.
   - Transparent background.
   - 2048 x 2048.

3. logo-white.png
   - Solid white version of the same logo.
   - Transparent background.
   - 2048 x 2048.

4. icon.png
   - App icon source.
   - 1024 x 1024.
   - Logo centered and scaled for mobile app icon use.
   - Use a simple brand-color or neutral background if the mark needs contrast.
   - No text unless the original mark is text-only.

5. splash.png
   - Light splash screen source.
   - 2732 x 2732.
   - Background should match the brand light background color.
   - Logo centered, occupying about 18-24% of canvas width.

6. splash-dark.png
   - Dark splash screen source.
   - 2732 x 2732.
   - Background should match the brand dark background color.
   - Logo centered, occupying about 18-24% of canvas width.

7. notification-icon.png
   - Android notification icon source.
   - 512 x 512.
   - Transparent background.
   - Monochrome white silhouette only.
   - No gradients, shadows, outlines, text, tiny detail, or background fill.

Rules:
- Keep the mark geometrically consistent across all files.
- Keep all output crisp, flat, and production-ready.
- Do not add mockups, lighting effects, bevels, drop shadows, 3D, glass, or texture.
- Do not crop the logo.
- Export each asset as a separate PNG with the exact filenames listed above.
- after done ask the user if they want it in a zipped file
```

After generating, place the files in `.required/brand/`.

## 5. Apply The Required Kit

Run:

```sh
pnpm apply-required
```

That command updates:

- `app/capacitor.config.json`
- Android app ID, name, Firebase config, launcher icons, splash screens, notification icon
- iOS bundle ID, display name, URL schemes, Firebase plist, icons, splash screens
- `app/public/brand/`
- `web/public/brand/`
- generated `BrandLogo` components for `app` and `web`
- app and web theme color variables

Run it again after every change to `.required/appinfo.json`, `.required/firebase/`, or `.required/brand/`.

## 6. Verify

```sh
pnpm --dir app exec tsc --noEmit
pnpm --dir app run build
pnpm --dir web run build
pnpm --dir server run build
```

## 7. Initialize Any AI Agent

Use this prompt at the start of a new AI/model session so the agent follows this repository's rules before making changes.

```txt
You are working inside this repository. Before planning, editing, or running implementation commands, read and follow the local agent system.

Mandatory first steps:
1. Read `.agent/shared-mind.txt`.
2. Read `.agent/Agent.Continuity.RULES.md`.
3. Read the rule file for the area you will touch:
   - Backend: `.agent/Server.RULES.md`
   - Mobile app: `.agent/Frontend.Mobile.RULES.md`
   - Web: `.agent/Frontend.Web.RULES.md`
   - Product/UI guidance: `.agent/project/rules.md` and `.agent/project/design-guide.md`
4. Inspect relevant existing code before proposing or making changes.

Repository rules you must obey:
- Do not ignore `.agent`; it is the source of truth for agent continuity, handoff, verification, and code structure.
- If the worktree is dirty before you start, commit the existing state first unless the user explicitly says not to commit.
- Commit at every meaningful milestone, not only at the beginning and end. A milestone is a complete feature slice, risky refactor boundary, generated asset/migration output, verified subset, or transition between surfaces such as `server/`, `app/`, and `web/`.
- Preserve user changes. Never revert or overwrite unrelated work.
- Make focused changes that match the existing stack and file naming conventions.
- Backend feature endpoints must be versioned under `/api/v1` or a later explicit version.
- Backend route, schema, response, auth, status, or version changes must update `server/swagger/swagger.json` in the same change.
- Auth, signup, password reset, verification, invite, and protected resource endpoints must use symmetric responses: generic public messages/statuses, no account/resource enumeration, dummy timing work where needed, and detailed failure reasons only in server logs.
- Mobile app code must follow the Capacitor + Vite + React + TanStack Router rules.
- Mobile app UI under `app/src` must use the shared `View` and `Text` layout primitives for layout containers and non-interactive text.
- Web code must follow the Next.js App Router rules.
- UI work must use the project design guide, semantic tokens, accessible contrast, visible labels, real loading/error/empty states, and mobile-safe layouts.
- Do not add generic filler, fake metrics, emoji structural icons, unversioned backend APIs, or undocumented backend endpoints.

Required end-of-session flow:
1. Run the relevant verification commands for touched surfaces.
2. Rewrite `.agent/shared-mind.txt` with current `STATUS`, `LAST_SESSION`, `NEXT`, `BLOCKERS`, `TOUCHED`, and `COMMANDS`.
3. Commit any final handover or verification updates with a clear conventional commit message. Earlier milestone commits should already exist for completed work slices.
4. Run:
   `.agent/scripts/agen-run.sh .agent/post-agent-run.acmd`
5. If post-run fails, fix the issue, update shared mind, commit again, and rerun until it passes.

When answering the user, summarize what changed, the commit hash, checks run, and any blockers. Do not claim the task is done if the worktree is dirty or post-run failed.
```
