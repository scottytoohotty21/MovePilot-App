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

## Pass 7 Changes

- Added a `Crew instruction summary` label before `buildCrewInstructionsSummary()`.
- Reformatted the crew summary object and top-level export-wrap state.
- Tidied part of the note-handling logic that decides whether an item note belongs with customer responsibilities or crew notes.
- Left encoded text/template-output lines untouched to avoid changing PDF/listed-inventory wording.
- Verified `js/app.js` still passes JavaScript syntax checking after the crew-responsibility pass.

## Pass 8 PDF/Export Map

- Added non-behavioural labels in the PDF/export area:
  - Printable listed inventory content
  - Printable/PDF styling
  - PDF share/download state
  - PDF ready modal
  - Browser print/review fallback
- Identified the main PDF areas:
  - `getPrintableListedSections()`
  - `getPrintableMaterialsHtml()`
  - `getPrintableResponsibilitiesHtml()`
  - `getPrintableCrewInstructionsHtml()`
  - `getListedInventoryDownloadCss()`
  - `shareListedInventoryPdf()`
  - `saveListedInventoryPdfToDevice()`
  - `printListedInventoryPdf()`
  - PDF ready modal helpers
- Important finding: `sharePreparedListedInventoryPdf()` is defined twice, and `saveListedInventoryPdfToDevice()` is defined twice. JavaScript will use the later definitions. Do not remove either copy casually; first compare the two versions and confirm which behaviour the app currently depends on.
- Recommended next PDF pass:
  1. Compare duplicate PDF share/save functions.
  2. Preserve the currently active behaviour.
  3. Remove or rename superseded duplicate code only after testing.
  4. Extract shared PDF document-building logic so save/share/print do not each rebuild near-identical HTML.
  5. Keep PDF wording and layout unchanged until the duplicate flow is stable.
- Verified `js/app.js` still passes JavaScript syntax checking after adding PDF/export labels.

## Pass 9 PDF Audit

No PDF behaviour was changed in this pass. The goal was to identify the moving parts before touching the fragile tablet-compatible export flow.

### Active buttons in `index.html`

- `Review / Print PDF` calls `printListedInventoryPdf()`.
- `Share PDF` calls `shareListedInventoryPdf()`.
- `Save PDF to Device` is currently commented out in the HTML, so the button is not visible.
- `pdf-ready-overlay` is the active PDF-ready pop-up used by the current share flow.
- `listed-pdf-ready-overlay` still exists in the HTML and calls the same close/share names, but the current code opens `pdf-ready-overlay`, not this older/alternate modal.

### Active PDF content helpers

- `getPrintableListedSections(items)` builds the listed inventory room/section tables.
- `getPrintableMaterialsHtml(materials)` builds the materials block.
- `getPrintableResponsibilitiesHtml(summary, items)` builds exclusions and customer responsibility PDF content.
- `getPrintableCrewInstructionsHtml(items)` builds crew instruction PDF content.
- `getListedInventoryDownloadCss()` supplies the PDF-only styling used by the generated download/share document.
- `makeSafePdfFilenamePart(value)` cleans customer/reference text for PDF filenames.
- `isOldTablet()` and `getHtml2CanvasScale()` are still part of the Android/tablet compatibility path.

### Active PDF flows

- `shareListedInventoryPdf()` creates the PDF blob for sharing, stores it in `listedInventoryPreparedSharePayload`, opens `pdf-ready-overlay`, and calls `bindPdfShareButton(pdfFile)`.
- The later `sharePreparedListedInventoryPdf(event)` is the active version because it appears after the older function with the same name. It hands off to `tryShareListedInventoryPdfFromGesture(...)`.
- The later `saveListedInventoryPdfToDevice()` is the active version because it appears after the older function with the same name. The visible save button is currently commented out, but this function still exists.
- `printListedInventoryPdf()` is the review/print fallback. It uses a browser print window instead of the html2pdf download path.
- `tryShareListedInventoryPdfFromGesture(...)`, `bindPdfShareButton(...)`, `triggerListedInventoryDownload(...)`, `preparePdfDownloadLink(...)`, and the share-toast helpers are active support code for the newer share/download fallback.

### Duplicate/superseded areas to handle carefully

- `sharePreparedListedInventoryPdf()` is defined twice. The first version is labelled "Safe Share Function", but the later version overrides it in the browser.
- `saveListedInventoryPdfToDevice()` is defined twice. The later version overrides the first version in the browser.
- The older duplicate share/save functions should not be deleted yet. First compare them against the active later versions and confirm nothing useful was lost, especially older Android download fallback behaviour.
- There are two PDF-ready overlays in the HTML. Before removing either one, confirm which overlay appears during real tablet testing.

### Recommended next PDF cleanup step

Compare the duplicate share/save functions line by line, then remove only the truly superseded copies. After that, test:

1. Share PDF on desktop/browser.
2. Download PDF from the ready modal.
3. Review / Print PDF.
4. Same flow on the older Android tablet.

## Principle For The Next Pass

Keep all existing function names in global scope for now. The HTML still uses inline handlers such as `onclick="..."`, so renaming or wrapping functions too early could break buttons.

