# Branch-triggered CI/CD

> Follow-up to [CICD.md](CICD.md). That document built the pipeline; this one wires it to git pushes.
> **Status: phases 1, 2, 3 and 5 implemented.** `build.yml` is deleted, both new lanes are on `dev`, `build` and `main`, and the merge to `main` (`864ecda`) carried `[eas skip]` and correctly fired nothing.
>
> **Open question from Phase 3 step 2: creating and pushing `build` did not start a run.** `eas workflow:runs` still shows only the one pre-existing manual run. That push predated `build-development.yml` reaching `main`, and a new-branch push may not arrive as a `push` event at all — so this is not yet evidence the `paths` glob is broken. **Phase 4** is now the diagnostic, and its step 3 (code-only push to `build`) is the one that matters: a `paths` block matching nothing fails *closed*, and `main` already carries the same block.

## Goal

| Push to | Runs | Ends at |
|---|---|---|
| `dev` | nothing | — |
| `build` *(new)* | typecheck + doctor → dev-client APK | internal APK on the EAS dashboard |
| `main` | typecheck + doctor → production AAB → submit | live on Google Play, 100% rollout |

`dev` stays exactly as it is today. The OTA hotfix lane stays dispatch-only.

---

## Current state

Two workflow files exist, both `workflow_dispatch`-only:

- `build.yml` — one file, one `build_type` choice input, five jobs, four of which carry an `if:` that reads the input. `development` → dev APK; `production` → AAB → `require-approval` → `submit`.
- `publish-production-update.yml` — the OTA hotfix lane.

Neither has `on.push`, which is why [CLAUDE.md](../CLAUDE.md) currently states that pushing to `dev` or `main` spends no EAS minutes. That sentence becomes false and must change.

`main` is the default branch and the GitHub ↔ EAS link is already in place, so `on.push` needs no new setup — only the YAML.

### The blocker: `inputs` is empty on a push

From the EAS syntax reference:

> If a workflow run is started from `eas workflow:run`, its `event_name` will be `workflow_dispatch` and all the rest of the properties will be empty.

The mirror also holds — on a `push` run there are no `inputs`. Every branching `if:` in `build.yml` reads `inputs.build_type || 'development'`, so **bolting `on.push` onto `build.yml` would make every push, including pushes to `main`, run the development lane.** It would not error; it would just quietly build the wrong thing.

That rules out the one-file approach. The fix is also the simplification: split the file by lane, and the input, the `|| 'development'` fallback and all four `if:` conditions disappear.

### Decisions taken

