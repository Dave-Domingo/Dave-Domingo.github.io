# Style Guide

This is the narrative companion to `css/shared.css`. The CSS is the enforceable
source of truth — if this doc and the CSS ever disagree, the CSS is what's
actually running and should be treated as correct until this doc is updated.
This doc exists for the judgment calls the CSS can't encode on its own: when
to reach for which component, and why the system is shaped the way it is.

## File layout

- `css/tokens.css` — color, type, spacing, radius, motion variables. Every
  page loads this first. Never hardcode a color or spacing value that a token
  already covers.
- `css/base.css` — element resets, `body`/`h1-h3`/`code`/`a` defaults, the
  site header/footer/nav-dropdown, `.container`.
- `css/shared.css` — components used (or reasonably likely to be reused) on
  more than one page. Loads after `base.css`, before the page's own
  stylesheet.
- `css/<page-name>.css` — genuinely page-specific rules only: things that
  exist on exactly one page and aren't a variant of something already shared.

Every page's `<head>` loads all three in that order:

```html
<link rel="stylesheet" href="css/tokens.css?v=N">
<link rel="stylesheet" href="css/base.css?v=N">
<link rel="stylesheet" href="css/shared.css?v=N">
<link rel="stylesheet" href="css/<page-name>.css?v=N">
```

## Before writing new CSS for a page

1. **Check `shared.css` first.** If the thing you're building looks like a
   card, a pill, a labeled section, a fact grid, or a fault/round timeline,
   it probably already exists there.
2. **If it's close but not identical**, prefer a modifier class or an inline
   CSS-variable override (see `.triad-col.c1/.c2/.c3` for the pattern) over
   forking a near-duplicate rule into the page-specific file. A page file
   should not contain a rule that's 90% identical to one already in
   `shared.css`.
3. **If you build something new that a second page later needs too**, move
   it to `shared.css` at that point rather than copying it. This is the rule
   that was being broken before this doc existed — three pages each
   hand-copied `.section`, `.btn-pill`, `.card-grid`, `.triad-grid`, and
   `.timeline` from memory, and the copies drifted (a missing `.section`
   rule on one page, a resized `.glance-card` on another, a hero eyebrow
   quietly rendering at the wrong size). None of that was intentional; it's
   what happens by default when the shared vocabulary only exists as
   memory instead of as a file.
4. **Bump the `?v=` query string** on every stylesheet you actually change,
   shared or page-specific — the site is static-hosted with no build step,
   so a stale cached CSS file is a real, recurring failure mode here.

## Section rhythm

Every page section is `<section class="section">` or
`<section class="section section-tint">`, alternating strictly down the
page. `section-tint` sets the surface color; plain `section` sits on the
page background. This alternation is what gives the page visual rhythm —
a page with two `section-tint`s in a row (or a section missing the
`section` class entirely) reads as visually flat, which is what prompted
this whole cleanup. Always alternate; don't tint two sections in a row.

Standard section anatomy:

```html
<section class="section[ section-tint]">
  <div class="container">
    <div class="section-heading">
      <div class="eyebrow">Section label</div>
      <h2>Section headline</h2>
    </div>
    <!-- content -->
  </div>
</section>
```

The hero (first section on a page) skips `.section-heading` and uses `.hero`
directly — see any existing page for the pattern.

## Component catalog

Everything below lives in `shared.css`. One line each on when to reach for it.

| Component | Use for |
|---|---|
| `.hero` / `.hero h1` (page-specific) / `.status-line` | The above-the-fold executive snapshot. `h1` max-width is the one thing each page sets itself, since headline length varies. |
| `.btn-row` / `.btn-pill-primary` / `.btn-pill-secondary` | Hero call-to-action pairs. Primary = the one action you want taken; secondary = everything else. |
| `.at-a-glance-label` / `.glance-row` / `.glance-card` | 2-3 short, scannable facts right under the hero buttons. |
| `.prose-block` | A single column of body paragraphs, width-capped for readability (`--reading-width`). |
| `.card-grid` / `.decision-card` | Paired condition→outcome or decision→reasoning content, 2-4 items. |
| `.triad-grid` / `.triad-col` (`.c1`/`.c2`/`.c3`) | A genuine three-way split (owned/assisted/verified; AI/deterministic/human; supports/may-not/retains). Don't force a two- or four-way split into this. |
| `.term-list` / `.term-pill` | Small classification or concept tags. Add `button.term-pill` with an `onclick` only if the tag is genuinely interactive (see job-pipeline's expandable definitions) — a static label should never carry a pointer cursor. |
| `.state-badge` | A single evidence-status label (Demonstrated / Self-use / External validation / Estimate). One badge per claim, not decorative. |
| `.bug-story` / `.timeline*` | A sequential fault→repair record — a debugging story, a convergence-round excerpt, anything shaped like "this happened, then this, then this." `is-fail` and `is-final` both just fill the dot; use whichever name matches the semantics of that particular step. |
| `.pill-flow` / `.pill-flow-step` / `.pill-flow-arrow` | A short linear process shown as connected pills. Wraps on desktop; stacks with arrows hidden below 640px, since wrapped pills with orphaned arrows read worse than a clean vertical list. |
| `.limits-block` / `.inspect-links` | The closing "what this doesn't prove yet" + deeper-inspection-links section every case page ends on. |

## Color and evidence-status conventions

- `--accent` is reserved for interactive/evidentiary emphasis: links, primary
  buttons, eyebrows, pill text, evidence-status badges. It is not a general
  decorative color.
- The three category colors (`--cat-resume` / `--cat-coverletter` /
  `--cat-subcard`) exist purely to visually differentiate items in a set of
  three (proof cards, triad columns, connects-actions). They don't carry
  fixed meaning across contexts — card 1 being `--cat-resume`-colored on the
  homepage has no relationship to triad column 1 being the same color on a
  case page. Don't read semantics into which color landed where.
- Evidence-state language (`.state-badge`, the "Results" pattern on the
  Job Pipeline page) should always separate demonstrated fact from estimate
  from aspiration — this is a house rule carried over from the résumé/cover
  letter pipeline's own evidentiary standard, not just a copywriting
  preference.

## Typography

- Display/heading font is Fraunces (serif); body and UI text is Inter
  (sans); inline code/labels use IBM Plex Mono where present. All three are
  declared once in `base.css`'s `@import` — don't add a font import to a
  page-specific file.
- `.eyebrow` (11px, uppercase, accent-colored, `--font-sans`) always
  precedes an `<h2>` (or the hero `<h1>`) inside `.section-heading`. It is
  the one piece of chrome every section on every page shares — if a new
  section doesn't have one, that's a signal something's missing, not that
  this section is an exception.

## Spacing

Spacing values come from the token scale (`--space-1` through `--space-9`) in
`tokens.css` — never a bare pixel value in a component rule. `--space-9` is
the section-level rhythm unit (top/bottom section padding); `--space-3`
through `--space-6` cover most internal component spacing. If a value you
need isn't on the scale, that's worth a second look before reaching for an
arbitrary number.