## Pass 10 PDF Duplicate Quarantine

- Renamed the older overridden `sharePreparedListedInventoryPdf()` copy to `supersededSharePreparedListedInventoryPdf()`.
- Renamed the older overridden `saveListedInventoryPdfToDevice()` copy to `supersededSaveListedInventoryPdfToDevice()`.
- Left the newer active PDF share/save functions unchanged.
- This means the browser now has only one live function with each button-facing PDF name:
  - `sharePreparedListedInventoryPdf(event)`
  - `saveListedInventoryPdfToDevice()`
- The superseded versions are still kept in the file temporarily so their Android/tablet fallback logic can be compared before final deletion.
- Verified `js/app.js` still passes JavaScript syntax checking after the duplicate quarantine.

## Pass 11 PDF Duplicate Removal

- Removed the previously quarantined `supersededSharePreparedListedInventoryPdf()` function.
- Removed the previously quarantined `supersededSaveListedInventoryPdfToDevice()` function.
- Left the active PDF flow untouched:
  - `shareListedInventoryPdf()`
  - `sharePreparedListedInventoryPdf(event)`
  - `saveListedInventoryPdfToDevice()`
  - `printListedInventoryPdf()`
  - `bindPdfShareButton(...)`
  - `tryShareListedInventoryPdfFromGesture(...)`
- Verified there are no remaining references to the superseded function names.
- Verified `js/app.js` still passes JavaScript syntax checking after removing the duplicate PDF code.

## Pass 12 PDF Ready Modal Cleanup

- Removed the older unused `listed-pdf-ready-overlay` modal from `index.html`.
- Removed the unused `listed-pdf-ready-name` CSS rule from `styles.css`.
- Updated `closeAllListedPdfShareOverlays()` so it only closes the live `pdf-ready-overlay`.
- Left the active PDF-ready popup untouched:
  - `pdf-ready-overlay`
  - `pdf-share-now-btn`
  - `pdf-download-link`
- Verified there are no remaining references to `listed-pdf-ready-overlay` or `listed-pdf-ready-name`.
- Verified `js/app.js` still passes JavaScript syntax checking after the modal cleanup.

## Packaging Hotfix

- Updated `index.html` to load top-level scripts:
  - `html2pdf.bundle.min.js`
  - `app.js`
- This matches the GitHub upload layout where `app.js` and `html2pdf.bundle.min.js` sit beside `index.html`.
- Added top-level copies of `app.js` and `html2pdf.bundle.min.js` in the output folder to reduce upload/path confusion.
- Verified the top-level `app.js` copy still passes JavaScript syntax checking.

## Pass 13 PDF Preview Popup Cleanup

- Removed a hidden, unused `pdf-ready-overlay` popup from the Review / Print preview HTML generated inside `printListedInventoryPdf()`.
- Left the real app-level `pdf-ready-overlay` in `index.html` untouched.
- Confirmed the only remaining `pdf-ready-overlay` markup is the live PDF-ready popup with:
  - `pdf-share-now-btn`
  - `pdf-download-link`
  - `closeListedPdfReadyModal()`
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Pass 14 PDF Shared Document Builder

- Added `buildListedInventoryPdfContext(filteredItems)` to prepare the shared PDF data once:
  - listed summary
  - materials summary
  - crew instructions HTML
  - listed inventory sections HTML
  - customer/reference/signature details
  - PDF filename
- Added `createListedInventoryPdfWrapper(pdfContext)` to build the hidden html2pdf document wrapper in one place.
- Updated `shareListedInventoryPdf()` to use the shared context/wrapper.
- Updated `saveListedInventoryPdfToDevice()` to use the shared context/wrapper.
- Left the actual share, download, and older-tablet fallback behaviours unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Pass 15 PDF Options Helper

- Added `getListedInventoryPdfOptions(fileName)` so html2pdf settings live in one place.
- Updated both `shareListedInventoryPdf()` and `saveListedInventoryPdfToDevice()` to use the shared options helper.
- Kept the existing PDF settings unchanged:
  - A4 portrait
  - JPEG quality `0.84`
  - old-tablet scale from `getHtml2CanvasScale()`
  - CSS/legacy page breaks
  - avoid breaking inside `.pdf-room-block`
- Left the share/download/save behaviours unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Pass 16 PDF Share Modal Tidying

- Added `clearListedInventoryPreparedShare()` to reset prepared PDF share state in one place.
- Updated `shareListedInventoryPdf()` to use the state reset helper.
- Tidied indentation in the prepared-share payload and PDF-ready modal binding.
- Tidied guard clauses in `preparePdfDownloadLink(...)` and `bindPdfShareButton(...)`.
- Left share/download behaviour, toast messages, and tablet fallbacks unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Pass 17 PDF Print Context Reuse

- Updated `printListedInventoryPdf()` to use `buildListedInventoryPdfContext(filteredItems)`.
- Removed repeated print-only preparation for:
  - listed summary
  - materials summary
  - crew instructions HTML
  - listed inventory sections HTML
  - customer/reference/signature details
