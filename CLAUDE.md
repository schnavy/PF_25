# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interim portfolio website for David Wahrenburg, built with Astro 5. The current implementation is a "curtain" image display - a two-column layout showing images from the project collection, cycling in a fixed order. The site includes a minimal info box with intro and contact information, plus a small per-project info popup revealed by clicking a "?" mark.

**Deployment:** GitHub Pages at `https://schnavy.github.io/PF_25/`

## Development Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Architecture Overview

### Core Concept: Curtain Image Display

The site displays two images side-by-side (desktop) or one image (mobile), drawn from every project's images in a single, fixed, alphabetically-sorted sequence (projects sorted by folder name, images within a project sorted by filename). Only each column's *starting position* in that sequence is randomized per page load - the order itself never changes between loads.

Clicking the **left half** of an image steps backward through the sequence; clicking the **right half** steps forward (hover shows `w-resize`/`e-resize` cursors as a hint). Each column tracks its own position independently.

### Key Technical Decisions

1. **Build-time image loading + optimization**: Images are loaded using `import.meta.glob()` with `eager: true`, then run through `astro:assets` `getImage()` to downscale (capped at 1920px wide) and convert to WebP at build time. This is important - importing the raw asset `.src` directly (the old approach) skips resizing entirely and serves full-resolution originals.
2. **Fixed order, random start**: The flattened image sequence is stable across loads; randomness only picks each column's starting index (see `initCurtain()` in `script.js`).
3. **Preloading for instant switching**: Every `showImage()` call preloads both neighbors (±1) of the newly shown image so the next click is instant. Once the browser is idle (`requestIdleCallback`), the rest of the whole collection is warmed into cache in the background.
4. **Client-side navigation**: After initial load, JavaScript moves each column's index forward/backward through the pre-built array based on click position.
5. **Random colors**: Two shared random colors are picked once per page load - `topBorderColor` (used for the main info box's border and links reuse the general palette) and `dashedBorderColor` (used for all `hr` elements). Both are also reused for the two "?" mark colors (see below).

### File Structure

```
src/
├── pages/
│   └── index.astro           # Single-page site with all logic
├── content/
│   ├── config.ts             # Content collections schema
│   ├── sections/             # Markdown content (intro, timeline, contact)
│   │   ├── intro.md         # Currently displayed
│   │   ├── timeline.md      # Not currently displayed
│   │   └── contact.md       # Not currently displayed
│   └── projects/             # ONE FOLDER PER PROJECT - see below
│       └── <project-slug>/
│           ├── img1.jpg       # any number of images, any of jpg/jpeg/png/webp/gif
│           ├── img2.jpg
│           └── desc.md        # OPTIONAL - title/year/collaborators + description
└── assets/
    └── images/                # legacy/unrelated image folders (harvester, gruppenbild,
                                 # observing-situation) referenced by old, now-deleted
                                 # project write-ups; not used by the current site

public/
├── css/
│   └── style.css            # All styles, organized by section
├── js/
│   └── script.js            # Imprint toggle, mobile info toggle, curtain nav + project-info popup
├── fonts/
│   └── GT-Pressura-Mono-Text (woff/woff2)
└── images/
    └── favicon_*.png        # 6 favicons, randomly selected on each load
```

### Content Collections System

**Sections Collection** (`src/content/sections/`):
- `intro.md` - Currently displayed in the top-left info box
- `timeline.md`, `contact.md` - Defined but not displayed
- Retrieved by exact filename: `entry.id === 'intro.md'`

**Projects Collection** (`src/content/projects/`):
- One subfolder per project, named with a kebab-case slug (e.g. `harvesting-the-crops-of-your-labor/`)
- Each subfolder holds that project's curtain images directly, plus an **optional** `desc.md`
- Schema (`src/content/config.ts`): `title: string`, `year: number`, `collaborators: string[]` (defaults to `[]`)
- `desc.md`'s markdown body becomes the description shown in the "?" popup; frontmatter renders above it as `**title** (year) — with collaborator, collaborator`
- A project with no `desc.md` still shows its images in the curtain, it just never shows a "?" mark
- Entry `id` for a nested file is `<slug>/desc` - project slug is derived client/build-side as `entry.id.split('/')[0]`

### Image Handling

**Curtain Images** (`src/content/projects/<slug>/*.{jpg,jpeg,png,webp,gif}`):
- Globbed at build time, grouped by parent folder (= project slug), both project order and in-project image order sorted alphabetically for a fixed sequence
- Each image is downscaled/converted via `getImage()` (webp, max width 1920, quality 75) - this cut the original curtain payload from ~20MB to ~3MB
- Filename shown in the bottom-left corner comes directly from the source filename (no hash-stripping needed, since Astro's optimized filename hashing is bypassed for display purposes - see `filename` field built in `index.astro`)

**Project Info Popup ("?")**:
- A small box (styled like the main info box: white background, black `border-top`) is centered in each column
- Only visible when the currently-shown image's project has a `desc.md` (checked against `window.describedProjects`, a flat array of slugs with descriptions)
- Clicking it (stops propagation so it doesn't also trigger image navigation) toggles between the "?" mark and the rendered description, copied from a hidden `#project-descriptions [data-project-slug="..."]` template that `index.astro` pre-renders for every described project via the content collection's `entry.render()`
- Left mark colored `topBorderColor`, right mark colored `dashedBorderColor` (see Key Technical Decisions above)

### Client-Side Behavior

**Random Colors** (on page load, `changeColors()` in `index.astro`):
- Each link gets a random color from `linkColors`
- `topBorderColor` and `dashedBorderColor` are each picked once and reused across the main box border, all `hr` borders, and the two "?" marks

**Curtain Navigation** (`initCurtain()` in `public/js/script.js`):
- Each column gets an independent random starting index into the fixed image sequence
- Click position determines direction (left half = previous, right half = next)
- `showImage()` updates the image, filename, and "?" visibility, and preloads both neighbors
- All remaining images are preloaded in the background once the browser is idle

**Mobile Info Toggle**: unchanged - default open, `↑` closes to `Info ↓`, click reopens.

### Styling Architecture

**CSS Organization** (`public/css/style.css`):
1. Fonts (GT-Pressura-Mono-Text)
2. CSS Variables (colors, light/dark mode)
3. Base Styles (resets, typography)
4. Text Container (info box)
5. Image Container (curtain columns) + directional cursors (`.cursor-prev`/`.cursor-next`: `w-resize`/`e-resize`) + `.project-info` popup
6. Grid Overlay (empty, kept for future use)
7. Mobile Styles (< 1000px breakpoint)

### Important Implementation Notes

**Markdown Processing**:
- Uses `rehype-raw` to process HTML inside markdown
- Uses `rehype-title-figure` to wrap images in `<figure>` tags
- `allowDangerousHtml: true` enables HTML in markdown files
- Applies to both `sections` and `projects` collections (including `desc.md` bodies)

**Random Favicon**:
- 6 favicon files (`favicon_0.png` through `favicon_5.png`)
- Randomly selected at build time: `Math.floor(Math.random() * 6)`

**Analytics**:
- Matomo analytics configured in inline script
- Tracker URL: `webstat.davidwahrenburg.de`

**Grid Overlay**:
- `#grid` element exists but has no children
- CSS defines grid structure, kept for future effects

## Adding a Project / Curtain Images

1. Create `src/content/projects/<slug>/`
2. Drop images directly in that folder (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`) - they're auto-optimized to WebP and join the fixed curtain sequence
3. Optionally add `desc.md` with frontmatter:
   ```md
   ---
   title: "Project Title"
   year: 2026
   collaborators: ["Name One", "Name Two"]   # optional, omit for none
   ---

   Description body (markdown).
   ```
   Adding `desc.md` is what makes the "?" popup appear for that project's images.

## Future Restoration

Timeline and contact sections are defined but not displayed; to restore, uncomment/add the relevant markup in `index.astro`.
