# CSS Change Rules

## Goal

This file defines how to choose CSS units and responsive strategies in this project so style changes stay predictable, readable, and easy to maintain.

The main principle is:

- Do not unify everything to `vw`
- Do not unify everything to `px`
- Use the unit that matches the job of the value

## Core Rules

1. Use `rem` for typography and spacing that should scale with overall reading density.
2. Use `vw` only for layout values that should truly follow viewport width.
3. Prefer `clamp()` when a value should respond to screen size but still keep a safe minimum and maximum.
4. Keep `px` for precision values that should stay visually exact and list these components when you finished the tasks.
5. Use `%` when a value should depend on the parent/container rather than the viewport.
6. Use `vh` or `dvh` only for height-related viewport constraints.
7. For component-level adaptation, prefer container-based strategies over adding more viewport-only rules.

## Unit Selection

### Use `rem`

Use `rem` for values tied to reading rhythm and visual consistency:

- font sizes
- line-height-adjacent spacing
- section spacing
- card padding
- button padding
- border radius
- modal inner spacing
- common component gaps

Why:

- changing root size scales the system consistently
- easier to tune reading comfort across the site
- reduces scattered one-off spacing edits

Examples:

- `padding: 1.5rem`
- `gap: 2rem`
- `border-radius: 1.25rem`

### Use `vw`

Use `vw` only for values that should track viewport width directly:

- large layout widths
- hero decorative sizing
- wide visual blocks
- responsive card basis when tied to screen width

Why:

- `vw` reacts to screen width, not reading comfort
- overusing it makes text and spacing unstable

Examples:

- `width: 40vw`
- `flex-basis: 38vw`

Do not use `vw` as the default unit for:

- body text
- normal padding
- button sizing
- general spacing

### Use `clamp()`

Use `clamp()` when the value should adapt to screen size but remain bounded.

Preferred pattern:

- `clamp(min, preferred, max)`

Use it for:

- headings
- responsive widths
- larger spacing that should grow but not break layout
- card basis values

Examples:

- `font-size: clamp(1.75rem, 4vw, 3rem)`
- `width: clamp(16rem, 38vw, 22.5rem)`

Rule:

- if a value is currently a raw `vw` and feels unstable, convert it to `clamp()`

### Keep `px`

Keep `px` where exact visual precision matters:

- 1px borders
- hairlines
- very small icon alignment values
- fine shadow offsets when exact tuning matters
- breakpoint definitions in media queries

Examples:

- `border: 1px solid`
- `box-shadow: 0 1px 2px ...`

Rule:

- do not force tiny precision values into `rem` unless there is a clear benefit

### Use `%`

Use `%` when the value should depend on the containing block:

- widths relative to parent
- layout fill behavior
- responsive child sizing inside known wrappers

Examples:

- `width: 100%`
- `max-width: 80%`

### Use `vh` / `dvh`

Use these only for viewport-height relationships:

- hero min-height
- modal max-height
- full-screen sections

Prefer `dvh` when mobile browser UI changes make height unstable.

Examples:

- `max-height: 72dvh`
- `min-height: 100vh`

## Responsive Strategy

### Page-Level Responsiveness

Use media queries for page-level layout changes:

- navigation layout
- page padding
- section stacking
- major layout shifts between mobile, tablet, and desktop

Rule:

- continue to use media queries for global layout states

### Component-Level Responsiveness

Use component/container-based adaptation for local adjustments:

- project cards
- skill cards
- modal content layout
- compact card text layout

Rule:

- if only one component needs to react to reduced width, do not solve it with a page-wide rule first

### JS-Synchronized States

Only synchronize CSS with JS when style must follow behavior state exactly.

Current strong-sync candidates in this project:

- mobile navigation open/closed state
- projects carousel behavior
- project modal open/closed state
- skills equal-height behavior

Rule:

- do not bind ordinary reading/layout styles to JS unless behavior state requires it

## Rules For This Project

### Theme Tokens

In `data/theme.json`:

- prefer `rem` for spacing and readable typography tokens
- keep bounded responsive widths in `clamp()`
- keep viewport-height constraints in `vh` or `dvh`
- avoid replacing all values with `vw`

### Behavior Config

In `data/behavior.json`:

- keep interaction thresholds and JS behavior values only
- do not move ordinary spacing or typography tokens here

### Content Layer

In `data/content/`:

- keep text and structured content only
- do not place layout values here

## Conversion Rules

When updating an existing CSS value, use this decision order:

1. Is it content text? If yes, it does not belong in CSS sizing rules.
2. Is it a behavior threshold for JS? If yes, move or keep it in `behavior.json`.
3. Is it a global visual token? If yes, put it in `theme.json`.
4. Is it typography or spacing? Prefer `rem`.
5. Is it truly tied to viewport width? Use `vw` or `clamp()`.
6. Does it need a safe min and max? Use `clamp()`.
7. Does it need exact physical precision? Keep `px`.

## Anti-Rules

Avoid these changes:

- converting all `px` to `vw`
- converting all values to one unit for consistency alone
- using JS-driven viewport classes for ordinary spacing/typography
- using raw `vw` for body text
- storing CSS theme tokens in `behavior.json`
- storing layout values in content files

## Recommended Defaults

Use these defaults when unsure:

- text size: `rem` or `clamp(rem, vw, rem)`
- spacing: `rem`
- card width: `clamp(...)`
- section padding: `rem`
- page breakpoints: media query with `px`
- modal height: `vh` or `dvh`
- component-local compact mode: container-based rule

## Quick Summary

- `rem` for reading rhythm
- `vw` for true viewport-driven layout
- `clamp()` for safe responsiveness
- `px` for precision
- `%` for parent-relative sizing
- `vh/dvh` for viewport height
- media queries for page layout
- container-based rules for component adaptation
- JS sync only for behavior-driven states
