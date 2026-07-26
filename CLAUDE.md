# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chess Clock — an Expo / React Native app (SDK 54, new architecture enabled, Android-focused). Two tappable player clocks with increments, presets, orientation and sound settings, translated into 36 languages.

## Commands

```powershell
npm start            # expo start
npm run android      # expo run:android (native dev build)
npm run doc          # npx expo-doctor@latest
npm run build-dev    # eas build --profile development --platform android
npm run build-prev   # eas build --profile preview --platform android
npm run build-prod   # eas build --profile production --platform android
```

There is no test suite and no `lint` script. ESLint 9 is installed with a legacy `.eslintrc.js` (`extends: ["expo", "prettier"]`), and the `prettier/prettier` rule is deliberately turned **off** — formatting is enforced only by Prettier itself (`.prettierrc`: tabs, width 4, no semicolons, double quotes, trailing commas).

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

Two shapes exist for the same entity and must be converted at the boundary, using the helpers in [src/utils/parsing.tsx](src/utils/parsing.tsx):
- `DatabasePreset` (flat: `id, name, hours, minutes, seconds, timeIncrementMs`) — [src/types/database.ts](src/types/database.ts). `NewDatabasePreset` is the same without `id`, for inserts.
- `Preset` (nested `time: { hours, minutes, seconds }`) — [src/types/utils.ts](src/types/utils.ts). Its `id` is optional: set only on rows read from the DB, absent on store state and the bundled defaults.

`parsing.tsx` is `.tsx` because a few helpers return JSX; it holds all time formatting, preset conversion and string→number coercion. Put new formatting logic there rather than inline in screens.

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

## Conventions

- Imports are sorted alphabetically, braced/named imports first, then default imports — match this when editing existing files.
- `src/types/` holds shared types; screens/components declare their own local `Props` type just above the component.
- Builds are Android-only today (`app.json` has no `ios` block); `eas.json` production uses `autoIncrement` with `appVersionSource: "remote"`.
