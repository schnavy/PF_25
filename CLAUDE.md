# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interim portfolio website for David Wahrenburg, built with Astro 5. The current implementation is a "curtain" image display - a two-column layout showing random images from a collection. The site includes a minimal info box with intro and contact information.

**Deployment:** GitHub Pages at `https://schnavy.github.io/PF_25/`

## Development Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Architecture Overview

### Core Concept: Random Image Display

The site displays two random images side-by-side (desktop) or one image (mobile) from the curtain collection. Images are shuffled at **build time** and clicking an image swaps it for the next one in the shuffled array.

### Key Technical Decisions

1. **Build-time image loading**: Images are loaded using `import.meta.glob()` with `eager: true` to get Astro's optimized image objects
2. **Static randomization**: Shuffle happens during SSG (Static Site Generation), not runtime
3. **Client-side swapping**: After initial load, JavaScript cycles through the pre-shuffled array
4. **Random colors**: Links, borders, and HR elements get random colors on each page load

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
│   │   └── contact.md       # Not currently displayed (was removed)
│   └── projects/             # Project collection (kept for future use, not displayed)
└── assets/
    └── images/
        └── curtain/          # ADD IMAGES HERE - auto-optimized by Astro

public/
├── css/
│   └── style.css            # All styles, organized by section
├── js/
│   └── script.js            # Imprint toggle, image swapping, mobile info toggle
├── fonts/
│   └── GT-Pressura-Mono-Text (woff/woff2)
└── images/
    └── favicon_*.png        # 6 favicons, randomly selected on each load
```

### Content Collections System

The site uses Astro Content Collections, though most are not currently active:

**Sections Collection** (`src/content/sections/`):
- `intro.md` - Currently displayed in info box
- `timeline.md`, `contact.md` - Defined but not displayed
- Retrieved by exact filename: `entry.id === 'intro.md'`

**Projects Collection** (`src/content/projects/`):
- Schema exists but collection is not displayed
- Kept for future portfolio restoration
- Schema includes: title, year, url, hasImages, tags, order, active

### Image Handling

**Curtain Images** (`src/assets/images/curtain/`):
- Loaded at build time via `import.meta.glob('/src/assets/images/curtain/*.{jpg,jpeg,png,webp,gif}')`
- Automatically optimized to WebP by Astro
- Shuffled server-side, passed to client as array
- Client displays first two, cycles through on click

**Image Display**:
- Desktop: Two 50vw columns, `object-fit: cover`
- Mobile: Single full-width image, second column hidden
- Filename displayed in bottom-left corner (extracted from path, hash removed)

### Client-Side Behavior

**Random Colors** (on page load):
- Each link gets a random color from predefined palette
- Text container border gets random color
- HR elements get random colors
- Colors defined in `index.astro` inline script

**Image Swapping**:
- Click on image column swaps only that image
- Cycles through `curtainImagesArray` (shuffled at build time)
- Updates filename display automatically

**Mobile Info Toggle**:
- Default: Info box open, shows "↑" close button
- Click "↑": Minimizes to "Info ↓"
- Click "Info ↓": Reopens full content
- JavaScript detects click position to determine close vs. open

### Styling Architecture

**CSS Organization** (`public/css/style.css`):
1. Fonts (GT-Pressura-Mono-Text)
2. CSS Variables (colors, light/dark mode)
3. Base Styles (resets, typography)
4. Text Container (info box)
5. Image Container (curtain columns)
6. Grid Overlay (empty, kept for future use)
7. Mobile Styles (< 1000px breakpoint)

**Key Styles**:
- Text container: Fixed position, top-left, white background, black border
- Mobile: Centered horizontally, toggleable with pseudo-elements
- Images: Full column height/width, `object-fit: cover`

### Important Implementation Notes

**Markdown Processing**:
- Uses `rehype-raw` to process HTML inside markdown
- Uses `rehype-title-figure` to wrap images in `<figure>` tags
- `allowDangerousHtml: true` enables HTML in markdown files

**Random Favicon**:
- 6 favicon files (`favicon_0.png` through `favicon_5.png`)
- Randomly selected at build time: `Math.floor(Math.random() * 6)`

**Analytics**:
- Matomo analytics configured in inline script
- Tracker URL: `webstat.davidwahrenburg.de`

**Grid Overlay**:
- `#grid` element exists but has no children
- CSS defines grid structure, kept for future effects

## Adding Curtain Images

1. Place images in `src/assets/images/curtain/`
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
3. Images are automatically:
   - Loaded via `import.meta.glob()`
   - Optimized to WebP during build
   - Shuffled randomly
   - Made available to client

## Future Restoration

The codebase maintains infrastructure for a full portfolio site:
- Project collection schema in `src/content/config.ts`
- Project markdown files still exist in `src/content/projects/`
- Commented-out HTML for project display in `index.astro`
- Timeline and contact sections defined but not displayed

To restore, uncomment the relevant sections in `index.astro` and update which content collections are rendered.
