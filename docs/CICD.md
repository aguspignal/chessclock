# CI/CD, Store Submission and OTA Updates

> **Superseded in part by [CICD-BRANCH-TRIGGERS.md](CICD-BRANCH-TRIGGERS.md).** That document wires the pipeline to git pushes: `build.yml` is split into a push-to-`build` development lane and a push-to-`main` production lane, and the `require-approval` gate is removed. Where the two disagree — the single `build_type` workflow, the approval click, "pushing to `dev` or `main` spends no EAS minutes" — the branch-triggers document is current. Everything else below still stands.

> **Status: phases 1–7 and 11 implemented.** The repo now has `.eas/workflows/`, `expo-updates`, the version bump to 1.0.2, the final `eas.json`, the `wf:*` / `typecheck` / `doc:ci` scripts and the CLAUDE.md notes; typecheck, both doctor lanes and `wf:validate` are green. What remains is everything that cannot be done from the working tree: **Phase 8** (merge to `main`, dev dry run, first production run), **Phase 9** (preview OTA smoke test on a real device) and **Phase 10** (the reachability gap — nothing OTA reaches anyone until 1.0.2 ships and users adopt it).

## Overview

Every release today is manual: `npm run build-prod` from a laptop, download the AAB, upload it to Google Play by hand. There is no CI of any kind, and no way to ship a JS-only bug fix without a full rebuild and a store review cycle.

The target is a one-button release. Day-to-day work continues on `dev`; when `dev` merges into `main`, a single EAS Workflow is dispatched with a choice of **development** or **production**:

- **development** → typecheck + doctor gate, then an internal dev-client APK. Nothing else runs.
- **production** → the same gate, then a production AAB, then an explicit approval click, then automatic submission to the Google Play **production** track at 100% rollout.

Separately, EAS Update is introduced so a JS-only regression that reaches Play users can be fixed over the air in minutes instead of a store release. That lane is deliberately manual — a dispatch-only hotfix workflow. Nothing auto-publishes to real users.

Neither workflow uses an `on.push` trigger. Pushing to `dev` or `main` spends no EAS minutes.

### Verified starting state

| Fact | Value |
|---|---|
| Live Play build | `e43e8984`, version `1.0.1`, versionCode `19`, **`channel=none`, `runtimeVersion=none`** |
| `expo-updates` | not installed, not even transitively |
| `npx tsc --noEmit` | passes (exit 0) |
| `expo-doctor` | passes — 21/21, after the SDK 57 patch upgrades |
| GitHub ↔ EAS link | done; `main` is the default branch, `origin/master` deleted on the remote |
| Play service account key | verified in EAS credentials |
| EAS project | `@aguspignal/chessclock` / `e9889827-1da8-4e63-9899-7cede9eea061` |
| Version fields | `app.json` says `1.0.1`, `package.json` says `1.0.0` |

The consequence that shapes everything below: **OTA reaches nobody until 1.0.2 ships and users adopt it.** The binary currently on Play has no `expo-updates` native module. Publishing to the production channel before then *succeeds silently* to an audience of zero.

---

## Phase 1 — Commit the pending upgrade

The SDK 57 patch upgrades are applied and `expo-doctor` is green, but nothing is committed. Commit `package.json` **and** `package-lock.json` together — `npm ci` fails hard on drift, and every workflow job installs with `npm ci`. Commit or stash `forfutureself.md` too: until the GitHub-triggered path is proven, `eas workflow:run` without `--ref` uploads the working tree as-is.

Optional tidy: `git remote prune origin` clears the stale local `origin/master` ref.

---

## Phase 2 — Version hygiene

In [app.json](../app.json) set `version` to `1.0.2` and add `owner`. In [package.json](../package.json) set `version` to `1.0.2`.

This must happen **before** Phase 3. Once `runtimeVersion.policy` is `appVersion`, `expo.version` silently becomes the value that decides whether a hotfix reaches anyone — two disagreeing "versions" in the repo is a debugging trap. `expo-doctor` does not catch it.

---

## Phase 3 — Install and configure `expo-updates`

```powershell
npx expo install expo-updates
eas update:configure -p android
```

Then **review the diff and hand-correct it** — `update:configure` adds `channel: <profileName>` to *every* build profile:

