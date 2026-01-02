# Change Records

## 2025-02-14
- Added `index.html` with a portfolio layout matching the minimal-tech reference style.
- Added `styles.css` with gradient background, card system, typography, and responsive rules.
- Added `story.md` with Scrum-based user stories and acceptance criteria.

Reason: Initialize the portfolio site structure, styling, and Scrum story documentation per requirements.

## 2025-12-30
- Updated `story.md` to mark each story as completed with references to the implemented sections.
- Updated `index.html` footer copyright text to ASCII.
- Updated the Skills section to a single split panel with a thin gray divider.
- Updated `styles.css` to style the two-column Skills panel with responsive stacking.
- Updated Skills divider to match Work Experience line style and translated remaining labels to English.
- Rebuilt the Skills layout as two cards to mirror the Projects layout and fixed the section markup.
- Added list styling for the Skills cards.
- Allowed card overlay to ignore pointer events so project links remain clickable.
- Added modal dialogs for each project with details and close behavior.
- Styled modals, buttons, and scroll locking for the project popups.
- Split Projects, Experience, Education, and Skills into separate HTML partials under `sections/`.
- Added a section loader script to fetch partials and re-initialize project modals.
- Removed the project CTA buttons and made each project card trigger its modal directly.
- Added focus and keyboard activation styles for project cards.
- Removed the project card focus outline per visual preference.
- Updated the hero title to match the template text.
- Added project preview illustrations above each project detail.
- Added a hero background illustration styled to match the template keyboard scene.
- Tuned hero illustration size for tablet and hidden it on small screens.

Reason: Record completion status for each story and keep text ASCII-friendly, plus align Skills layout with the requested structure and ensure English UI labels.
