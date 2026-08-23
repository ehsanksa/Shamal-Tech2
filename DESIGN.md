---
version: alpha
name: Shamal-design-system
description: Brand design language for Shamal Technologies — a Saudi aerial-intelligence and enterprise-technology company built on logo navy, logo blue, and a cinematic full-viewport marketing system. English surfaces pair Rajdhani at bold (700) weights for display with Inter for UI body; Arabic/RTL surfaces swap the entire stack to Tajawal. Heroes are video or photography with navy overlays; CTAs are logo-blue fills; cards live on near-white surfaces; dark bands invert to navy for stats, leadership, and product gravity.
colors:
  primary: "#0A3254"
  primary-deep: "#082644"
  primary-press: "#072844"
  primary-soft: "#226093"
  primary-bg-subdued: "#E8F1F8"
  brand-dark-900: "#0F1729"
  ink: "#0A3254"
  ink-secondary: "#264C73"
  ink-mute: "#939598"
  on-primary: "#FFFFFF"
  canvas: "#FFFFFF"
  canvas-soft: "#F9FAFB"
  canvas-cool: "#F5F8FA"
  canvas-card: "#FCFCFC"
  hairline: "#E2E4E9"
  hairline-input: "#F1F2F4"
  logo-blue: "#226093"
  logo-blue-hover: "#1E5A8F"
  logo-gray: "#939598"
  success: "#16A249"
  warning: "#F59F0A"
  error: "#EF4444"
  ring: "#226093"
  email-navy: "#003B73"
  email-blue: "#005EB8"
  email-canvas: "#F4F7FB"
  dark-canvas: "#0F1729"
  dark-card: "#121B31"
  dark-primary: "#24598F"
  dark-secondary: "#2685D9"
  dark-ink: "#F8FAFC"
  dark-ink-secondary: "#CDD9E4"
  dark-hairline: "#373D48"
typography:
  display-xxl:
    fontFamily: "Rajdhani, Inter, system-ui, sans-serif"
    fontSize: 96px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1.92px
  display-xl:
    fontFamily: "Rajdhani, Inter, system-ui, sans-serif"
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.72px
  display-lg:
    fontFamily: "Rajdhani, Inter, system-ui, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.56px
  display-md:
    fontFamily: "Rajdhani, Inter, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.4px
  heading-lg:
    fontFamily: "Rajdhani, Inter, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.32px
  heading-md:
    fontFamily: "Rajdhani, Inter, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.24px
  heading-sm:
    fontFamily: "Rajdhani, Inter, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-tabular:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: tnum
  button-lg:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0
  button-md:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  caption:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  eyebrow:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.56px
  micro:
    fontFamily: "Inter, Geist Sans, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.24px
  arabic-display:
    fontFamily: "Tajawal, system-ui, sans-serif"
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: 0
  arabic-body:
    fontFamily: "Tajawal, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: 0
rounded:
  xs: 4px
  sm: 8px
  md: 10px
  lg: 12px
  xl: 16px
  pill: 9999px
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px
  section: 96px
  section-lg: 128px
  section-xl: 160px
components:
  button-primary:
    backgroundColor: "{colors.logo-blue}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.xs}"
    padding: 16px 32px
  button-primary-pressed:
    backgroundColor: "{colors.logo-blue-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.xs}"
    padding: 16px 32px
  button-secondary-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.xs}"
    padding: 16px 32px
  button-on-dark:
    backgroundColor: "{colors.on-primary}"
    textColor: "{colors.primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.xs}"
    padding: 16px 32px
  button-navy:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xs}"
    padding: 8px 16px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    padding: 8px 12px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    padding: 8px 12px
  card-feature-light:
    backgroundColor: "{colors.canvas-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-cta-glass:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-on-dark:
    backgroundColor: "{colors.brand-dark-900}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pill-tag-soft:
    backgroundColor: "{colors.primary-bg-subdued}"
    textColor: "{colors.logo-blue}"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: 6px 16px
  pill-tag-on-hero:
    backgroundColor: "rgba(255,255,255,0.10)"
    textColor: "{colors.on-primary}"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: 6px 16px
  nav-bar-glass:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 0px 24px
  link-on-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.logo-blue}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 0px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-mute}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 24px
  email-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.email-navy}"
    typography: "{typography.heading-md}"
    rounded: "{rounded.lg}"
    padding: 32px 35px
---

## Overview