- Delete the `channel` it adds to the `development` profile. Per the EAS schema, `channel` has no effect when `developmentClient: true`; dev builds can run updates from any channel.
- Confirm it wrote `runtimeVersion: { "policy": "appVersion" }` and `updates.url`.
- Confirm `expo-updates` landed in `dependencies`, not `devDependencies`.
- **Do not add `"expo-updates"` to the `plugins` array.** `@expo/prebuild-config`'s `withDefaultPlugins` applies `withExpoUpdates` unconditionally on every prebuild.

Final [app.json](../app.json) additions (top-level, inside `expo`):

```json
"owner": "aguspignal",
"version": "1.0.2",
"runtimeVersion": { "policy": "appVersion" },
"updates": {
  "url": "https://u.expo.dev/e9889827-1da8-4e63-9899-7cede9eea061"
}
```

Leave `fallbackToCacheTimeout`, `checkAutomatically` and `enabled` unset — the defaults (`0`, `ON_LOAD`, `true`) are correct, and a non-zero `fallbackToCacheTimeout` would block cold start on a network call.

### Why `appVersion` and not `fingerprint`

`nativeVersion` is unavailable — eas-cli hard-errors on it with `appVersionSource: "remote"`.

`fingerprint` is tempting and would actually be *stable* here (because `android/` is gitignored, fingerprint resolves the project as `managed` and never hashes native dirs). But its default `sourceSkips` hashes the entire resolved Expo config **and every autolinked package version**. So a hotfix that also bumps, say, `zustand` 5.0.14 → 5.0.15 changes the runtime version, and the update reaches **zero** installed binaries — with a completely green pipeline and no error anywhere. A silently-no-op emergency hotfix is the worst available failure mode.

`appVersion` makes the rule legible instead:

> **Bump `expo.version` ⟺ a new binary is required. Never bump `expo.version` for an OTA hotfix.**

The mirror risk is real: add a native module, forget to bump `expo.version`, publish an OTA, and it loads on a binary lacking that native code. `expo-updates` will generally detect the crash and roll back, but users see a crash first.

Then run `npm run typecheck` and `npm run doc` again, and commit the lockfile.

---

## Phase 4 — `eas.json`

Full final contents of [eas.json](../eas.json):

```json
{
	"cli": {
		"version": ">= 22.0.0",
		"appVersionSource": "remote"
	},
	"build": {
		"development": {
			"developmentClient": true,
			"distribution": "internal",
			"environment": "development"
		},
		"preview": {
			"distribution": "internal",
			"channel": "preview",
			"environment": "preview"
		},
		"production": {
			"autoIncrement": true,
			"channel": "production",
			"environment": "production"
		}
	},
	"submit": {
		"production": {
			"android": {
				"track": "production",
				"releaseStatus": "completed"
			}
		}
	}
}
```

- **No `serviceAccountKeyPath`** — the key lives in EAS credentials, which is what makes CI submission work without a secret in the repo. Do not add `applicationId` either; it auto-detects from `android.package`.
- `preview` gets a channel purely as a **test lane** (Phase 9). No workflow publishes to it.
- `environment` on each profile is a no-op today (no EAS environment variables exist), but the `update` job runs under `environment: production` and build and update environments must match or you get bundles compiled against different config. Free insurance.
- `cli.version` raised from `>= 15.0.12`, which predates most workflow features. Gates only the local CLI.

`releaseStatus: "completed"` is an instant 100% rollout with no buffer on a live app. `"inProgress"` + `"rollout": 0.1` is one extra line if a staged release is ever wanted.

---

## Phase 5 — `package.json` scripts

Add alongside the existing scripts:

```json
"typecheck": "tsc --noEmit",
"doc": "npx -y expo-doctor@latest",
"doc:ci": "npx -y expo-doctor@1.20.2",
"wf:validate": "eas workflow:validate .eas/workflows/build.yml && eas workflow:validate .eas/workflows/publish-production-update.yml",
"wf:dev": "eas workflow:run .eas/workflows/build.yml -F build_type=development",
"wf:prod": "eas workflow:run .eas/workflows/build.yml -F build_type=production --ref main",
"wf:hotfix": "eas workflow:run .eas/workflows/publish-production-update.yml --ref main"
```

