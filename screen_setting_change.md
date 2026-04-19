# Screen System Change Standard

## 1. Purpose

This document defines the implementation standard for refactoring screen-related behavior and styling in this project.

The goal is not only to describe an idea, but to provide a concrete modification baseline that can be used during implementation, review, and acceptance.

Target outcomes:

- keep only one maintained source of truth for global screen breakpoints
- classify the viewport into only three global screen modes: `phone`, `tablet`, `desktop`
- ensure CSS and JS use the same screen mode result
- stop maintaining equivalent breakpoint logic separately in CSS and JS

## 2. Decision Summary

The project shall adopt the following model:

1. `data/behavior.json` is the only source of truth for global screen thresholds
2. JS computes the current screen mode from `behavior.json`
3. JS writes the result to the root element as `html[data-screen="..."]`
4. CSS reads the screen mode through `data-screen` and/or screen-driven CSS variables
5. global screen classification must be limited to `phone`, `tablet`, `desktop`

This is the required target architecture for this change.

## 3. Scope

This standard applies to:

- global screen breakpoint definitions
- JS logic that depends on screen size
- CSS rules that must stay synchronized with JS screen mode
- layout tokens whose values differ by `phone`, `tablet`, `desktop`

This standard does not require:

- moving all visual tokens into `behavior.json`
- replacing every media query in the project
- forcing all responsive behavior to depend on global screen mode

## 4. Mandatory Rules

The following rules are mandatory.

### 4.1 Single Source Of Truth

- Global screen thresholds must exist only in `data/behavior.json`
- JS must not hardcode screen breakpoint numbers outside `behavior.json`
- CSS must not define separate global breakpoint values that duplicate `behavior.json`

### 4.2 Only Three Global Modes

- The only valid global screen modes are `phone`, `tablet`, `desktop`
- No additional global mode such as `smallMobile` is allowed
- If a component needs extra narrow-screen adjustment, that adjustment must be treated as component-local refinement, not as a new global mode

### 4.3 JS Owns Classification

- JS must classify the viewport once and expose the result on `document.documentElement.dataset.screen`
- The root element must always contain one of the following values:
  - `html[data-screen="phone"]`
  - `html[data-screen="tablet"]`
  - `html[data-screen="desktop"]`
- The value must be updated on initial load and on resize

### 4.4 CSS Must Follow The Computed Mode

- CSS rules that need to stay synchronized with JS must use `data-screen` or CSS variables written from the computed mode
- CSS must not separately re-decide the same global screen classification with its own breakpoint numbers

### 4.5 Theme And Behavior Separation

- `data/theme.json` remains the owner of base visual tokens
- `data/behavior.json` owns screen thresholds and only the screen-driven values that must stay synchronized with JS behavior
- Do not move unrelated colors, shadows, or typography system values into `behavior.json`

## 5. Required Target Structure

`data/behavior.json` shall be normalized to a structure equivalent to the following:

```json
{
  "defaultLang": "de",
  "screens": {
    "phoneMax": 599,
    "tabletMax": 899
  },
  "projects": {
    "scrollRatio": 0.9,
    "maxScrollPx": 480
  },
  "screenSettings": {
    "phone": {
      "space-page": "24px 14px 40px",
      "hero-padding": "24px 18px 32px",
      "project-card-basis": "86vw"
    },
    "tablet": {
      "space-page": "44px 18px 48px",
      "hero-padding": "28px 24px 40px",
      "project-card-basis": "80vw"
    },
    "desktop": {
      "space-page": "48px 24px 60px",
      "hero-padding": "36px 42px 60px",
      "project-card-basis": "clamp(240px, 38vw, 360px)"
    }
  }
}
```

Notes:

    - Key names may differ slightly only if there is a strong project-wide consistency reason, please list these components after finished the changes of the code
- The meaning must remain the same: one phone upper bound, one tablet upper bound, and optional per-mode settings
- The current `breakpoints.mobile`, `breakpoints.tablet`, `breakpoints.smallMobile` structure is not the target end state

## 6. Screen Classification Contract

The classification contract is fixed:

- width `<= phoneMax` => `phone`
- width `<= tabletMax` => `tablet`
- width `> tabletMax` => `desktop`

Reference implementation:

```js
const getScreenMode = () => {
  const width = window.innerWidth;
  if (width <= behaviorConfig.screens.phoneMax) return "phone";
  if (width <= behaviorConfig.screens.tabletMax) return "tablet";
  return "desktop";
};
```

Required follow-up behavior:

- `applyScreenMode()` must update `document.documentElement.dataset.screen`
- if `screenSettings` exists, JS should also apply the active mode values to CSS variables
- resize handling must reuse the same classification function instead of duplicating logic

## 7. CSS Usage Standard

Two CSS usage patterns are allowed.

### 7.1 Preferred Pattern: JS Applies CSS Variables

JS writes mode-specific values to CSS custom properties, and component CSS reads only the variables.