- **No approval gate.** `require-approval` is deleted. Push to `main` submits to Play with no human step. With `releaseStatus: "completed"` in [eas.json](../eas.json) that is an instant 100% rollout — see [Consequences](#consequences-of-removing-the-gate).
- **Branch name: `build`.**
- **The merge that installs this carries `[eas skip]`** so it does not fire a production release on arrival.

---

## Phase 1 — Split `build.yml` into two triggered workflows

### `.eas/workflows/build-development.yml` (new)

```yaml
name: Development build (Android)

on:
  push:
    branches:
      - build
    paths:
      - "**"
      - "!**/*.md"
  workflow_dispatch: {}

concurrency:
  cancel_in_progress: true
  group: ${{ workflow.filename }}-${{ github.ref }}

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
    type: build
    params:
      platform: android
      profile: development
      message: Development build from the build branch
```

### `.eas/workflows/release-production.yml` (new)

```yaml
name: Release to Google Play (Android)

on:
  push:
    branches:
      - main
    paths:
      - "**"
      - "!**/*.md"
  workflow_dispatch: {}

concurrency:
  cancel_in_progress: true
  group: ${{ workflow.filename }}-${{ github.ref }}

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

  build_production:
    name: Build production AAB
    needs: [pre_checks]
    type: build
    params:
      platform: android
      profile: production
      message: Production release

  submit_to_play:
    name: Submit to Google Play (production track)
    needs: [build_production]
    type: submit
    params:
      build_id: ${{ needs.build_production.outputs.build_id }}
      profile: production
```

### `.eas/workflows/build.yml` — delete

Everything it did is now covered, and both remaining lanes keep a `workflow_dispatch` entry so the manual path survives. Leaving it in place would mean two files that can both build production, one of which is now unreachable from any button you would actually press.

### `.eas/workflows/publish-production-update.yml` — unchanged

Still `workflow_dispatch`-only. Nothing auto-publishes OTA. This is deliberate: OTA is the emergency lane, and an emergency lane that fires on its own is not a lane you can reason about mid-incident.

### Notes on the new keys

**`workflow_dispatch: {}`** — dispatch works regardless of the `on` key (`eas workflow:run` can start any workflow), but declaring it renders the "Run workflow" button in the Expo dashboard. Neither lane takes inputs any more, so the object is empty.

**`concurrency`** — the schema pins both fields: `cancel_in_progress` must be literally `true` and `group` must be the exact string `${{ workflow.filename }}-${{ github.ref }}` (custom groups are not supported yet; the placeholder is there so the file stays valid when they are). It applies **only to GitHub-triggered runs**, which is why it was pointless before this change and valuable now: two pushes to `main` in quick succession cancel the older run instead of racing two AABs to Play. [CICD.md](CICD.md) lists exactly that race under "Known risks" and notes concurrency could not help — this closes it.

**`paths`** — `"**"` then `"!**/*.md"`. At least one non-negated pattern is required. This exists because `main` has taken doc-only commits before (`0343094 Update README.md`); without it, editing the README ships a Play release. **The glob semantics are not verified by `wf:validate`** — the validator checks schema and profile names, not matching behaviour. Phase 4 tests it on `build`, where a wrong answer costs nothing, before `main` depends on it.

**`needs`, never `after`** — unchanged rule from [CLAUDE.md](../CLAUDE.md). `after` runs regardless of upstream outcome, so `submit_to_play` with `after: [build_production]` would try to submit a failed build.

**Build `message` stays static.** Interpolating `${{ github.commit_message }}` looks appealing but the field is capped and the context is empty on a dispatch run, so half your builds would be labelled with a blank suffix. The commit is recorded on the build page regardless (`git_commit_hash`).

---

## Phase 2 — `package.json` scripts

```json
"wf:validate": "eas workflow:validate .eas/workflows/build-development.yml && eas workflow:validate .eas/workflows/release-production.yml && eas workflow:validate .eas/workflows/publish-production-update.yml",
"wf:dev": "eas workflow:run .eas/workflows/build-development.yml",
"wf:prod": "eas workflow:run .eas/workflows/release-production.yml --ref main",
"wf:hotfix": "eas workflow:run .eas/workflows/publish-production-update.yml --ref main"
```

`-F build_type=...` is gone from both run scripts — the input no longer exists and passing it would error.

`wf:prod` keeps `--ref main` and stays useful even with the push trigger: re-running a release without a new commit, or shipping after a `[eas skip]` merge. The `--ref` rule from [CLAUDE.md](../CLAUDE.md) is unchanged and now matters more, since there is no approval screen left to catch a working-tree upload.

`build-dev` / `build-prev` / `build-prod` stay as the local escape hatch.

---

## Phase 3 — Land it without firing a release

Order matters. `main` must receive the file in a push that does not trigger it.

```powershell
# 1. On dev: apply phases 1, 2 and 5, then verify.
npm run typecheck
npm run wf:validate          # all three files must print "Workflow configuration YAML is valid."
git add -A
git commit -m "split EAS workflows into branch-triggered dev and production lanes"
git push origin dev
```

Pushing `dev` triggers nothing — `dev` matches no `on.push.branches` entry in any file.

```powershell
# 2. Create the build branch from dev. It needs build-development.yml
#    present on it: for push events EAS reads the workflow file from the
#    pushed ref, not from the default branch.
git checkout -b build
git push -u origin build
```

**That push fires the development lane.** It is the intended first rehearsal — see Phase 4.

```powershell
# 3. Merge to main with the skip token.
git checkout main
git merge dev --no-ff -m "wire EAS workflows to branch pushes [eas skip]"
git push origin main
git checkout dev
```

`[eas skip]` (also `[skip eas]` / `[no eas]`) in the commit message suppresses `push`- and `pull_request`-triggered runs. Without it, the merge commit that installs `release-production.yml` immediately builds and submits 1.0.2 to Play — and with the gate removed there is nothing to stop it. **If you merge through a GitHub PR instead of locally, the token must be in the merge commit message, not the PR title** — the merge dialog's commit message body is what GitHub sends in the webhook.

---

## Phase 4 — Rehearse on `build`

Three pushes, in this order. Nothing here can reach Play.

1. **Already done by Phase 3 step 2.** Confirm the run appears in the Expo dashboard under *Development build (Android)*, `pre_checks` passes (`.npmrc` → `npm ci` → tsc → doctor) and an APK is produced.
2. **Doc-only push** — edit any `.md` file, commit, push to `build`. **No run should start.** This proves the `paths` negation works. If a run *does* start, the negation is not being honoured and the same key on `release-production.yml` will not protect `main` either — drop `paths` from the production lane and rely on `[eas skip]`.
3. **Code-only push** — touch a `.ts`/`.tsx` file, commit, push to `build`. A run **must** start. This proves `"**"` matches ordinary source paths. If it does not, the `paths` block is silently suppressing everything and `main` would never release — remove `paths` from both files.

Step 3 is the one that matters. A `paths` block that matches nothing fails closed on `main`: no build, no error, no notification, and the first sign is a release that never appeared.

Then confirm concurrency: push twice to `build` within a minute or two and check the first run shows as cancelled rather than both completing.

---

## Phase 5 — Update [CLAUDE.md](../CLAUDE.md)

The CI/CD section is now wrong in several specifics:

- The command table lists `wf:dev` / `wf:prod` with `-F build_type=`. Replace with the Phase 2 forms.
- "Two dispatch-only EAS Workflows live in `.eas/workflows/`. Neither has an `on.push` trigger, so pushing to `dev` or `main` spends no EAS minutes." — now three files, two of them push-triggered. State the branch → lane table instead.
- The `build.yml` bullet describing the `build_type` choice input describes a deleted file.
- **"In `build.yml`, `submit_to_play` must keep `needs: [approve_submission]` — never `after:`"** — `approve_submission` no longer exists. Keep the `needs`-not-`after` rule, retargeted at `needs: [build_production]`, and keep the reasoning: `after` runs on upstream failure.

Add, as new rules:

- **`build` is a build trigger, not a feature branch.** Pushing to it spends EAS minutes. Do not use it for work in progress.
- **Pushing to `main` releases to Google Play with no confirmation.** Bump `expo.version` and `package.json` `version` in lockstep as the *last commit on `dev`* before merging. Nothing downstream checks this any more.
- **`[eas skip]` in a commit message suppresses push-triggered runs** — the escape hatch for doc, config or tooling commits that reach `main` without warranting a release.
- The runtime-version rule and the `--ref main` rule are unchanged and still apply.

---

## Consequences of removing the gate

The approval click was doing four jobs. Three of them now need somewhere else to live.

| It used to catch | Now caught by |
|---|---|
| `channel = none` / `runtimeVersion = none` — the OTA lane silently dead for that release | **Nothing.** Verify on the build page after the fact. A wrong answer here is not fixable OTA — it needs another store release. |
| `versionCode` lower than what is live | `autoIncrement` with `appVersionSource: "remote"`; the counter cannot go backwards. Genuinely safe. |
| A dirty working tree reaching Play via a `--ref`-less dispatch | `on.push` runs always use the pushed commit. The risk only survives on manual `wf:prod`, which pins `--ref main`. Net improvement. |
| "Do I actually want to ship this?" | **The merge to `main`.** That commit is now the release decision. |

Concretely:

- **A bad merge to `main` reaches every user.** `releaseStatus: "completed"` is 100% rollout the moment Google approves, with no staged rollout buffer. The recovery path is an OTA hotfix if the bug is JS-only, or another store release if it is not.
- **`main` stops being a branch you can push to casually.** README fixes are covered by `paths`; anything else needs `[eas skip]`.
- **Every merge to `main` is a Play release.** The history shows `dev` → `main` merges landing per-feature (PRs #11–#16). That cadence and this trigger together mean a store submission per feature. Either batch merges into releases, or accept a much higher release rate than the project has had.
- **Forgetting to bump `expo.version`** produces a second Play release with the same version name. Play accepts it (the versionCode differs) but it is confusing in Console, and — via `runtimeVersion.policy: appVersion` — both binaries share a runtime version, so an OTA published later hits both. Not dangerous, just untidy.

### One-line tightening, if the release rate turns out too high

Add `app.json` to the production trigger's `paths`:

```yaml
    paths:
      - app.json
```

`expo.version` lives in `app.json`, and the existing rule already says *bump `expo.version` ⟺ a new binary is required*. So the trigger would read "release when a release was declared", and ordinary merges to `main` would be free. The cost is a second invariant to remember, and a genuine release whose `app.json` was somehow untouched would not ship. Deliberately **not** in the plan above — it is one key to add later if the cadence proves painful.

---

## Files touched

| File | Change |
|---|---|
| `.eas/workflows/build-development.yml` | new — push to `build` |
| `.eas/workflows/release-production.yml` | new — push to `main`, no approval gate |
| `.eas/workflows/build.yml` | **deleted** |
| `.eas/workflows/publish-production-update.yml` | unchanged |
| [package.json](../package.json) | `wf:validate`, `wf:dev`, `wf:prod` rewritten |
| [CLAUDE.md](../CLAUDE.md) | CI/CD section per Phase 5 |
| [docs/CICD.md](CICD.md) | add a pointer to this file |

New git branch `build`, pushed to `origin`.

## Verification

1. `npm run typecheck` → exit 0.
2. `npm run wf:validate` → three × "Workflow configuration YAML is valid."
3. `git push origin build` → *Development build (Android)* runs, APK produced.
4. Doc-only push to `build` → **no run**.
5. Code-only push to `build` → run starts. (4 and 5 must both hold; see Phase 4.)
6. Two rapid pushes to `build` → the first run shows cancelled.
7. Merge to `main` with `[eas skip]` → **no run**, and *Release to Google Play (Android)* appears in the dashboard workflow list.
8. The next real release: merge to `main` without the token → build → submit, no approval prompt. Check the build page for `channel = production` and `runtimeVersion` matching `expo.version` **as it happens** — there is no longer a pause in which to check it beforehand.