- Tidied the no-items and pop-up-blocked branches in the print flow.
- Left the print-preview CSS, window handling, and Print / Save PDF buttons unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Pass 18 PDF Print Preview Markup Tidy

- Tidied the generated Review / Print preview markup inside `printListedInventoryPdf()`.
- Reformatted the preview action bar, footer cards, and responsibility cards.
- Tidied the `onafterprint` cleanup/close callback and preview-window focus timer.
- Left the print-preview CSS block in place to avoid a larger behavioural risk before older-tablet testing.
- Left the actual Print / Save PDF and Close Preview behaviour unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Round 2 Prep: Schedule, Availability, and Costing Map

No app behaviour was changed in this prep pass. This is a starting map for the next cleanup area.

### Main UI entry points

- Schedule tab is in `index.html` under `content-schedule`.
- Costing/availability tab is in `index.html` under `content-quote`.
- Schedule navigation uses:
  - `renderScheduleSequenceDropdown()`
  - `handleScheduleSequenceChange(...)`
  - `renderScheduleCalculator()`
  - `autoBuildScheduleDays()`
  - `addScheduleDay()`
- Costing/availability navigation uses:
  - `renderQuoteTab()`
  - `renderQuoteSequenceSelect()`
  - `handleQuoteSequenceChange(...)`
  - `renderQuoteAvailabilityPricingPanel(...)`
  - `renderAvailabilityPricingPanel(...)`

### Schedule data shape

- Base defaults start near `createEmptySequenceSchedule()`.
- Legacy/default cleanup appears in both:
  - `ensureScheduleDataShape()`
  - `ensureSequenceScheduleShape(seq)`
- Manual planner rows are handled by:
  - `getDefaultManualScheduleRows()`
  - `createEmptyScheduleLeg(...)`
  - `ensureScheduleRowShape(day)`
  - `loadManualScheduleFromActiveSequence()`
  - `saveManualScheduleToActiveSequence()`

### Manual planner and route/mileage

- Travel legs and mileage helpers:
  - `getScheduleLegMiles(day)`
  - `getScheduleLegVanMiles(day)`
  - `getPlannerMileageSummary()`
  - `syncPlannerMileageToCosting(sequenceId)`
  - `openScheduleLegInGoogleMaps(...)`
- Route/location helpers:
  - `getScheduleLocationAddress(...)`
  - `getScheduleLocationPreviewLabel(...)`
  - `getScheduleLegLocationOptions()`
  - `renderScheduleLegLocationOptions(...)`
  - `renderScheduleLegs(...)`

### Schedule auto-build and validation

- Auto-build status:
  - `markScheduleAutoBuildUpdateNeeded(...)`
  - `clearScheduleAutoBuildUpdateNeeded(...)`
  - `getScheduleAutoBuildUpdateCardHtml()`
- Auto-build creation:
  - `autoBuildScheduleDays()`
  - `addScheduleDay()`
  - `removeScheduleDay(...)`
  - `updateScheduleDay(...)`
- Planner validation and capacity:
  - `calcScheduleValidation(...)`
  - `buildScheduleRowTimeBreakdown(...)`
  - `buildScheduleRowCompactTimeSummary(...)`
  - `renderSchedulePlanner()`
  - `renderScheduleCalculator()`

### Availability and quote pricing

- Availability cache:
  - `PHOTON_AVAILABILITY_CACHE_KEY`
  - `getAvailabilityCache()`
  - `saveAvailabilityCache(...)`
  - `refreshAvailabilityCacheSample()`
- Availability tables/constants:
  - `LOCAL_AVAILABILITY_BY_DATE`
  - `TEST_AVAILABILITY_MARGIN_BY_BRANCH_DATE`
  - `QUOTE_AVAILABILITY_BANDS`
  - `AVAILABILITY_RATE_TABLE`
- Quote/costing state:
  - `createEmptyQuoteSequenceState()`
  - `ensureQuoteSequenceState(sequenceId)`
  - `syncQuotePricingFromSchedule(sequenceId)`
  - `calcQuoteScheduleTotals(sequenceId)`
  - `getQuoteCommercialTotals(sequenceId)`

### Early cleanup candidates

- There are duplicate function names in the quote/availability area:
  - `getAvailabilityPricingState(sequenceId)`
  - `getScheduleRowDateValue(row)`
  - `getHighestAvailabilityBand(...)`
- Do a duplicate audit first, like the PDF duplicate pass.
- `ensureQuoteSequenceState(sequenceId)` has rough indentation around competition and availability state defaults.
- `ensureSequenceScheduleShape(seq)` repeats some schedule default cleanup already seen earlier.
- `autoBuildScheduleDays()` and `addScheduleDay()` repeat manual row object creation; a row factory may be useful after tests.
- `calcScheduleValidation(...)` is dense and high-risk; map and label it before changing logic.

### Suggested first Round 2 pass

1. Audit duplicate availability function names.
2. Quarantine duplicates by renaming only if they are genuinely overridden.
3. Run syntax check.
4. User tests schedule tab, costing tab, and availability panel.
5. Only then remove superseded duplicate code.

## Round 2 Pass 1 Availability Duplicate Quarantine

