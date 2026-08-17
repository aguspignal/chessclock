# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chess Clock — an Expo / React Native app (SDK 57, React Native 0.86, Android-focused). Two tappable player clocks with increments, presets, orientation and sound settings, translated into 36 languages.

The New Architecture is the only architecture in SDK 57, so there is no `newArchEnabled` flag — it was removed from the config schema and setting it fails `expo-doctor`.

## Commands

```powershell
npm start            # expo start
npm run android      # expo run:android (native dev build)
npm run typecheck    # tsc --noEmit
npm run doc          # npx -y expo-doctor@latest
npm run doc:ci       # npx -y expo-doctor@1.20.2 (pinned; what the workflows call)
npm run build-dev    # eas build --profile development --platform android
npm run build-prev   # eas build --profile preview --platform android
npm run build-prod   # eas build --profile production --platform android
npm run wf:validate  # eas workflow:validate on both .eas/workflows/*.yml
npm run wf:dev       # dispatch build.yml with build_type=development
npm run wf:prod      # dispatch build.yml with build_type=production --ref main
npm run wf:hotfix    # dispatch publish-production-update.yml --ref main
```

`doc` intentionally floats on `@latest` while `doc:ci` is pinned: local goes red first, and a surprise upstream check can never block a release mid-incident. Bump the pin once local has passed.

Installs need `legacy-peer-deps`. The SDK 57 upgrade moved the project to `typescript ~6.0.3`, but `i18next` declares a `peerOptional typescript@^5`, so a plain `npm install` fails with `ERESOLVE`. The peer is optional and only affects i18next's own types, but the setting is currently load-bearing for a clean install. A committed root [.npmrc](.npmrc) sets `legacy-peer-deps=true` so both local installs and the `npm ci --include=dev` step on EAS Build pick it up automatically — do not delete it, or cloud builds fail during "Install dependencies". Older npm versions (like the one in the EAS build image) enforce peer resolution on `npm ci` even though npm 11.15 locally does not, so the failure only shows up in the cloud.

There is no test suite and no `lint` script — `npm run typecheck` plus `npm run doc:ci` is the whole release gate. ESLint 9 is installed with a legacy `.eslintrc.js` (`extends: ["expo", "prettier"]`), and the `prettier/prettier` rule is deliberately turned **off** — formatting is enforced only by Prettier itself (`.prettierrc`: tabs, width 4, no semicolons, double quotes, trailing commas).

## Architecture

Entry chain: [index.ts](index.ts) → [App.tsx](App.tsx) → [Main.tsx](Main.tsx) → [Navigator.tsx](Navigator.tsx).

- `App.tsx` wires the provider stack: `GestureHandlerRootView` → `SafeAreaProvider` → `SQLiteProvider` (DB name and migration hooks from [src/utils/constants.ts](src/utils/constants.ts) / [src/utils/databaseActions.ts](src/utils/databaseActions.ts)) → `NavigationContainer`.
- `Main.tsx` resolves the startup language: the persisted `language` from the config store, else the device locale via `react-native-localize`.
- `Navigator.tsx` is a native stack (`Home` → `Presets` / `Clock` / `Settings`) with custom `Header` components defined in the same file; screen params live in [src/types/navigation.ts](src/types/navigation.ts).

### State: three Zustand stores

- `useConfigStore` ([src/stores/useConfigStore.ts](src/stores/useConfigStore.ts)) — language, orientation, sound, `withDifferentTimes`. Persisted to AsyncStorage under `config-store`.
- `useTimeStore` ([src/stores/useTimeStore.ts](src/stores/useTimeStore.ts)) — the primary player's `Preset` plus a derived `timeInMilliseconds`. Persisted under `time-store`.
- `useSecondTimeStore` (same file) — the second player's time, mirrored API with `second*` names. Persisted under `second-time-store`. Only consulted when `withDifferentTimes` is on.

`timeInMilliseconds` is a derived field kept in sync manually inside `setTime`/`setSecondTime` via `getTimeInMillisecondsFromPreset`. Any new setter that mutates `time.time` must update it too.

### Persistence: SQLite presets

Presets live in a SQLite `Presets` table, not in Zustand. `onSQLiteProviderInit` runs a `PRAGMA user_version` migration and seeds the table from [src/resources/defaultpresets.json](src/resources/defaultpresets.json) **only on the 0 → 1 migration**. Editing `defaultpresets.json` therefore has no effect on existing installs; schema or seed changes need a new `DATABASE_VERSION` branch. Note `defaultpresets.json` is also read directly by `useTimeStore` for its initial state.

CRUD goes through the [useDatabase](src/hooks/useDatabase.ts) hook (`getAllPresets`, `postPreset`, `deletePreset`). `deletePreset` takes the row `id` — never match on `name`, which is neither unique nor stable. A preset is identified by its *duration*: the 1 → 2 migration adds `UNIQUE (hours, minutes, seconds, timeIncrementMs)`, so `postPreset` uses `INSERT OR IGNORE` and saving an existing duration is a deliberate no-op rather than an error.

