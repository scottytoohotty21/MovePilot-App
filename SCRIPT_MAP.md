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
| Schedule tab / listed inventory crossover | 7713-7961 | Schedule location option helpers plus listed-inventory photo/list helpers | Heading is misleading. This should be renamed or split. |
| Listed inventory tab | 7962-9757 | Listed inventory filtering, editing, flags, summaries, download/export views | Medium-large section. Good after inventory is subdivided. |
| Signature pads / quote availability crossover | 9758-13183 | Signature drawing plus availability/pricing helpers | Heading is misleading. Signature code and quote availability should be separated. |
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
- Line 1285 currently has two variables on one line: `let surveyorSignatureLastY = 0;let signatureLastX = 0;`.
- The section called `Schedule tab` includes listed-inventory helper functions.
- The section called `Signature pads` includes quote/availability functionality as well as signature pad logic.

## Pass 1 Changes

- Added `PHOTON_JOBS_STORAGE_KEY` so the main survey storage key is named once.
- Added `storageHealth`, `rememberStorageError`, `readJsonFromLocalStorage`, and `writeJsonToLocalStorage`.
- Added `createStarterJobs()` and `loadJobsFromDevice()` so unreadable or malformed saved jobs fall back cleanly.
- Updated `saveToDevice()` to return whether the save worked.
- Updated activation read/write/remove paths to use the safer helpers where possible.
- Split a few jammed state declarations onto separate lines while touching the same area.

## Principle For The Next Pass

Keep all existing function names in global scope for now. The HTML still uses inline handlers such as `onclick="..."`, so renaming or wrapping functions too early could break buttons.