- Quarantined the earlier overridden quote/availability helper functions:
  - `getScheduleRowDateValue(row)` -> `supersededQuoteScheduleRowDateValue(row)`
  - `getAvailabilityPricingState(sequenceId)` -> `supersededAvailabilityPricingState(sequenceId)`
  - `getHighestAvailabilityBand(dates)` -> `supersededHighestAvailabilityBand(dates)`
- Left the later active function names untouched:
  - `getScheduleRowDateValue(row)`
  - `getAvailabilityPricingState(sequenceId)`
  - `getHighestAvailabilityBand(dateBands)`
- Verified the superseded names have no callers.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus before removal:
  - open Schedule tab
  - open Costing tab
  - switch quote sequence
  - check Availability Pricing panel
  - change availability band/uplift if possible

## Round 2 Pass 2 Availability Duplicate Removal

- Removed the previously quarantined duplicate helpers:
  - `supersededQuoteScheduleRowDateValue(row)`
  - `supersededAvailabilityPricingState(sequenceId)`
  - `supersededHighestAvailabilityBand(dates)`
- Left the active helper functions untouched:
  - `getScheduleRowDateValue(row)`
  - `getAvailabilityPricingState(sequenceId)`
  - `getHighestAvailabilityBand(dateBands)`
- Verified the superseded names are gone.
- Verified the active names remain available.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus remains:
  - Schedule tab
  - Costing tab
  - Availability Pricing panel
  - quote sequence switching

## Round 2 Pass 3 Quote State Shape Tidy

- Reformatted `createEmptyQuoteSequenceState()` competition defaults.
- Reformatted `ensureQuoteSequenceState(sequenceId)` so its sections are readable:
  - core quote arrays/values
  - competition defaults
  - availability pricing defaults
  - multi-date/fader suggestion state
- Removed one repeated availability-state existence check that could not be reached after the earlier check had already created the object.
- Kept all remaining conversions and defaults in their existing order.
- Made no pricing or availability rule changes.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Known UI Polish Item

- Schedule `Auto Build` and `Add Day` still work, but give no visual click feedback.
- Both buttons use `.schedule-btn`, which currently has no `.schedule-btn:active` rule.
- Their handlers also do not trigger an existing pulse/confirmation helper.
- Suggested later fix:
  - add a small pressed state such as `transform: scale(0.98)` and a colour/border change
  - optionally show a brief confirmation pulse after the schedule has rebuilt/rendered
- Keep this separate from schedule calculation logic.

## Round 2 Pass 4 Legacy Multi-Date Availability Quarantine

- Identified an older self-contained multi-date availability editor with no HTML controls or external callers.
- Quarantined its functions with `superseded` names:
  - date-row id helper
  - band lookup helper
  - branch/local-table helpers
  - add/delete/update date-row handlers
  - local-table refresh handler
- Updated references inside the quarantined cluster so it remains internally complete for comparison.
- Left the live `quote-availabilityPricingCard` flow untouched.
- Verified the quarantined entry handlers have no app or HTML callers.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus before removal:
  - Costing tab opens
  - Availability Pricing card renders
  - manual band and uplift controls work
  - suggested price still updates

## Round 2 Pass 5 Legacy Multi-Date Availability Removal

- Removed the quarantined legacy multi-date availability editor cluster.
- Removed its unused id, band, branch, local-table, add/delete/update, and refresh helpers.
- Left the active Availability Pricing card flow untouched:
  - `getAvailabilityPricingState(sequenceId)`
  - `renderQuoteAvailabilityPricingPanel(sequenceId)`
  - `calculateAvailabilityMargin(...)`
  - manual band and uplift handlers
- Verified no legacy handler/helper names remain.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Round 2 Pass 6 Legacy Per-Date Band Panel Quarantine

- Identified an older per-schedule-date availability panel targeting `quote-availabilityCard`.
- Confirmed `quote-availabilityCard` does not exist in the current HTML.
- Quarantined the panel and its private helpers:
  - quote band lookup
  - availability date formatting
  - schedule date list
  - highest-band calculation
  - band update handler
  - panel renderer
- Kept `getScheduleRowDateValue(row)` active because live schedule-to-pricing date selection still uses it.
- Left the live `quote-availabilityPricingCard` flow untouched.
- Verified the quarantined functions only reference one another.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Round 2 Pass 7 Legacy Per-Date Band Panel Reduction

- Removed the quarantined panel's unused supporting helpers:
  - band lookup
  - date formatting
  - schedule-date collection
  - highest-band calculation
  - band update handler
- Preserved the active `getScheduleRowDateValue(row)` helper.
- Retained one inert quarantined renderer temporarily because its old encoded template text could not be removed safely with a targeted patch.
- The retained renderer cannot run in the current app because `quote-availabilityCard` does not exist and it returns immediately.
- Left the live `quote-availabilityPricingCard` flow untouched.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Round 2 Pass 8 Unused Availability Helper Quarantine

- Quarantined eight remaining availability helpers with no callers:
  - older quote fader handler
  - older band-options renderer
  - older suggested-price calculation helper
  - older price-rounding helper
  - older move-date change handler
  - older band change handler
  - older uplift change handler
  - older date-margin panel wrapper