- `doc` **stays on `@latest`** — unchanged from today. Locally you want the freshest checks; that's the entire point of the tool, and a surprise failure costs a minute.
- `doc:ci` is pinned, and it is what the workflows call. In a release gate the same surprise blocks a production ship with nothing in the repo having changed, and recovering means editing YAML and pushing mid-incident. A `2.0.0-canary` tag already exists upstream, so a major bump landing in the gate is a near-term risk.
- The drift between them is deliberate and points the safe way: local (newer, stricter) goes red before CI (pinned, more permissive) does. You get warned early without being blocked. Bump the pin to match `@latest` whenever local has passed.
- The workflows call `npm run typecheck`, so local and CI can never drift *there* — typecheck has no external input, so pinning is meaningless and drift is pure downside.
- `wf:hotfix` deliberately omits `-F message=`, so the CLI prompts for the required input.
- Keep `build-dev` / `build-prev` / `build-prod` as the local escape hatch when workflows are down.

**`eas-cli` stays global, not a devDependency.** No job needs it — `build`, `submit` and `update` jobs run EAS's own CLI on the worker; the custom pre-check job only runs `tsc` and `expo-doctor`. Adding it would install a very large tree on every job, and would introduce a new peer-resolution surface interacting with the load-bearing `legacy-peer-deps=true` in [.npmrc](../.npmrc) — exactly the class of "works locally, ERESOLVE in the cloud" failure the [CLAUDE.md](../CLAUDE.md) notes already document. Reproducibility comes from `cli.version` in `eas.json` instead.

---

## Phase 6 — Workflow files

Workflow files live in `.eas/workflows/*.yml`, 16 KiB max each.

### `.eas/workflows/build.yml` (new)

```yaml
name: Build Chess Clock (Android)

on:
  workflow_dispatch:
    inputs:
      build_type:
        type: choice
        description: development = internal dev-client APK. production = AAB, approval, Google Play.
        required: true
        default: development
        options:
          - development
          - production

jobs:
  pre_checks:
    name: Typecheck and Expo Doctor
    env:
      EXPO_DOCTOR_WARN_ON_NETWORK_ERRORS: "1"
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - name: TypeScript
        run: npm run typecheck
      - name: Expo Doctor
        run: npm run doc:ci

  build_development:
    name: Build development client
    needs: [pre_checks]
    if: ${{ (inputs.build_type || 'development') == 'development' }}
    type: build
    params:
      platform: android
      profile: development
      message: Development build (manual dispatch)

  build_production:
    name: Build production AAB
    needs: [pre_checks]
    if: ${{ (inputs.build_type || 'development') == 'production' }}
    type: build
    params:
      platform: android
      profile: production
      message: Production build (manual dispatch)

  approve_submission:
    name: Approve Google Play submission
    needs: [build_production]
    if: ${{ (inputs.build_type || 'development') == 'production' }}
    type: require-approval

  submit_to_play:
    name: Submit to Google Play (production track)
    needs: [build_production, approve_submission]
    if: ${{ (inputs.build_type || 'development') == 'production' }}
    type: submit
    params:
      build_id: ${{ needs.build_production.outputs.build_id }}
      profile: production
```

**Why the branching works.** A falsey `if` creates the job with status **`skipped`**, and a skipped job cascade-skips anything that `needs` it. Skipped is distinct from failed, so a `development` run reports overall success with three cleanly skipped production jobs. The redundant `if` on `approve_submission` and `submit_to_play` is intentional: it makes the dashboard render "skipped, not a production run" rather than "skipped, upstream didn't happen".

The `|| 'development'` fallback guards against `inputs` being empty, which is what happens on any non-dispatch run — harmless today, but it means adding `on.push` later can't silently turn the whole workflow into a no-op.

**Two changes that must never be made to this file:**

1. Never swap `needs: [approve_submission]` for `after: [approve_submission]`. `after` runs regardless of upstream outcome, and rejecting an approval translates to job *failure* — so `after` would submit to Google Play even after you rejected it. One word, gate silently defeated.
2. Don't branch with `success()` / `failure()`. They mean "all previous jobs", not "this specific dependency", and misbehave once jobs are skipped.

No `image:` key — the default `auto` selects from the SDK and RN version, which is what you want across SDK upgrades.

### `.eas/workflows/publish-production-update.yml` (new)