Shamal Technologies' design language opens with **cinematic scale**. Marketing pages are built as stacked full-viewport bands: a video or photography hero with a navy overlay, a white or cool-off-white feature band, a navy inverted stats or leadership band, then a glass CTA card. Type and product UI sit above imagery; the navy-to-blue gradient (`135deg`, `{colors.logo-blue}` → `{colors.primary}`) is the brand's atmospheric fill when photography is not in play.

The color system has two primary roles. **Logo navy** (`{colors.primary}` — `#0A3254`) is the identity color: wordmark, body text, dark surfaces, and outline buttons. **Logo blue** (`{colors.logo-blue}` — `#226093`) is the action color: filled CTAs, focus rings, badges, and gradient start. Logo gray (`{colors.logo-gray}` — `#939598`) is supporting chrome only. White is the default canvas. The palette is the logo — do not introduce a third chromatic accent.

Typography is bilingual by default. English display uses **Rajdhani** at weight 700 with negative tracking — geometric, condensed, technical. English UI/body uses **Inter**. When `lang="ar"` or `dir="rtl"`, the entire stack swaps to **Tajawal** (weights 200–900), body line-height opens to 1.9, and display line-height opens to 1.45. Bold display is the brand; thin editorial weights are off-brand.

**Key Characteristics:**
- Logo navy `#0A3254` + logo blue `#226093` + logo gray `#939598` + white — the only chromatic set.
- Rajdhani 700 display with `-0.02em` tracking on heroes; Inter for UI; Tajawal for all Arabic.
- Cinematic full-viewport sections (`min-h-screen`) with video/photo heroes and navy overlays.
- Navy → blue `135deg` gradient as the non-photo atmospheric fill.
- Logo-blue filled CTA + navy outline secondary — one filled button per band.
- Glass sticky nav (`bg-background/95` + backdrop blur) with the primary wordmark.
- Pill badges (`{rounded.pill}`) with logo-blue border and `bg-logo-blue/10` fill.
- 12px radius system (`--radius: 0.75rem`) on cards; 4px on compact product controls.
- Tabular figures (`tnum`) on impact stats, prices, and reference numbers.

## Colors

> **Source of truth:** Shamal wordmark (`/logo-primary.svg`, `/logo-white.svg`) and `src/app/(frontend)/globals.css`. Hex values below are the logo-canonical colors; CSS tokens store them as HSL.

### Brand & Accent
- **Navy / Primary** (`{colors.primary}` — `#0A3254`): Logo navy. Body text, dark surfaces, outline CTAs, wordmark. The identity color.
- **Navy Deep** (`{colors.primary-deep}` — `#082644`): Darker navy used as `surface-dark` gradient start.
- **Logo Blue / Secondary** (`{colors.logo-blue}` — `#226093`): Filled CTAs, badges, focus ring, gradient start, interactive hover on navy text. The action color.
- **Logo Blue Hover** (`{colors.logo-blue-hover}` — `#1E5A8F`): Pressed / hover lift of logo blue.
- **Logo Gray** (`{colors.logo-gray}` — `#939598`): Muted chrome, helper text, inactive scroll dots. Never a button fill.
- **Navy Soft Fill** (`{colors.primary-bg-subdued}` — `#E8F1F8`): Pale blue wash for badges, email highlight boxes, and selected chips.
- **Brand Dark 900** (`{colors.brand-dark-900}` — `#0F1729`): Dark-theme canvas and email footer.

### Surface
- **Canvas** (`{colors.canvas}` — `#FFFFFF`): Default page background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#F9FAFB`): `--section-bg-2` — cool off-white feature bands.
- **Canvas Cool** (`{colors.canvas-cool}` — `#F5F8FA`): `--section-bg-3` — slightly bluer section wash.
- **Canvas Card** (`{colors.canvas-card}` — `#FCFCFC`): Card surface (`--card`).
- **Hairline** (`{colors.hairline}` — `#E2E4E9`): 1px borders on cards and tables.
- **Hairline Input** (`{colors.hairline-input}` — `#F1F2F4`): Input fill / quiet chrome.
- **Email Canvas** (`{colors.email-canvas}` — `#F4F7FB`): Transactional email page background.

### Text
- **Ink** (`{colors.ink}` — `#0A3254`): Default body text. Logo navy, never pure black.
- **Ink Secondary** (`{colors.ink-secondary}` — `#264C73`): Secondary copy on white.
- **Ink Mute** (`{colors.ink-mute}` — `#939598`): Captions, footer links, helper text.
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): Text and icons on navy / blue / dark surfaces.

