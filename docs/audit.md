# Codebase Audit — 2026-07-26

Full read of every source file. Verified with `npx tsc --noEmit` (passes clean), `npx eslint .`, and a key-by-key diff of all 36 locale files. Findings are ordered by severity; line references point at the commit `5c995fe` state.

## Critical

### 1. The saved language setting is ignored on every launch
[Main.tsx:11-24](../Main.tsx#L11-L24)

Zustand's `persist` with AsyncStorage rehydrates **asynchronously**, so on the first render `language` is still the default `null`. The mount effect (`[]` deps) reads that `null` and always falls back to the device locale. The user's choice in Settings is only applied inside that screen; after a restart it's silently discarded.

Fix: gate on `useConfigStore.persist.onFinishHydration` / `hasHydrated()`. [Loading.tsx](../src/screens/Loading.tsx) already exists for exactly this and is currently dead code (never imported).

### 2. Preset writes race with the list refresh
[useDatabase.ts:14-30](../src/hooks/useDatabase.ts#L14-L30)

`postPreset` and `deletePreset` are `async` but never `await` `db.runAsync` — they return an already-resolved promise. So `await postPreset(...); refreshFlatlist()` in [Presets.tsx:62](../src/screens/Presets.tsx#L62) and [:79](../src/screens/Presets.tsx#L79) re-queries before the write lands; the new/deleted preset intermittently doesn't show. The `.catch(e => console.log(e))` also swallows failures, so a rejected insert looks like "nothing happened".

Fix: `return db.runAsync(...)` and let the error propagate.

### 3. No game-over state — play continues after a flag falls
[Clock.tsx:118-160](../src/screens/Clock.tsx#L118-L160)

When a clock reaches 0, only `isTopPlaying`/`isBottomPlaying` are set false. Tapping the other half then hits the `!isTopPlaying && !isBottomPlaying` branch in `handleMove` and starts a new turn; the play/pause button also resumes. There's no `isGameOver` to lock the board, and no win indication beyond the red background.

Related, same lines: `stopAllTimers()` and `setIsTopPlaying(false)` are called **inside the `setState` updater**. Updaters must be pure — React 19 may invoke them twice, and this is a real source of stuck/duplicate intervals.

## High

### 4. Second player's increment is overwritten with player 1's
[Home.tsx:74](../src/screens/Home.tsx#L74)

`handleSaveSecondModal` builds the preset with `timeIncrementMs: time.timeIncrementMs` instead of `secondTime.timeIncrementMs`. Copy-paste bug: adjusting player 2's custom time silently steals player 1's increment.

### 5. Player 2's time isn't persisted
[useTimeStore.ts:63](../src/stores/useTimeStore.ts#L63)

`useTimeStore` is wrapped in `persist`, `useSecondTimeStore` is not. With "different times" enabled, player 1's time survives a restart and player 2's resets to the 1-minute default. Either persist both or neither.

### 6. Presets can never differ per player
[Presets.tsx:38-39](../src/screens/Presets.tsx#L38-L39)

`handleSelectPreset` calls both `setTime(preset)` and `setSecondTime(preset)`, so picking any preset destroys player 2's distinct time. The "different times" feature is only usable through the custom modal.

### 7. Presets are keyed by name, and names aren't unique
[useDatabase.ts:28](../src/hooks/useDatabase.ts#L28), [Presets.tsx:110](../src/screens/Presets.tsx#L110)

`DELETE FROM Presets WHERE name = ?` deletes **every** row with that name, and `keyExtractor` uses the name too. Since `parseTimeToPresetName` is deterministic, creating the same preset twice (easy — the modal inputs aren't cleared after saving) yields duplicate rows → React duplicate-key warning, and deleting one removes both. The table already has an `id`; `DatabasePreset` just doesn't carry it.

Fix: add a UNIQUE constraint or use the id.

### 8. A 00:00:00 game can be started
[Home.tsx:53-64](../src/screens/Home.tsx#L53-L64)

`TimeInputModal` opens with empty fields (never seeded from the current time), and `handleSaveModal` has no validation, unlike `Presets.handleSaveTimeModal`. Confirm with blank fields → both clocks are 0, every tap is a no-op, the clock screen is dead.

## Medium

### 9. `pt`, and any bare regional locale, falls back to English
[Main.tsx:19](../Main.tsx#L19) + [i18n.ts](../i18n.ts)

The device fallback uses `locales[0].languageCode`, which is `"pt"` on a Brazilian device — but the resource map only has `pt_BR` and `pt_PT`, no `pt`. Same class of problem for any language shipped only as regional variants. Map the base code to a default variant, or use `nonExplicitSupportedLngs` / `load: "languageOnly"`.

### 10. SQL string interpolation in the seed
[parsing.tsx:97-102](../src/utils/parsing.tsx#L97-L102) + [databaseActions.ts:31](../src/utils/databaseActions.ts#L31)

`parseJSONPresetsToQueryValue` interpolates `p.name` unescaped, and returns an **array** that only works because template interpolation stringifies it with commas. Input is bundled JSON today, so it's not exploitable, but a name with an apostrophe breaks the migration on first launch. Use parameterized inserts, and at minimum `.join(", ")`.

### 11. `onSQLiteProviderError` throws with nothing to catch it
[databaseActions.ts:38-41](../src/utils/databaseActions.ts#L38-L41)

Rethrowing inside the handler crashes the app with no UI and no error boundary anywhere in the tree. Line 33 (`result.user_version = 1`) is a no-op on a local object — dead code.

### 12. Both clocks re-render 100×/s
[Clock.tsx](../src/screens/Clock.tsx), [PlayerClock.tsx](../src/components/PlayerClock.tsx)

`UPDATE_INTERVAL = 10` drives parent state, so the *idle* player's `PlayerClock` re-renders every tick too (no `memo`), each time re-running the string formatting. On low-end Android this is the most expensive thing the app does. `React.memo` on `PlayerClock` plus a ~30–50 ms interval (still smooth for centiseconds) would cut it dramatically.

### 13. Global bottom-margin hack
[App.tsx:12](../App.tsx#L12)

`SafeAreaProvider style={{ marginBottom: initialWindowMetrics?.insets.bottom }}` shrinks the whole app — including the full-bleed clock screen — and silently does nothing when `initialWindowMetrics` is null. With SDK 54's edge-to-edge on Android this should be per-screen `useSafeAreaInsets` / `SafeAreaView` with explicit `edges`.

### 14. "Custom" is untranslated
[Home.tsx:55,68](../src/screens/Home.tsx#L55)

Hardcoded `"Custom"` is used both as the stored name and as the displayed label. The `custom-preset` key exists in all 36 locale files and is never used. Note the name doubles as a sentinel (`time.name !== "Custom"`), so translating it needs a separate display path.

Preset names generated by `parseTimeToPresetName` are likewise hardcoded English (`hr`/`min`/`sec`), and it emits a trailing space (`"3 min "`) that doesn't match the bundled defaults (`"3 min"`) — two visually identical, differently-keyed presets.

### 15. `restartClock` doesn't reset `lastMoveWasTop`
[Clock.tsx:59-68](../src/screens/Clock.tsx#L59-L68)

After a restart, play/pause may start the bottom player instead of the same side that started the previous game. Also, on a fresh game a tap on your *own* half starts *your* clock rather than the opponent's — nonstandard for a chess clock.

## Low / polish

- **ESLint doesn't run at all.** ESLint 9 requires `eslint.config.js`; `npx eslint .` fails outright on the legacy `.eslintrc.js`. Nothing has been linted since the v9 bump. `eslint-config-expo@10` ships a flat config — migration is ~10 lines. Also worth adding a `lint` script.
- `console.log(locales)` and other logs ship in release builds — [Main.tsx:13](../Main.tsx#L13). Gate on `__DEV__`. Same for `debug: true` in [i18n.ts](../i18n.ts), which logs on every missing key.
- `onChangeText={(t) => ...}` shadows the i18n `t` in [Home.tsx:141](../src/screens/Home.tsx#L141), [:180](../src/screens/Home.tsx#L180) and throughout [TimeInputModal.tsx](../src/components/TimeInputModal.tsx) — a live footgun the moment someone needs a translation inside those callbacks.
- Modal inputs are never reset on cancel or after save, so stale values reappear next open.
- Hours input is unclamped (up to 99) while minutes/seconds clamp to 59.
- `""` used as a falsy style value in [ConfigBox.tsx:34,57](../src/components/ConfigBox.tsx#L34) — legal per RN's `Falsy` type but should be `null`.
- Dead style blocks: `timeModal*` / `configContainer` duplicated in both [Home.tsx](../src/screens/Home.tsx) and [Presets.tsx](../src/screens/Presets.tsx) stylesheets, left over from before `TimeInputModal` was extracted. `styles.timeText` in Home is unused.
- Only the pause button gets `rotate90deg` in Horizontal mode; back/restart stay upright — [Clock.tsx:175-197](../src/screens/Clock.tsx#L175-L197).
- `react-native-modal@13.0.2` (2022, unmaintained) on RN 0.81 + new architecture is the main upgrade risk in the dependency list.
- No `accessibilityLabel` / `accessibilityRole` on any touchable; screen readers see unlabeled buttons.
- If a user deletes all presets there's no way to restore the defaults (seed only runs on the 0→1 migration).
- `app.json` sets `userInterfaceStyle: "light"` and a white splash background for a dark-themed app.

## Verified clean

- TypeScript strict mode passes with zero errors.
- All 36 locale files have identical key sets — no missing or extra keys.
- The delta-based countdown correctly survives app backgrounding.
- `defaultpresets.json` has no duplicate names.

## Suggested order of work

Items 1–8 are all small, localized changes and make sense as a single pass.
