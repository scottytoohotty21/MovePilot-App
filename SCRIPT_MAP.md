# MovePilot Script Map

This is the working map for `js/app.js`. It is meant to make the next cleanup passes safer: tidy one area at a time, test it, then move on.

## Current File Shape

| Area | Lines | What It Owns | Notes |
| --- | ---: | --- | --- |
| Reference data and constants | 11-76 | Core dropdown/reference lists, branch data, room defaults, volume constants | Low risk to tidy formatting only. |
| Unit conversion helpers | 77-184 | Cubic feet/CBM/volumetric kg display helpers, surveyor name/signature HTML helpers | Good candidate for early cleanup. Small and self-contained. |
| Local app settings | 185-263 | Settings defaults, reading/writing app settings to local storage | Important for offline use. Needs defensive storage handling. |
| Inventory catalogue data | 264-1082 | Furniture database and inventory category lists | Mostly data. Keep stable unless changing item lists. |
| Default survey data shapes | 1083-1213 | Empty schedule, quote, job, property structures | Important foundation. Good place to make defaults more consistent later. |
| Runtime state and local storage | 1214-1342 | Global working state: jobs, active job/property/sequence, inventory UI state, signature state | Needs untangling carefully because many tabs depend on it. |
| Persistence helpers | 1343-1478 | Saving jobs, schedule shape checks, lock button content, save/lock toggles | High value cleanup target because saving is central. |
| Survey editor navigation | 1479-1705 | Opening jobs, switching to editor, address photo panel entry points | Medium risk. Touch after persistence is safer. |
| Photo storage | 1706-1986 | IndexedDB photo storage, image compression, photo viewer/delete flow | Important for offline use. Should stay isolated. |
| Address tab | 1987-2082 | Main address UI renderer | Surprisingly small section, but tied into helpers around it. |
| Inventory tab | 2083-4583 | Inventory dropdowns, raw/live inventory entries, item flags, custom items, button ordering | Large section. Needs subdivision before deeper edits. |
| Dashboard rendering | 4584-7712 | Dashboard list, job/sequence/property actions, settings modal, manual/CRM entry flows | Very large mixed section. Needs splitting into dashboard, sequence, settings, and modal helpers. |
| Schedule and listed-inventory shared helpers | 7713-7961 | Schedule location option helpers plus listed-inventory photo/list helpers | Renamed to make the mixed purpose clearer. |
| Listed inventory tab | 7962-9757 | Listed inventory filtering, editing, flags, summaries, download/export views | Medium-large section. Good after inventory is subdivided. |
| Signature, export, and sharing helpers | 9758-13183 | Signature drawing, app alerts, listed inventory export, PDF save/share helpers | Renamed to better match the current contents. |
| Costing and quote tab | 13184-19180 | Quote panel, pricing grids, availability, schedule calculator, planner, validation, fringe warnings | Biggest and riskiest section. Needs a map before edits. |
| Activation flow | 19181-19305 | Activation code storage/checks and app boot display | Small and isolated, but currently dev-skip is enabled. |
| Startup | 19306-19322 | DOMContentLoaded boot logic | Small. Should remain simple. |

## Safest Next Cleanup Order

1. Storage safety: protect `localStorage` reads/writes so bad saved data does not break the app.
2. Formatting-only cleanup of jammed variables and obvious one-line function blocks.
3. Rename/split misleading section headings without moving behaviour.
4. Extract tiny helper functions around repeated save/render patterns.
5. Subdivide inventory and dashboard sections.
6. Map the quote/schedule calculator before changing it.

## Specific First Targets

- Done: `jobs = JSON.parse(localStorage.getItem('photon_jobs')) || [...]` has been replaced with safe JSON loading.
- Done: `saveToDevice()` now catches failed saves and records storage health instead of throwing.
- `getAppSettings()` already catches bad settings data, but the main jobs store should do the same.
- Done: line 1285 had two variables on one line and has been split.
- Done: the section called `Schedule tab` included listed-inventory helper functions and has been renamed.
- Done: the section called `Signature pads` included export/sharing functionality and has been renamed.

## Pass 1 Changes