### Semantic
- **Success** (`{colors.success}` — `#16A249`): Confirmations, completed training, live status.
- **Warning** (`{colors.warning}` — `#F59F0A`): Caution, pending review.
- **Error** (`{colors.error}` — `#EF4444`): Destructive actions and form errors. Pair with icon + text — never color alone.

### Email (transactional)
Transactional mail uses a slightly brighter pair for client-inbox contrast, still in the same navy/blue family:
- **Email Navy** (`{colors.email-navy}` — `#003B73`): Header titles and labels.
- **Email Blue** (`{colors.email-blue}` — `#005EB8`): Accent band, reference numbers, 4px header underline.

Do not mix email hexes into the website UI. Website UI stays on `#0A3254` / `#226093`.

### Dark theme
Dark mode lifts navy and blue for contrast on `{colors.dark-canvas}` (`#0F1729`):
- Primary becomes `{colors.dark-primary}` (`#24598F`).
- Secondary / accent becomes `{colors.dark-secondary}` (`#2685D9`).
- Body text becomes `{colors.dark-ink}` (`#F8FAFC`).
Design light and dark together. Do not invert the logo colors.

## Typography

### Font Family

| Role | Family | Weights | Use |
|---|---|---|---|
| Display (EN) | **Rajdhani** | 400, 600, 700 | Heroes, section titles, card titles. Tailwind `font-display`. |
| Body / UI (EN) | **Inter** | 400, 600, 700 | Body, buttons, forms, nav. Fallback **Geist Sans**, then system-ui. |
| Mono | **Geist Mono** | variable | Code, reference IDs when a monospace rhythm is needed. |
| Arabic / RTL | **Tajawal** | 200, 300, 400, 500, 700, 800, 900 | Entire UI when `html[lang="ar"]` or `dir="rtl"`. Replaces Inter, Rajdhani, and Geist. |

Rajdhani is the geometric, slightly condensed display face — it reads as technical and aerial without becoming sci-fi. Inter is the UI workhorse. Tajawal is the Arabic counterpart and must be used for every Arabic string, including mixed EN/AR pages (Arabic runs in Tajawal; Latin runs in Inter/Rajdhani).

When `lang="ar"`:
- `--font-inter`, `--font-rajdhani`, and `--font-geist-sans` all resolve to Tajawal.
- Body line-height becomes **1.9**.
- Heading line-height becomes **1.55**.
- Hero / display line-height becomes **1.45**.
- Do not apply English negative tracking to Arabic display type.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 96px (clamp 48–96) | 700 | 1.1 | -0.02em | Home hero (`.text-hero`) |
| `{typography.display-xl}` | 72px (clamp 40–72) | 700 | 1.15 | -0.01em | Section opener (`.text-display-large`) |
| `{typography.display-lg}` | 56px (clamp 32–56) | 700 | 1.2 | 0 | Interior heroes / `.text-display-medium` |
| `{typography.display-md}` | 40px | 700 | 1.2 | -0.4px | Compact band title |
| `{typography.heading-lg}` | 32px | 700 | 1.25 | -0.32px | Card / subsection title |
| `{typography.heading-md}` | 24px | 600 | 1.3 | -0.24px | Card title (shadcn default) |
| `{typography.heading-sm}` | 20px | 600 | 1.4 | 0 | Mini-section label |
| `{typography.body-lg}` | 18–20px | 400 | 1.7 | 0 | Marketing lead (`.text-body-large`) |
| `{typography.body-md}` | 16px | 400 | 1.6 | 0 | Default UI body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Dense UI, form fields |
| `{typography.body-tabular}` | 14px | 500 | 1.4 | 0 | Stats, prices, refs (`tnum`) |
| `{typography.button-lg}` | 16px | 600 | 1.0 | 0 | Marketing CTA (`h-14`) |
| `{typography.button-md}` | 14px | 500 | 1.0 | 0 | Product / admin button |
| `{typography.caption}` | 13px | 400 | 1.5 | 0 | Helper, footer |
| `{typography.eyebrow}` | 14px | 600 | 1.2 | 0.04em | Uppercase kicker on heroes |
| `{typography.micro}` | 12px | 600 | 1.2 | 0.02em | Badge / chip |
| `{typography.arabic-display}` | 72px | 700 | 1.45 | 0 | Arabic hero / section title |
| `{typography.arabic-body}` | 16px | 400 | 1.9 | 0 | Arabic body |