- Left the live availability functions untouched:
  - `updateAvailabilityManualBand(...)`
  - `updateAvailabilityFader(...)`
  - `renderQuoteAvailabilityPricingPanel(...)`
  - `renderAvailabilityPricingPanel(...)`
- Verified each superseded helper appears only as its own definition.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Availability Refresh Feedback Fix

- Investigated the missing confirmation after clicking `Refresh Availability`.
- Moved the success alert before the Costing display rebuild, so a later render problem cannot suppress feedback.
- Updated `saveAvailabilityCache(...)` to use the existing safe local-storage helper.
- Added an explicit failure alert if availability cannot be stored on the device.
- Left the sample availability data and pricing rules unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Round 2 Pass 9 Unused Availability Helper Removal

- Removed the eight helpers quarantined in Pass 8:
  - older quote fader handler
  - older band-options renderer
  - older suggested-price calculation helper
  - older price-rounding helper
  - older move-date/band/uplift handlers
  - older date-margin panel wrapper
- Preserved the active availability functions:
  - `refreshAvailabilityCacheSample()`
  - `updateAvailabilityManualBand(...)`
  - `updateAvailabilityFader(...)`
  - `renderQuoteAvailabilityPricingPanel(...)`
  - `renderAvailabilityPricingPanel(...)`
- The only remaining superseded availability code is the inert encoded renderer noted in Pass 7.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Round 2 Pass 10 Costing Display Redraw Cleanup

- Tidied `updateQuoteCommercialDisplays(sequenceId)` indentation.
- Simplified `renderQuoteTabShellOnly()` to perform one commercial display refresh.
- Removed one direct availability render and one duplicate commercial refresh.
- The remaining commercial refresh already renders:
  - commercial summary
  - competition card
  - additional-cost breakdown
  - availability pricing card
- Left quote calculations and availability pricing rules unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

### Known Costing Feedback Item

- Refresh Availability and suggested-price actions visibly update their cards, but confirmation popups are inconsistent.
- Core actions are working; treat this as a later UI-feedback/modal polish item.

## Round 2 Pass 11 Availability Renderer Wrapper Removal

- Removed `renderAvailabilityPricingPanel(sequenceId)`, which only forwarded to the real renderer.
- Updated its remaining caller to use `renderQuoteAvailabilityPricingPanel(sequenceId)` directly.
- Confirmed all availability redraw calls now point to the active renderer.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Round 2 Pass 12 Active Availability Renderer Tidy

- Tidied `renderQuoteAvailabilityPricingPanel(sequenceId)` without changing its calculations.
- Reformatted schedule-date and operating-branch status markup.
- Reformatted the Apply Suggested Price button markup.
- Updated the refresh status line to use `getAvailabilityRefreshText()` so refreshed timestamps survive later redraws.
- Left manual fallback bands, branch/date test rates, uplift, and suggested-price calculations unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Pile 1 Status: Functionally Complete

- Duplicate and disconnected availability helpers have been removed or quarantined.
- Quote/availability state shaping is readable.
- Availability rendering has one direct active path.
- Costing redraw duplication has been reduced.
- Refresh storage and timestamp display are safer.
- Deferred housekeeping:
  - one inert encoded legacy renderer
  - inconsistent Costing action confirmation popups
- Next main area: Pile 2, Manual Schedule Rows.

## Pile 2 Pass 1 Schedule Shape Consolidation

- Audited `ensureScheduleDataShape()` and `ensureSequenceScheduleShape(seq)`.
- Confirmed they were maintaining nearly identical schedule default lists.
- Updated `ensureScheduleDataShape()` to delegate each sequence to `ensureSequenceScheduleShape(seq)`.
- Added the missing `operatingBranch` default to the shared sequence helper.
- Tidied legacy-field deletion and wardrobe-item default indentation.
- Left all existing schedule defaults and legacy-field cleanup in place.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus:
  - open an existing job and Schedule tab
  - switch schedule sequence
  - confirm manual rows still load
  - confirm operating branch still displays

## Pile 2 Pass 2 Manual Schedule Row Factory

- Added `createManualScheduleRow(overrides)` with the existing starter-row defaults.
- Updated `getDefaultManualScheduleRows()` to use the new row factory.
- Left Auto Build, Add Day, and all existing saved rows untouched in this pass.
- This establishes a tested row-construction helper before migrating repeated row objects.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus:
  - open a job/sequence with no saved manual rows if available
  - confirm the default Full Day / Load and Deliver row appears normally
  - confirm existing saved schedule rows remain unchanged

## Pile 2 Pass 3 Add Day Factory Migration

- Updated `addScheduleDay()` to build its AM Load and PM Deliver rows with `createManualScheduleRow(...)`.
- Removed repeated defaults already supplied by the factory:
  - ids
  - completion window/date
  - crew/vans/hours
  - nights out/overtime
- Preserved group ids, tasks, operating branch, and route legs.
- Left Auto Build and PM-pair normalization untouched.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus:
  - click Add Day
  - confirm one AM Load and one PM Deliver row appear
  - confirm both rows share one day/group
  - confirm route legs and operating branch remain correct