```yaml
name: Publish production hotfix (OTA)

on:
  workflow_dispatch:
    inputs:
      message:
        type: string
        description: What this hotfix changes. Shown on the update in the EAS dashboard.
        required: true

jobs:
  pre_checks:
    name: Typecheck and Expo Doctor
    env:
      EXPO_DOCTOR_WARN_ON_NETWORK_ERRORS: "1"
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - name: TypeScript
        run: npm run typecheck
      - name: Expo Doctor
        run: npm run doc:ci

  publish_update:
    name: Publish to production channel
    needs: [pre_checks]
    type: update
    environment: production
    params:
      platform: android
      channel: production
      message: ${{ inputs.message }}
```

- `message` is **required**. The job falls back to the commit message when omitted, but a `workflow:run` from an uploaded directory has no commit context — you'd get a blank label on the one thing most worth auditing later.
- `channel`, not `branch`. Using `channel` preserves the channel→branch indirection, which is what makes rollbacks and channel remapping possible.
- `EXPO_DOCTOR_WARN_ON_NETWORK_ERRORS: "1"` downgrades doctor failures to warnings **only when every failure is a network error**, so it can't mask a real problem — it just stops reactnative.directory being down from blocking a hotfix.

---

## Phase 7 — Validate

From the project root, after `eas.json` is final (validation resolves `profile:` names server-side and needs a logged-in session):

```powershell
npm run wf:validate
```

Both files must print `Workflow configuration YAML is valid.` Do not substitute a local YAML/JSON-Schema validator — it won't catch bad profile references.

---

## Phase 8 — Merge to `main` and rehearse

1. Merge `dev` → `main` and push. EAS reads workflow files from a git ref in the linked repo, so they must exist on `main`.
2. **Development dry run:** `npm run wf:dev`
   The cheap end-to-end rehearsal — exercises checkout, `.npmrc` + `npm ci`, tsc, doctor, and shows how the skipped production jobs render before you depend on it.
3. **First production run:** `npm run wf:prod`
   On the build detail page, **verify `channel = production` and `runtimeVersion = 1.0.2` before clicking approve.** If either is `none`, stop — the OTA lane isn't wired, and submitting would burn a whole release cycle. Expect versionCode 20 (remote counter is at 19).
4. Approve → submit → Play review → rollout.

---

## Phase 9 — Prove OTA works before you need it

Build `preview` (channel `preview`), install the APK on a real device, then:

```powershell
eas update --channel preview --message "OTA smoke test" --environment preview
```

Force-close and reopen **twice** — with the default `checkAutomatically: ON_LOAD` + `fallbackToCacheTimeout: 0`, launch 1 downloads in the background and launch 2 applies. Confirm the JS change lands **and** that `assets/click.mp3` still plays and all 36 locales still load. Asset resolution through the update manifest is where OTA most commonly breaks, and an actual emergency is the wrong time to find out.

This is the entire justification for the preview channel. Once it has done its job the line can be deleted.

---

## Phase 10 — The reachability gap

Verified against the account: the live 1.0.1 build has `channel=none`, `runtime=none`. It contains no `expo-updates` native module. **Nothing you publish can reach it, and nothing will tell you so** — `eas update --channel production` succeeds and reports a published update to an audience of zero.

- Play review: hours to a couple of days.
- `releaseStatus: completed` makes rollout instant once approved.
- **User adoption is the real bottleneck** — days to weeks, and some users never update.

So there is no hotfix remedy for a bug shipped *in* 1.0.2; the only fix for a bad 1.0.2 is another store release. Once 1.0.2 is live, use the channel page's embedded-vs-OTA split (or `eas update:insights`) to see how much of the base is actually reachable before relying on the hotfix lane. Every future `expo.version` bump resets this to zero.

---

## Phase 11 — Update CLAUDE.md

[CLAUDE.md](../CLAUDE.md) currently documents "no test suite and no lint script" and the old command set. Add:

- The new `typecheck`, `doc:ci` and `wf:*` scripts.
- **The runtime-version rule** from Phase 3, verbatim.
- That production runs must use `--ref main`, and why (`eas workflow:run` without `--ref` uploads the local working directory — a dirty tree would be built and submitted to Play, past an approval gate that shows a build, not a diff).
- That `.eas/workflows/*.yml` are validated with `eas workflow:validate`, not a generic YAML linter.
- A pointer to this file.

---

## Files touched