### Principles
- **Bold display is the brand.** Heroes and section titles render Rajdhani at 700. Dropping to 300–400 removes the cinematic gravity.
- **Tight tracking on English display only.** `-0.02em` at hero, `-0.01em` at display-large. Body tracking stays 0. Never tighten Arabic.
- **Navy type, blue action.** Body and headlines are `{colors.ink}`. Logo blue is for CTAs, links, and badges — not long-form text.
- **Tabular figures for numbers.** Impact stats, prices, quotation totals, and form reference numbers use `font-variant-numeric: tabular-nums` (or `tnum`).
- **Tajawal owns Arabic.** If a control, toast, or email is shown in Arabic, it is Tajawal end-to-end. Do not fall back to Inter for Arabic glyphs.
- **One icon family.** Lucide (outline, 1.5–2px stroke). No emoji as UI icons.

### Note on Font Substitutes
Rajdhani, Inter, and Tajawal are available via Google Fonts / `next/font`. If Rajdhani is unavailable, use **Inter** at 700 with `letter-spacing: -0.02em` for display — do not substitute Helvetica, Arial, or system-ui for headlines. If Tajawal is unavailable for Arabic, use **Noto Naskh Arabic** or **IBM Plex Sans Arabic** at matching weights; never render Arabic in a Latin-only face.

## Layout

### Spacing System
- **Base unit**: 8px (with 2 / 4 / 12 sub-tokens for fine work).
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 64px · `{spacing.section}` 96px · `{spacing.section-lg}` 128px · `{spacing.section-xl}` 160px.
- **Section padding**: `.section-flexible` is `py-24 md:py-32 lg:py-40` (96 / 128 / 160px). Full-viewport bands add `py-12 md:py-16` inside `min-h-screen`.
- **Card internal padding**: 24px default (`p-6`); 32px on marketing CTA cards.

### Grid & Container
- Centered container: `sm` 40rem · `md` 48rem · `lg` 64rem · `xl` 80rem · `2xl` 86rem.
- Horizontal padding: 1rem on small screens, 2rem from `md` up.
- Marketing heroes max-width the headline at `max-w-5xl`; body leads at `max-w-3xl`.
- CTA cards max-width `max-w-4xl` and stay centered.

### Whitespace Philosophy
Each marketing band is a full viewport. Content is vertically centered. Gaps between bands are the viewport itself, not a 24px stack. Interior pages (forms, training dashboard, legal) tighten to 32–48px section gaps. Arabic body needs the extra leading — do not compensate by shrinking type.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | Flat | Default canvas |
| 1 | `shadow-sm` | Default card |
| 2 | `0 20px 60px -15px rgba(0,0,0,0.1)` | `.surface-elevated`, featured panels |
| 3 | `shadow-2xl` + `border-2 border-logo-blue/30` + backdrop blur | CTA glass card |
| 4 | Photography / video + navy overlay | Hero depth — the brand's primary depth medium |

### Decorative Depth
Cinematic media IS the depth system. Heroes use full-bleed video or photography with a navy / black overlay and white type. When media is absent, use `.gradient-bg` (`linear-gradient(135deg, logo-blue, logo-navy)`). Literal shadows stay subtle and are reserved for cards floating on white. Scroll reveals use `translateY(3rem)` over 1s `cubic-bezier(0.4, 0, 0.2, 1)` and must respect `prefers-reduced-motion`.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Compact buttons, inputs, default `rounded` |
| `{rounded.sm}` | 8px | Tailwind `rounded-sm` (tokenized), small cards |
| `{rounded.md}` | 10px | Mid controls |
| `{rounded.lg}` | 12px | Cards, marketing panels (`--radius`) |
| `{rounded.xl}` | 16px | Large feature tiles, email shell |
| `{rounded.pill}` | 9999px | Badges, chips, quote-cart bar |

Buttons in product UI are 4px (`rounded`). Marketing CTAs stay 4–8px — this is a technical, not consumer-pill, brand. Badges are the only pill shape.

### Photography Geometry
Prefer **operational photography and product video** (drones, inspection, terrain, control rooms) over stock. Heroes are edge-to-edge, object-cover, with a navy overlay strong enough that white type stays WCAG AA. Client and partner logos sit on white or a dark tile (only when the mark is reverse-out). Do not recolor partner marks.

## Components

### Buttons