## Pile 2 Pass 4 PM Pair Factory Migration

- Updated `ensurePmPair(row)` to use `createManualScheduleRow(...)`.
- Preserved inherited AM-row values:
  - group id
  - date
  - crew
  - vans
  - operating branch
- Preserved the PM-specific four-hour duration and Delivery-to-Depot leg.
- Tidied `normalizeGroup(groupId)` formatting without changing its conditions.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus:
  - change/create an AM-only group if available
  - confirm its PM Deliver partner appears
  - confirm crew, vans, date and branch match the AM row

### Pass 4 Rollback

- User testing found packing was not registering and loading rates were incorrect after this pass.
- Restored `ensurePmPair(row)` and `normalizeGroup(groupId)` to their previously tested implementation.
- Kept earlier Pile 2 passes unchanged pending a focused packing/loading retest.
- Verified both app script copies still pass JavaScript syntax checking after rollback.

## Packing Validation Correction

- User testing confirmed Packing Hours were correct but validation allocated zero for Pack AM / Load PM.
- Root cause: changing a row to AM unconditionally changed its task to `Commence loading`.
- Updated the AM conversion to preserve an existing pack-only task.
- Non-packing rows still become `Commence loading`, preserving previous behaviour.
- This matches the existing Full Day conversion rule, which already preserved Pack tasks.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Focused test:
  - choose Pack on a row
  - switch it to AM
  - set its PM partner to Load
  - confirm Packing validation now receives the AM packing capacity

## Pile 2 Pass 5 Shared Schedule Leg Copy

- Added `copyManualScheduleLeg(leg)` for the common load/save leg normalization.
- Updated both `loadManualScheduleFromActiveSequence()` and `saveManualScheduleToActiveSequence()` to use it.
- Preserved leg fields and behaviour:
  - id
  - from/to locations
  - miles
  - road type
  - manual or calculated travel minutes
- Left schedule row copying and validation logic unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus:
  - open/switch away from a schedule sequence and return
  - confirm route legs, miles, road type and minutes persist

## Pile 2 Pass 6 Shared Schedule Row Copy

- Added `copyManualScheduleRow(day, legs)` for the common row load/save shape.
- Updated both manual schedule load and save paths to use it.
- Preserved all row fields:
  - ids/group
  - day part/task/travel pattern
  - completion/date
  - crew/vans/hours
  - nights out/overtime
  - operating branch
  - normalized legs
- Kept legacy travel-pattern conversion in the load path only.
- Left packing, loading, validation and row-generation logic unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.
- Test focus:
  - edit a schedule row and its route leg
  - switch sequences/tabs and return
  - confirm every row value and route value persists

## Pile 2 Pass 7 Schedule Input Boundary Tidy

- Reformatted `loadScheduleInputsFromActiveSequence()` element lookup and assignment blocks.
- Kept loading defaults unchanged:
  - load rate `125`
  - unload rate `132`
  - loading variant `Standard`
- Tidied special-item input loading/saving.
- Made the Costing-tab refresh in `handleScheduleInputChange()` null-safe.
- Left schedule calculations, planner rows and validation unchanged.
- Kept the top-level `app.js` and backup `js/app.js` copies in sync.
- Verified both app script copies still pass JavaScript syntax checking.

## Pile 2 Pass 8 Route Leg Commit Helper

- Added `commitManualScheduleEdit()` for the shared save-and-refresh ending used by route-leg edits.
- Updated only the Add, Edit and Remove travel-leg actions to use it.
- Preserved schedule saving, mileage synchronization and calculator rerendering.
- Left route, mileage and timing calculations unchanged.
- Test focus:
  - add a travel leg
  - edit its from/to locations, miles and road type
  - remove the leg
  - confirm the changes persist and the costing mileage stays synchronized

## Pile 2 Pass 9 Schedule Row Commit Helper

- Reused the tested `commitManualScheduleEdit()` ending for the three core row actions.
- Updated Add Day, Remove Day and schedule-row field edits.
- Preserved the existing save and calculator redraw order.
- Left row creation, AM/PM pairing, packing, loading, rates and validation unchanged.
- Test focus:
  - add a day and edit its ordinary row fields
  - switch between AM, PM and Full Day
  - remove the day
  - confirm the schedule persists and validation still updates

## Pile 2 Pass 10 Simple Schedule Controls

- Reused `commitManualScheduleEdit()` for three remaining simple controls.
- Updated Apply Operating Branch to All Rows, Add One Hour Overtime and Clear Overtime.
- Preserved the existing save and calculator redraw order.
- Left overtime calculations, branch selection, schedule rows and validation unchanged.
- Test focus:
  - apply an operating branch to all rows
  - add one hour of overtime to a row
  - clear that overtime
  - confirm each change persists and the calculator refreshes

## Pile 2 Pass 11 Auto Build Completion Tidy

- Reused `commitManualScheduleEdit()` at the end of Auto Build.
- Preserved the existing order: install generated rows, clear the update-needed flag, save, then redraw.
- Corrected indentation in that small completion block.
- Left generated row contents, move-mode rules, packing logic, rates and validation unchanged.
- Test focus:
  - run Auto Build for the usual move types
  - confirm the generated rows still appear and persist
  - confirm the Auto Build Update Needed message clears