| File | Change |
|---|---|
| [package.json](../package.json) | version → 1.0.2, `typecheck` / `doc:ci` / `wf:*` scripts |
| [app.json](../app.json) | `owner`, version → 1.0.2, `runtimeVersion`, `updates` |
| [eas.json](../eas.json) | channels, `environment`, `submit.production.android` |
| `.eas/workflows/build.yml` | new |
| `.eas/workflows/publish-production-update.yml` | new |
| [CLAUDE.md](../CLAUDE.md) | new commands + runtime-version rule |
| `package-lock.json` | regenerated, must be committed |

Unchanged but load-bearing: [.npmrc](../.npmrc) (`legacy-peer-deps=true` — the sdk-57 image ships npm 10.9.8, which enforces peers on `npm ci`; `eas/checkout` restores it and `eas/install_node_modules` runs in the project root, so it applies as it does today), [.gitignore](../.gitignore) (now also filters the `workflow:run` upload, and its `android/` entry is what makes the project resolve as `managed` for fingerprinting).

---

## Verification

1. `npm run typecheck` → exit 0.
2. `npm run doc` and `npm run doc:ci` → both 21/21 checks passed. Re-check after `expo-updates` lands, since it adds an `updates.url` consistency check.
3. `npm run wf:validate` → both files valid.
4. `npm run wf:dev` → run succeeds; `build_production`, `approve_submission`, `submit_to_play` all show **skipped**, not failed; a dev-client APK is produced.
5. `npm run wf:prod` → build page shows `channel=production`, `runtimeVersion=1.0.2`, versionCode 20. Approval gate appears and blocks. Reject once on a throwaway run to confirm `submit_to_play` does **not** execute. Then approve and confirm the AAB lands in Play Console on the production track.
6. Phase 9 preview OTA smoke test passes on a physical device across two cold starts.

---

## Known risks

- **`require-approval` has no timeout** — confirmed absent from the schema. A pending run waits indefinitely and `--wait` blocks the terminal forever. Worse: dispatching a second production run while the first is pending means you can later approve the *older* run and submit a stale AAB with a lower versionCode. Approve or cancel promptly; `concurrency.cancel_in_progress` won't help, as it only applies to GitHub-triggered runs.
- **EAS Submit sets neither the release name nor the release notes.** The `AndroidSubmitProfile` schema in `@expo/eas-json` exposes only `serviceAccountKeyPath`, `track`, `releaseStatus`, `changesNotSentForReview`, `applicationId` and `rollout`. The release name is auto-generated by Play from the AAB's versionName and is a harmless internal label, editable in Console at any time. Release notes are simply blank; with `releaseStatus: completed` there is no window to add them before rollout.
- **`expo-doctor`'s `reactNativeDirectoryCheck` is data-driven** — `react-native-modal@13.0.2` (2022) could be flagged unmaintained upstream at any time and break the release gate with no change on your side. Fix by excluding that package in `package.json` under `expo.doctor.reactNativeDirectoryCheck.exclude`, not by disabling the gate.
- **`expo-dev-client` is in `dependencies`**, so it is autolinked into the production AAB. Pre-existing, and it is about to share app startup with `expo-updates`. Moving it to `devDependencies` is correct (EAS Build installs dev deps, so `developmentClient: true` builds still work) but it changes the native surface — fold it into a versioned release deliberately, never into a hotfix.
- **OTA takes two cold starts to apply** per user. Making it instant needs app code (`Updates.checkForUpdateAsync` / `reloadAsync`), and blocking a chess clock's startup on the network is the wrong trade.
- **`updates.url` is tied to the project ID** — if the EAS project is ever recreated, `app.json` must change in lockstep. `expo-doctor` catches this mismatch, which is one more reason to keep the gate green.
- **Pre-check cost.** Every dispatch, including dev builds, spends a `linux-medium` worker on `npm ci` + `tsc` + `expo-doctor` (~2–4 min) before anything useful starts. On the free tier this counts against quota.

---

## Appendix — What the flow looks like, day to day

Three distinct paths once everything is in place.

### A. Day-to-day work on `dev` — nothing automated

```powershell
# ... edit src/screens/Clock.tsx ...
npm start                    # Metro dev server, instant reload on the dev build
git add -A
git commit -m "fixed increment applied on the wrong player"
git push origin dev
```