**`button-primary`** — the dominant marketing CTA.
- Background `{colors.logo-blue}`, text `{colors.on-primary}`, type `{typography.button-lg}`, height 56px (`h-14`), padding `16px 32px`, rounded `{rounded.xs}`.
- Hover / press `button-primary-pressed` at `{colors.logo-blue-hover}`.
- Trailing Lucide `ArrowRight` (mirrored 180° in RTL).

**`button-secondary-outline`** — secondary action on light.
- Transparent / canvas fill, 2px `{colors.primary}` border, text `{colors.primary}`.
- Hover fills navy and inverts type to white.

**`button-on-dark`** — CTA on video / navy heroes.
- White fill, navy text. Do not place a navy filled button on a navy hero.

**`button-navy`** — compact product / admin primary.
- Background `{colors.primary}`, text white, height 40px, padding `8px 16px`, type `{typography.button-md}`.

### Cards & Containers

**`card-feature-light`** — default explanation card.
- Background `{colors.canvas-card}`, 1px `{colors.hairline}` border, `{rounded.lg}` 12px, Level 1 shadow, padding 24px.

**`card-cta-glass`** — the contact / conversion card.
- `bg-background/95`, backdrop blur, `border-2 border-logo-blue/30`, Level 3 shadow, centered, max-width 56rem. Title uses `.text-gradient` (blue → navy). Badge sits above as `pill-tag-soft`.

**`card-on-dark`** — inverted band (stats, leadership, company profile).
- Background `{colors.brand-dark-900}` or `.surface-dark` (`linear-gradient(135deg, #082644, #0A3254)`), text white, logo-blue used only for labels and links.

### Inputs & Forms

**`text-input`** — standard field.
- Height 40px (44px on mobile), `{rounded.xs}`, 1px `{colors.hairline}` border, `{typography.body-sm}`.
- Focus `text-input-focused`: 2px ring `{colors.ring}` (`#226093`) with offset.
- Visible labels; errors below the field in `{colors.error}` plus helper text. Arabic forms keep Tajawal and 1.9 body leading.

### Navigation

**`nav-bar-glass`** — site header.
- Sticky, `h-16`, `bg-background/95` + backdrop blur, hairline bottom border.
- Primary wordmark (`/logo-primary.svg`) left at 40–48px height. Nav links + language toggle right.
- On dark heroes that show through transparency, keep the primary (navy) mark — do not swap to white unless the bar is fully opaque navy.

### Pills, Tags, and Chips

**`pill-tag-soft`** — section kicker on light.
- `border-logo-blue`, `text-logo-blue`, `bg-logo-blue/10`, padding `6px 16px`, `{rounded.pill}`, `{typography.micro}` / 14px semibold.

**`pill-tag-on-hero`** — kicker on video / photo.
- `bg-white/10`, `border-white/30`, white type, same pill geometry, optional backdrop blur.

### Signature Components

**Cinematic Video Hero** — full-viewport band with looping background video, navy overlay, centered Rajdhani 700 white headline, Inter/Tajawal lead, uppercase eyebrow. The brand's opening statement.

**Navy → Blue Gradient** — `linear-gradient(135deg, #226093, #0A3254)`. Used as `.gradient-bg`, `.text-gradient` (clipped to type), and CTA section atmosphere.

**Impact Stats Row** — large tabular numerals in Rajdhani 700 navy (or white on dark), short Inter/Tajawal labels, animated count-up that respects reduced motion.

**Glass CTA Card** — frosted white card, logo-blue outline, gradient title, primary blue + navy outline button pair.

**Bilingual Language Toggle** — first-class control in the header. Switching to Arabic flips `dir="rtl"`, swaps the font stack to Tajawal, and mirrors trailing icons.

**Primary / White Wordmark** — `/logo-primary.svg` on light; `/logo-white.svg` on navy, photography, and email dark footers. Never recolor, outline, or add a drop shadow to the mark.

**`link-on-light`** — inline / footer hover.
- Text `{colors.logo-blue}` (or navy that hovers to blue). Underline on hover, not by default.

**`footer-light`** — site footer.
- White canvas, navy wordmark, `{colors.ink-mute}` links that hover to logo blue, 64px vertical padding. Dark variant uses `{colors.brand-dark-900}` with the white wordmark.

**`email-header`** — transactional mail.
- White header, primary logo 190px, `{colors.email-navy}` title, 4px `{colors.email-blue}` bottom border, optional blue gradient accent band, slate footer `#0F172A`.