## Pile 2 Pass 12 Auto Build Status Helper

- Added `setScheduleAutoBuildUpdateNeeded()` for the shared status bookkeeping.
- Kept `markScheduleAutoBuildUpdateNeeded()` and `clearScheduleAutoBuildUpdateNeeded()` as the existing entry points.
- Preserved the reason text, timestamp, optional saving and cleared-state values.
- Left Auto Build generation, calculations, rates and validation unchanged.
- Test focus:
  - make an inventory or sequence change that triggers Auto Build Update Needed
  - confirm the message and reason still appear
  - run Auto Build and confirm the message clears

## Pile 2 Pass 13 Shared Move-Mode Detection

- Made `getAutoBuildMoveMode()` reuse `getLoadingScenarioFromMoveType()`.
- Removed the duplicate Direct, Into Store and Ex Store text-matching rules.
- Kept the existing function name for all Auto Build and schedule callers.
- Left loading profiles, rates, generated rows and validation unchanged.
- Test focus:
  - run Auto Build for a Direct move
  - check an Into Store sequence
  - check an Ex Store sequence
  - confirm each still receives its correct row pattern and loading profile

## Pile 2 Pass 14 Loading Variant Lookup Tidy

- Stored the loading-variant control once while assembling schedule state.
- Removed the repeated lookup of the same on-screen selector.
- Preserved the selected value and the existing Standard fallback.
- Left loading profiles, move-type rates, schedule rows and validation unchanged.
- Test focus:
  - switch between Standard and Slow
  - confirm each selection persists
  - confirm Direct, Into Store and Ex Store calculations remain unchanged

## Pile 2 Pass 15 AM/PM Pairing Readability

- Reformatted `ensurePmPair()` and `normalizeGroup()` into clear, consistently indented blocks.
- Expanded their compact array checks so the AM, PM and Full Day decisions are easier to audit.
- Preserved every pairing condition and every generated PM-row value.
- Did not use the row factory or alter packing, loading, rates or validation.
- Test focus:
  - switch a row to AM and confirm its PM Deliver partner appears
  - switch the group to Full Day and confirm the partner row is removed
  - confirm crew, vans, date, branch and packing validation remain correct

## Pile 2 Pass 16 Completion Day Split Readability

- Reformatted `splitCompletionRowIntoAmPm()` so its AM and PM leg allocation is explicit.
- Removed a redundant PM-task condition whose two outcomes were both `Deliver`.
- Preserved the same AM task choice, PM task, crew, vans, hours, branch and route legs.
- Left the Direct-only split rule, packing calculations, rates and validation unchanged.
- Test focus:
  - set a Direct full-day Load and Deliver row to Completion Day
  - repeat with Pack, Load & Deliver
  - confirm each splits into the same AM and PM rows with the expected route legs
  - confirm Into Store and Ex Store rows do not auto-split

## Pile 2 Pass 17 Remove No-op Row Normalization

- Removed `normalizeCompletionDayRow()`, which only cloned rows without normalizing any values.
- Returned the already-new edited row directly from `updateScheduleDay()`.
- Removed a second group-wide cloning pass immediately before the existing full redraw.
- Preserved every schedule value, AM/PM rule, completion split and save/redraw action.
- Left packing, loading, rates and validation calculations unchanged.
- Test focus:
  - edit ordinary schedule row fields
  - switch between AM, PM and Full Day
  - test Completion Day splitting
  - confirm changes persist and validation still refreshes

## Pile 2 Pass 18 Main Row Update Readability

- Reformatted `updateScheduleDay()` into clear field-update, Completion Day and day-part sections.
- Expanded its AM, PM and Full Day array operations for easier auditing.
- Preserved every condition, task assignment, hour value, generated leg and normalization call.
- Did not move the previous packing correction or alter loading, rates or validation.
- Test focus:
  - edit crew, vans, date, task and nights-out values
  - switch Pack between AM and Full Day and confirm it remains Pack
  - switch rows among AM, PM and Full Day
  - confirm pairing, routes and validation remain correct

## Pile 2 Pass 19 First Dead Schedule Helpers

- Removed unused `getDayPartHours()`, which had no callers.
- Removed unused `getTravelPatternHours()`, which had no callers and always returned zero.
- Kept the active completion-window, normal-window, route-leg and net-task-hour helpers.
- Left schedule calculations, generated rows, rates and validation unchanged.
- Test focus:
  - open the schedule and edit a row
  - confirm AM, PM and Full Day available hours still display correctly
  - confirm route travel time is still deducted from usable task time

## Pile 2 Pass 20 Obsolete Route Helpers

- Removed unused `getScheduleLegVanMiles()`; active mileage totals remain in `getPlannerMileageSummary()`.
- Removed unused `getDefaultLegMinutes()` and its abandoned fixed route table.
- Removed unused `getScheduleLegAddressOptions()`; route rendering already uses `getScheduleLegLocationOptions()`.
- Confirmed all three removed helpers had no callers in the app files.
- Left active mileage synchronization, road-speed timing and location choices unchanged.
- Test focus:
  - add and edit a route leg
  - confirm property locations still appear
  - confirm miles, travel minutes and multi-van costing still update

