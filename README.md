# MovePilot Survey App Refactor Notes

This folder is a safer-to-edit version of the original single-file HTML app.

## What changed

- `index.html` now contains the page structure only.
- `styles.css` contains the main styling that used to live in the top `<style>` block.
- `js/html2pdf.bundle.min.js` contains the bundled PDF/export library from the original file.
- `js/app.js` contains the app behaviour from the original file, with section headers added so it is easier to navigate.

## What did not change

- The inline button handlers in the HTML are still supported.
- Local/offline storage behaviour is preserved.
- The app still uses browser storage for saved surveys/settings and IndexedDB for photos.
- No business logic was intentionally rewritten in this first cleanup pass.

## Suggested next pass

1. Test the refactored `index.html` in a browser.
2. Move repeated rendering snippets into small helper functions.
3. Replace inline `onclick`/`onchange` handlers with central event listeners once everything is covered by manual tests.
4. Turn the photo, inventory, quote, and activation areas into separate JS modules when you move to a fuller app build.