Example:

```js
document.documentElement.style.setProperty("--project-card-basis", "86vw");
```

```css
.projects-track .card {
  flex-basis: var(--project-card-basis);
}
```

Use this pattern when:

- many components share screen-dependent values
- the change is mainly about spacing, sizing, or layout tokens
- reducing repeated CSS branches is desirable

### 7.2 Allowed Pattern: Attribute-Based Branches

CSS may also read `data-screen` directly.

Example:

```css
html[data-screen="phone"] .hero {
  padding: 24px 18px 32px;
}

html[data-screen="tablet"] .hero {
  padding: 28px 24px 40px;
}

html[data-screen="desktop"] .hero {
  padding: 36px 42px 60px;
}
```

Use this pattern when:

- only a few components need explicit mode branches
- the rules are easier to inspect directly in DevTools

## 8. File Responsibilities

### `data/behavior.json`

Owns:

- global screen thresholds
- JS-facing behavior thresholds
- optional screen-mode settings that must stay synchronized with JS

Must not own:

- general theme colors
- general typography tokens
- unrelated visual decoration tokens

### `data/theme.json`

Owns:

- base visual tokens
- base spacing tokens that are not JS-synchronized
- colors, surfaces, typography defaults, radius, shadows

### JS runtime file

Owns:

- reading screen settings from `behavior.json`
- classifying the current viewport
- writing `html[data-screen]`
- applying screen-driven CSS variables when needed
- reapplying on resize

### `styles.css`

Owns:

- component structure
- final rendering rules
- consumption of CSS variables
- optional `html[data-screen]` branches where appropriate

Must not own:

- duplicated global breakpoint decisions with separate numeric values

## 9. Migration Rules For Current Project

The current project state includes:

- `data/behavior.json` with `breakpoints.mobile`, `breakpoints.tablet`, `breakpoints.smallMobile`
- `styles.css` with global `@media (max-width: 900px)`, `@media (max-width: 600px)`, and `@media (max-width: 480px)`

The migration must follow these rules:

### 9.1 Breakpoint Normalization

- Replace the current global breakpoint structure with a three-mode structure
- `mobile` should map to `phoneMax`
- `tablet` should map to `tabletMax`
- `smallMobile` must not remain as a global screen mode breakpoint

### 9.2 Handling Existing `480px` Rules

- Existing `480px` rules must be reviewed one by one
- If a rule is only fine-tuning a phone layout, prefer fluid CSS, `clamp()`, or component-local treatment
- If a rule still truly requires a viewport threshold, it may remain as a local CSS refinement, but it must not define a new global screen mode

### 9.3 Media Query Cleanup

- Global layout or behavior branches currently implemented via repeated `600px` and `900px` media queries should be migrated to the unified screen-mode system
- Media queries may remain for purely local responsive refinements that do not need JS synchronization

## 10. What Must Be Synchronized

The following kinds of project behavior should use the unified screen system when they differ by device class:

- navigation behavior
- projects carousel width and control layout
- page padding
- hero padding
- project card basis
- modal layout limits when tied to screen mode
- any JS behavior that already depends on mobile/tablet distinction

## 11. What Should Stay Out Of This System

The following should normally stay outside the global screen-mode system:

- hover and active decoration
- purely visual effects
- typography defaults that do not need JS sync
- component-local wrapping behavior
- local refinements better handled by container size or fluid CSS

## 12. Anti-Rules

The following patterns are not allowed as the target state:

- keeping one breakpoint set in JS and another equivalent set in CSS
- retaining `smallMobile` as a fourth global mode
- moving the entire theme system into `behavior.json`
- replacing every media query with JS-controlled logic
- using `data-screen` for every minor visual difference

## 13. Acceptance Criteria

This change is considered complete only when all of the following are true:

1. The project has exactly one maintained source of truth for global screen thresholds
2. The global screen system exposes only `phone`, `tablet`, `desktop`
3. JS writes the active mode to `html[data-screen]`
4. CSS rules that must match JS behavior use the computed mode result rather than separate breakpoint numbers
5. Existing duplicated global breakpoint logic has been removed or clearly downgraded to component-local refinement
6. `theme.json` and `behavior.json` responsibilities remain separated

## 14. Implementation Priority

When modifying code under this standard, use this decision order:

1. Determine whether the change is a global screen-mode problem or only a local responsive styling problem
2. If it is global and JS-related, define it through `behavior.json`
3. Compute the screen mode once in JS
4. Expose the result through `data-screen` and, where appropriate, CSS variables
5. Keep CSS focused on consuming the computed result, not re-deriving it

## 15. Final Standard

For this project, the required direction is:

- one global breakpoint definition in `behavior.json`
- one JS classification result
- three screen modes only: `phone`, `tablet`, `desktop`
- CSS follows the computed mode through `data-screen` and/or CSS variables
- local exceptions remain local and do not become new global modes

Any implementation that does not satisfy these points should be considered incomplete.