Two shapes exist for the same entity and must be converted at the boundary, using the helpers in [src/utils/parsing.ts](src/utils/parsing.ts):
- `DatabasePreset` (flat: `id, name, hours, minutes, seconds, timeIncrementMs`) — [src/types/database.ts](src/types/database.ts). `NewDatabasePreset` is the same without `id`, for inserts.
- `Preset` (nested `time: { hours, minutes, seconds }`) — [src/types/utils.ts](src/types/utils.ts). Its `id` is optional: set only on rows read from the DB, absent on store state and the bundled defaults.

`parsing.ts` holds all time formatting, preset conversion and string→number coercion. Put new formatting logic there rather than inline in screens. It was `.tsx` until the last JSX-returning helpers were deleted as dead code — keep it JSX-free so it can stay `.ts`.

### Clock logic

[src/screens/Clock.tsx](src/screens/Clock.tsx) owns all timing state locally (it is not in a store). Key invariants:
- A single `intervalId` ref is shared by both players; starting one timer always calls `stopAllTimers()` first.
- Countdown is delta-based (`Date.now()` diff each tick) at a 10 ms `UPDATE_INTERVAL`, so drift doesn't accumulate — do not switch to decrementing by the interval constant.
- Increment is added to the player who just moved, before starting the opponent.
- `useKeepAwake()` keeps the screen on for the whole screen's lifetime.
- Clock background colour thresholds (green → yellow ≤30 s → orange ≤10 s → red at 0) live in [src/components/PlayerClock.tsx](src/components/PlayerClock.tsx).
- Orientation `"Vertical"` rotates the top player's clock 180°; `"Horizontal"` rotates both 90°.

### Styling

No styling library. Everything comes from the single [src/resources/theme.ts](src/resources/theme.ts) token set (`colors`, `spacing`, `fontSize`) plus local `StyleSheet.create` blocks at the bottom of each file. Use theme tokens instead of raw values.

## i18n

`i18next` + `react-i18next`, initialised in [i18n.ts](i18n.ts) with all translations bundled at build time (no lazy loading). `debug: true` is on.

**Language codes have two forms**: the `AppLanguage` enum and the UI use hyphens (`pt-BR`, `zh-TW`, `en-GB`), while i18next resource keys use underscores (`pt_BR`). Every `changeLanguage` call must go through `.replace("-", "_")` — see `Main.tsx` and [src/screens/Settings.tsx](src/screens/Settings.tsx).

Adding a language means touching four places:
1. `src/locales/<code>/translation.json` (lowercase dir, e.g. `pt-br/`)
2. an export in [src/locales/index.ts](src/locales/index.ts)
3. the `resources` map in [i18n.ts](i18n.ts) (underscore key)
4. the `AppLanguage` enum **and** the `LANGUAGES` array (native language name) in [src/types/languages.ts](src/types/languages.ts)

Translation key types are augmented from the English file via [src/types/i18next.d.ts](src/types/i18next.d.ts), so `en/translation.json` is the source of truth for key names.

## CI/CD and OTA updates

The full runbook — rationale, rehearsal steps and known risks — is [docs/CICD.md](docs/CICD.md). The essentials:

Two dispatch-only EAS Workflows live in `.eas/workflows/`. Neither has an `on.push` trigger, so pushing to `dev` or `main` spends no EAS minutes.

- `build.yml` — typecheck + doctor gate, then either an internal dev-client APK (`build_type: development`) or a production AAB → manual approval → Google Play production track (`build_type: production`).
- `publish-production-update.yml` — the same gate, then an EAS Update published to the `production` channel. Manual only; nothing auto-publishes to users.

**The runtime-version rule.** `runtimeVersion.policy` is `appVersion`, so:

> **Bump `expo.version` ⟺ a new binary is required. Never bump `expo.version` for an OTA hotfix.**

Bumping it for a hotfix publishes an update against a runtime version no installed binary has — the pipeline goes green and the update reaches zero devices. Keep `expo.version` in [app.json](app.json) and `version` in [package.json](package.json) in lockstep so there is only one answer to "what version is this".

**Production runs must use `--ref main`** (`wf:prod` and `wf:hotfix` already do). `eas workflow:run` without `--ref` uploads the local working directory, so a dirty tree would be built and submitted to Play — past an approval gate that shows a build, not a diff.

Validate workflow YAML with `npm run wf:validate`, never a generic YAML linter: `eas workflow:validate` resolves `profile:` names against the server, which is where the real mistakes are.

In `build.yml`, `submit_to_play` must keep `needs: [approve_submission]` — never `after:`. `after` runs regardless of upstream outcome and a rejected approval is a job *failure*, so `after` would submit to Play after you rejected it.

## Conventions

- Imports are sorted alphabetically, braced/named imports first, then default imports — match this when editing existing files.
- `src/types/` holds shared types; screens/components declare their own local `Props` type just above the component.
- Builds are Android-only today (`app.json` has no `ios` block — `eas update:configure` adds an empty one, delete it); `eas.json` production uses `autoIncrement` with `appVersionSource: "remote"`.
- Don't add `"expo-updates"` to the `plugins` array — `@expo/prebuild-config` applies `withExpoUpdates` unconditionally on every prebuild. The `development` profile has no `channel` either; it has no effect when `developmentClient: true`.
- The splash screen is configured through the `expo-splash-screen` plugin entry in `app.json`, not a top-level `splash` key — that key was removed from the SDK 57 schema. Run `npm run doc` after editing `app.json`; the schema check catches keys that newer SDKs dropped.