## Pile 2 Pass 21 Remove Legacy Detailed Time Renderer

- Removed the uncalled `buildScheduleRowTimeBreakdown()` legacy renderer.
- Confirmed the live planner still uses `buildScheduleRowCompactTimeSummary()`.
- Kept `getPlannerTaskBlocks()` because the active compact summary still uses it.
- Removed old unused display code only; schedule timing and overrun calculations remain active.
- Test focus:
  - open schedule rows with route legs and work tasks
  - confirm the compact start, finish and overrun summary still appears
  - confirm Completion Day timing and overtime remain correct

## Pile 2 Pass 21A AM Overtime Display Correction

- Corrected the displayed AM overtime window to begin earlier instead of ending later.
- One AM overtime hour now displays a 07:00 start and the normal 13:00 finish.
- Preserved the same total available time and left capacity calculations unchanged.
- PM and Full Day overtime display rules are unchanged.
- Test focus:
  - add one overtime hour to an AM row
  - confirm schedule notes and the compact timeline begin at 07:00
  - confirm calculated travel, loading and available hours remain unchanged

## Pile 2 Pass 22 PM-created AM Branch Consistency

- Added the operating branch to the AM partner created when a lone row is changed to PM.
- The generated AM row now matches its PM row for date, crew, vans and branch.
- Kept the existing direct object construction following the earlier factory rollback.
- Left tasks, hours, route legs, packing, loading and validation unchanged.
- Test focus:
  - select an operating branch on a Full Day row
  - change that row directly to PM
  - confirm the generated AM partner retains the same branch
  - confirm crew, vans, routes and validation remain correct

## Pile 2 Pass 23 Shared Schedule Window Hours

- Made `getCompletionWindowHours()` reuse the existing normal AM, PM and Full Day hour table.
- Preserved the separate Completion Day helper for clarity and future business-rule changes.
- Current values remain AM `5`, PM `4.5` and Full Day `9.5` hours.
- Left overtime, travel deductions, packing, loading and validation unchanged.
- Test focus:
  - compare normal and Completion Day rows for AM, PM and Full Day
  - confirm their available hours are unchanged
  - confirm overtime and travel deductions still apply correctly

## Pile 2 Pass 24 Planner Task Classifier Readability

- Reformatted `getPlannerTaskMode()` so every Pack, Load, Unload and combined-task match is easy to audit.
- Preserved all task strings and their existing planner modes.
- Confirmed schedule-note titles come directly from the row task rather than a separate fallback label.
- Recorded the temporarily stale Pack/Load and Deliver note as a regression watch item.
- Left task assignments, Auto Build, packing, loading and validation unchanged.
- Test focus:
  - Auto Build a packing sequence and confirm its Pack row and schedule note agree
  - edit inventory and refresh Auto Build again
  - confirm Pack remains classified as Packing throughout

## Pile 2 Pass 25 Final Dead Prompt Helper

- Removed the uncalled `appPrompt()` input-modal wrapper.
- Confirmed it had no event, button or function callers in the active app.
- Kept the active `appAlert()` and `appConfirm()` modal helpers.
- Completed the schedule-section duplicate declaration and dead-helper audit.
- Left schedule behavior, calculations, validation and active feedback unchanged.
- Test focus:
  - perform the usual schedule workflow
  - confirm active alerts and confirmation dialogs still appear where expected

## Pile 2 Pass 26 Current Task Dropdown Accuracy

- Added `taskOptionHtml()` so the task dropdown always displays the row's real saved task.
- If an older or generated task such as `Unpack` is outside the five short manual choices, it is temporarily included and selected.
- Fixed the misleading state where the dropdown showed `Pack` while calculations correctly treated the hidden saved task as unloading.
- Left task classification, calculations, Auto Build and validation unchanged.
- Test focus:
  - inspect older and Auto Built schedule rows before refreshing them
  - confirm the Task dropdown agrees with the compact timeline and Schedule Notes
  - confirm manually selecting Pack, Load, Travel, Deliver and Pack + Load still works

## Pile 2 Complete

- Manual Schedule and Availability cleanup is complete and user-tested.
- Covered schedule storage, sequence switching, row and route editing, Auto Build, AM/PM pairing, Completion Day handling, overtime, branches, loading variants, task display, validation and dead-code removal.
- Final regression confirmed schedule persistence, task/timeline alignment, route creation and active feedback without browser console errors.
- Direct, Into Store and Ex Store retain their separate loading and unloading profiles.

## Later UI and Asset Follow-ups

- Restore visible pressed/pulse feedback for the `Auto Build` and `Add Day` buttons. Both buttons currently work; this is visual polish rather than a functional schedule issue.
- Review the optional local `tailwind-local.css` and `Fonts/Inter-*.woff2` references. These assets were missing from the refactored output folder during local-server testing, although the app continued to render using its existing styles and font fallbacks.
- Revisit the previously observed inconsistent confirmation pop-ups as a separate UI feedback pass.