## Do's and Don'ts

### Do
- Use only logo navy, logo blue, logo gray, and white as chromatic color. Semantic green / amber / red are for status only.
- Set display type in Rajdhani 700 (English) or Tajawal 700 (Arabic).
- Put **one** filled logo-blue CTA per band; secondary is navy outline.
- Use `/logo-primary.svg` on light and `/logo-white.svg` on dark / media.
- Apply Tajawal to every Arabic string and open leading to 1.9 / 1.45.
- Use `tnum` on stats, money, and reference numbers.
- Keep heroes cinematic: full viewport, real operations imagery, navy overlay, white type.
- Pair Lucide outline icons with labels; 44×44px minimum hit area on mobile.

### Don't
- Don't introduce indigo, purple, orange, or teal as brand accents — that is a different company.
- Don't set English display at weight 300–400. Thin editorial type is off-brand.
- Don't set long-form body in Rajdhani; it is a display face.
- Don't render Arabic in Inter or Rajdhani.
- Don't use navy as a filled button on a navy / video hero.
- Don't recolor, stretch, or add effects to the wordmark.
- Don't use emoji as icons or as section markers.
- Don't place more than one filled blue button in the same viewport band.
- Don't use email hexes (`#003B73` / `#005EB8`) in the website UI.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Wide | ≥ 1376px (`2xl` 86rem) | Full cinematic bands; display-xxl at 96px |
| Desktop | 1024–1375px | Default container; two-column about / services |
| Tablet | 768–1023px | Display steps down; CTA buttons stack if needed |
| Mobile | < 768px | Single column; hamburger nav; hero type 48px; 44px targets |

### Touch Targets
- Marketing CTAs are 56px tall (`h-14`) — already AAA.
- Product buttons and inputs are 40px; on mobile expand to **44×44px**.
- 8px minimum gap between adjacent targets.

### Collapsing Strategy
- Display stair-steps via `clamp()`: 96 → 72 → 56 → 40px. Do not freeze hero type at 96px on a 375px viewport.
- Full-viewport bands remain `min-h-screen` on mobile but add vertical padding so type never kisses the notch or home indicator.
- Primary + secondary CTAs stack `flex-col` on small screens, `flex-row` from `sm`.
- Language toggle stays in the header at all breakpoints.
- Video heroes may swap to a poster still on small / reduced-data; the navy overlay and type treatment stay.

### Image Behavior
Hero video uses a poster image and lazy-loads below the first fold. Client logo sliders pause on hover and respect reduced motion. Partner marks keep original color; dark-tile only when the file is a reverse mark.

## Logo Usage

| Surface | File | Notes |
|---|---|---|
| Light UI, paper, email header | `/logo-primary.svg` | Navy wordmark. Default. |
| Navy bands, video, photography, email footer | `/logo-white.svg` | Reverse wordmark. |
| Favicon / app icon | `/favicon.svg`, `/apple-touch-icon.png` | Do not substitute a cropped wordmark. |

Clear space: at least the height of the mark on all sides. Minimum digital height: 32px (header uses 40–48px). Do not place the mark on mid-tone photography without a navy or white scrim.

## Motion

- Scroll reveal: 600–1200ms, `power3.out` / `cubic-bezier(0.4, 0, 0.2, 1)`, translateY 3rem → 0.
- Cinematic hero type: 1.2–1.5s fade + rise, staggered 150–200ms.
- Micro-interactions (hover, focus, accordion): 150–300ms.
- Count-up stats: ~2000ms, skipped entirely when `prefers-reduced-motion: reduce`.
- Animate `transform` and `opacity` only. Do not animate width, height, top, or left.

## Iteration Guide

1. Focus on ONE component at a time.
2. Reference tokens directly (`{colors.primary}`, `{colors.logo-blue}`, `{typography.display-xxl}`, `{button-primary}`).
3. Default body to `{typography.body-md}` (16px Inter); use `{typography.display-*}` only for titles; use `{typography.arabic-*}` when `lang="ar"`.
4. Filled CTAs are `{colors.logo-blue}`; identity / text / dark surfaces are `{colors.primary}`.
5. Add new variants as separate entries — do not overload an existing component.
6. After edits, keep light and dark, English and Arabic in sync.
7. The navy/blue logo pair and Rajdhani-bold / Tajawal bilingual stack are non-negotiable. A thin sans on a purple CTA is not Shamal.
