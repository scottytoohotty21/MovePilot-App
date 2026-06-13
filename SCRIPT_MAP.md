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