**Pushing to `dev` triggers nothing.** No build, no update, no EAS minutes spent. Local iteration stays exactly as it is today — this is why the preview OTA channel is not worth automating.

Optionally, to check a change in a *release-mode* build (minified, no dev menu) without waiting 15 minutes for a rebuild:

```powershell
npm run wf:dev               # or, cheaper, publish to the preview channel:
eas update --channel preview --message "clock threshold tweak" --environment preview
```

### B. Shipping a release

```powershell
# 1. Bump the version. This is the moment that decides OTA reachability.
#    app.json  expo.version  1.0.2 -> 1.0.3
#    package.json  version   1.0.2 -> 1.0.3
git commit -am "bumped to 1.0.3"
git push origin dev

# 2. Merge to main.
git checkout main
git merge dev
git push origin main
git checkout dev
```

Still nothing has built — `main` has no push trigger. Now press the button, either in the Expo dashboard (project → Workflows → *Build Chess Clock (Android)* → Run workflow → `build_type: production`) or from the terminal:

```powershell
npm run wf:prod              # eas workflow:run build.yml -F build_type=production --ref main
```

What runs, in order:

| # | Job | What happens | ~Time |
|---|---|---|---|
| 1 | `pre_checks` | `eas/checkout` pulls **`main`** (not the working tree — that's what `--ref main` buys), `npm ci` honours `.npmrc`, then `npm run typecheck` and `npm run doc:ci`. Red here = nothing else runs. | 2–4 min |
| 2 | `build_production` | Production AAB. `autoIncrement` pulls versionCode from the remote counter → **21**. Channel `production`, runtimeVersion `1.0.3`. | 10–20 min |
| 3 | `approve_submission` | **The run stops and waits.** | indefinite |
| 4 | `submit_to_play` | Uploads the AAB using the service account in EAS credentials → production track, `releaseStatus: completed`. | 1–2 min |

`build_development` shows as **skipped** — expected, and does not fail the run.

At step 3, before clicking Approve, open the build page and check three things:

- `channel = production` — if this is `none`, the OTA lane is dead for this release. Stop.
- `runtimeVersion = 1.0.3` — must match the `expo.version` just bumped.
- `versionCode = 21` — must be higher than what's live.

Click **Approve** → the AAB lands in Play Console → Google review (hours to a couple of days) → 100% rollout, instantly, because `releaseStatus` is `completed`.

**What EAS does and does not set on the Play release:**

- **Release name** — Play Console's internal label for the release, visible only in Console, never to users. EAS omits `name` from the Play API call, so Google generates it from the AAB's versionName: releases are labelled **`1.0.3`**. (A manual Console upload would have pre-filled `21 (1.0.3)`; the API path drops the versionCode.) It's a pure label — rename it in Console any time, including after the release is live. Nothing depends on it.
- **Release notes** ("What's new") — not settable by EAS at all, and the only one users see. With `releaseStatus: completed` the release is already rolling out by the time you could write them, and editing a live release's notes means cutting a new release. Accepted tradeoff of the zero-touch path.

If you click **Reject** instead, `submit_to_play` never executes and the run ends as failed. The AAB still exists in EAS and can be submitted later with `eas submit -p android --id <build_id>`.

### C. Emergency hotfix — JS bug already in users' hands

Say 1.0.3 is live and a translation key renders wrong in Portuguese. Nothing native is involved, so no store release is needed.

```powershell
# 1. Fix it on dev. DO NOT touch expo.version — that would change the
#    runtime version and the update would reach zero devices.
git commit -am "fixed pt-BR increment label"
git push origin dev

# 2. Merge to main.
git checkout main && git merge dev && git push origin main && git checkout dev

# 3. Publish.
npm run wf:hotfix            # prompts for the required message input
```

`pre_checks` runs again, then `publish_update` bundles the JS and publishes to the `production` channel against runtime `1.0.3`.

Reach: every user running a build whose `expo.version` is `1.0.3`. Users still on 1.0.2 or 1.0.1 get nothing — they need a store update first. Delivery is **two cold starts** per user: the first launch downloads in the background, the second runs the new JS.

No Play review, no rollout wait. Minutes, not days.

### The one rule that makes all of this work

> **`expo.version` in [app.json](../app.json) is the EAS Update runtime version.**
> Bump it for path B (store release). Never bump it for path C (hotfix) — the update would reach nobody, and the pipeline would still go green.