- Added `PHOTON_JOBS_STORAGE_KEY` so the main survey storage key is named once.
- Added `storageHealth`, `rememberStorageError`, `readJsonFromLocalStorage`, and `writeJsonToLocalStorage`.
- Added `createStarterJobs()` and `loadJobsFromDevice()` so unreadable or malformed saved jobs fall back cleanly.
- Updated `saveToDevice()` to return whether the save worked.
- Updated activation read/write/remove paths to use the safer helpers where possible.
- Split a few jammed state declarations onto separate lines while touching the same area.

## Pass 2 Changes

- Cleaned indentation in the top reference-data constants.
- Cleaned indentation in `createEmptyJob()` for the inventory, costing, signature, and sync blocks.
- Reformatted `ensureScheduleDataShape()` so its cleanup/defaulting lines are readable.
- Expanded `toTitleCase()` from a one-line function into a normal function block.
- Reformatted `createDefaultProperties()` and `toggleSaveState()` without changing their behaviour.
- Removed a redundant no-op line in `openJob()` that was immediately overwritten.
- Renamed misleading section headers:
  - `Schedule tab` -> `Schedule and listed-inventory shared helpers`
  - `Signature pads` -> `Signature, export, and sharing helpers`

## Pass 3 Changes

- Added internal dashboard landmarks:
  - Dashboard list
  - Dashboard job actions
  - Sequence actions
  - Property actions
  - Editor navigation
  - Manual job entry
  - Simple costing helper
- Reformatted `renderDashboard()` sequence breakdown markup for readability.
- Reformatted sequence copy/delete helpers without changing their behaviour.
- Reformatted property and stop helpers from one-line functions into normal blocks.
- Reformatted `loadSequence()`, `triggerPulse()`, `switchTab()`, `toggleManualArea()`, `exitToDashboard()`, and `calculateMoveCost()`.
- Verified `js/app.js` still passes JavaScript syntax checking after the dashboard readability pass.

## Pass 4 Changes

- Added internal inventory landmarks:
  - Inventory sequence and delivery controls
  - Raw inventory store
  - Live inventory display and item actions
  - Schedule calculator feed from inventory
  - Room and floor controls
  - Inventory button order, search, and rendering
  - Shared modal helpers
  - Mileage and route helpers
  - Sequence tab rendering
- Reformatted the sequence/delivery dropdown area.
- Reformatted raw inventory entry creation and live item action button state handling.
- Reformatted the schedule calculator feed counters and special-items object.
- Reformatted live inventory key/build/rebuild helpers.
- Reformatted room/floor control helpers and inventory button rendering.
- Tidied selected simple-input modal branches for quantity, listed quantity, listed notes, and schedule numbers.
- Added a clear boundary where inventory-related helpers move into sequence-tab rendering and then dashboard rendering.
- Verified `js/app.js` still passes JavaScript syntax checking after the inventory map/readability pass.

## Pass 5 Changes

- Added internal listed-inventory landmarks:
  - Listed filters and display options
  - Listed item editing and raw-entry matching
  - Listed flags modal
  - Listed specialist tags
  - Listed merge keys and photo refs
  - Materials summary
  - Listed summaries and responsibility notes
- Reformatted the listed photo review markup.
- Reformatted listed filters and CBM display option handling.
- Reformatted raw-entry matching comparisons for listed inventory lines.
- Reformatted listed delete and flags-save flows.
- Reformatted listed merge key/photo-ref handling.
- Left the larger responsibility and crew-instruction summary logic intact for a later focused pass.
- Verified `js/app.js` still passes JavaScript syntax checking after the listed-inventory readability pass.

## Pass 6 Changes

- Added explicit labels for `Customer responsibility notes` and `Crew instruction notes`.
- Reformatted the customer-responsibility auto-note builder inside `buildResponsibilitiesSummary()`.
- Made the handyman, piano specialist, and safe/heavy-lift responsibility rules easier to scan.
- Left crew-instruction summary logic for the next pass.
- Verified `js/app.js` still passes JavaScript syntax checking after the customer-responsibility pass.

## Principle For The Next Pass

Keep all existing function names in global scope for now. The HTML still uses inline handlers such as `onclick="..."`, so renaming or wrapping functions too early could break buttons.
