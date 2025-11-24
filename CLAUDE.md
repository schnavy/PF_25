# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website for David Wahrenburg, built with Astro 5 using a markdown-based content management system. The site features a two-column layout: left side displays text content (intro, projects list, timeline, contact), right side is reserved for future project imagery/content.

## Development Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

### Content Collections System

The site uses Astro Content Collections with two main collections defined in `src/content/config.ts`:

**Projects Collection** (`src/content/projects/`):
- Each project is a separate markdown file
- Required fields: `title` (string), `year` (number)
- Optional fields: `url` (string, without https://), `hasImages` (boolean), `showImages` (boolean), `tags` (string array), `order` (number)
- Projects auto-sort by year (descending), then by order field (ascending)
- Images embedded in markdown body using standard syntax with automatic optimization
- Note: No `slug` field in schema—Astro auto-generates from filename

**Sections Collection** (`src/content/sections/`):
- Three fixed files: `intro.md`, `timeline.md`, `contact.md`
- Retrieved by exact filename match: `entry.id === 'intro.md'`
- Content rendered as markdown in respective page sections

### Layout Structure

**Left Column** (`#text-container`, 50vw):
- Fixed position, scrollable, contains all text content
- Level-based indentation system via CSS classes (`.level-0`, `.level-1`, `.level-2`)
- Interactive elements: `.has-images` (clickable projects), `.has-link` (external links)
- Imprint toggle functionality

**Right Column** (`#image-container`, 50vw):
- Fixed position, currently placeholder for future image display
- Includes grid overlay (`#grid`) for visual effects
- Contains image wrapper structure ready for project imagery

**Mobile** (< 1000px):
- Right column hidden
- Left column expands to full width
- Image indicators show "available in desktop view" message

### Client-Side JavaScript

**Public Assets** (`public/js/`):
- Scripts loaded with `is:inline` directive (not bundled by Vite)
- `script.js`: Handles imprint toggle, project click events, close button
- `curtain.js`: Grid animation effects for right column
- Both scripts wait for `DOMContentLoaded` before initializing

**Inline Script** (in `index.astro`):
- Uses `define:vars` to pass server-side `projects` data to client
- Creates `activeArray` with project metadata for client-side interactions
- Includes Matomo analytics setup

### Styling System

**CSS Variables** (`public/css/style.css`):
- Light/dark mode support via `prefers-color-scheme`
- Custom properties: `--background-color`, `--text-color`, `--border-color`, `--image-background-color`

**Font Loading**:
- GT-Pressura-Mono-Text (regular and italic) with `font-display: swap`
- Fonts expected in `public/fonts/` directory

**Responsive Breakpoint**: 1000px
- Above: Two-column layout with hover interactions
- Below: Single column, simplified layout

### Asset Organization

```
public/
├── css/style.css          # Main stylesheet
├── fonts/                 # GT-Pressura-Mono-Text font files
├── images/
│   ├── favicon_0.png      # Random favicon selection (0-5)
│   ├── ...favicon_5.png
│   └── load.svg           # Loading animation
└── js/
    ├── script.js          # Main interactions
    └── curtain.js         # Grid effects

src/assets/
└── images/                # Optimized project images
    ├── gruppenbild/       # Per-project subdirectories
    └── [other-projects]/
```

## Key Implementation Details

### Adding New Projects

1. Create markdown file in `src/content/projects/` with kebab-case filename
2. Filename becomes the slug (accessible via `project.slug` not `project.data.slug`)
3. Only `title` and `year` are required; all other fields have defaults
4. Project appears automatically after dev server refresh

### Project Image Workflow

**Storage Location:** `src/assets/images/[project-name]/`

Images are stored in the optimized assets directory for automatic WebP conversion, responsive sizing, and build-time validation. Each project gets its own subdirectory.

**Directory Structure:**
```
src/assets/images/
├── gruppenbild/
│   ├── 01-cover.jpg
│   ├── 02-spread.jpg
│   └── 03-detail.jpg
└── loading-state/
    └── 01-hero.jpg
```

**Markdown Image Syntax:**

Use standard markdown syntax with optional captions in the project body content:

```markdown
---
title: "Project Name"
hasImages: true
showImages: true
year: 2024
---

Project description text here.

![Alt text for accessibility](../../assets/images/project-name/01-cover.jpg "Optional caption displayed below image")

More text and context.

![Another descriptive alt text](../../assets/images/project-name/02-detail.jpg "Another caption")
```

**Key Points:**
- Use standard markdown syntax: `![alt](path "caption")`
- Path is relative from markdown file: `../../assets/images/[project-name]/[filename]`
- Alt text (required) comes first in square brackets
- Caption (optional) comes after path in quotes
- Images automatically optimized to WebP during build
- Images wrapped in `<figure>` tags with captions in `<figcaption>`
- Broken image paths will fail the build (validates references)

**File Naming Convention:**
- Use numbered prefixes for ordering: `01-cover.jpg`, `02-spread.jpg`
- Use descriptive names after number: `03-detail-closeup.jpg`
- Supports: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`

**Plugin Configuration:**
The site uses `rehype-title-figure` plugin (configured in `astro.config.mjs`) to automatically wrap markdown images in semantic HTML:

**Input (Markdown):**
```markdown
![Alt text](image.jpg "Caption text")
```

**Output (HTML):**
```html
<figure>
  <img src="image.jpg" alt="Alt text" title="Caption text">
  <figcaption>Caption text</figcaption>
</figure>
```

**Styling:**
Figure and caption styles are defined in `public/css/style.css`:
- Figures have 2rem vertical margins
- Images are responsive (width: 100%)
- Captions are italicized with reduced opacity

### Content Rendering Pattern

Sections use conditional rendering to handle missing content:
```javascript
const { Content: IntroContent } = intro ? await intro.render() : { Content: null };
{IntroContent && <IntroContent />}
```

### Hover Interactions

Projects with images or links get interactive hover states:
- `.has-images` projects are clickable (show images in future)
- `.has-link` projects contain external links with `↗` indicator
- Both show visual feedback on hover (inverted colors)

### Future Development Notes

- Right column structure ready for project image display
- Click handlers in `script.js` prepared for image gallery functionality
- Project markdown body content available but not yet displayed
- Grid overlay system in place for curtain animation effects

## Astro-Specific Patterns

- Content collections require both `schema` definition and `getCollection()` calls
- Section retrieval uses `.id` which includes file extension: `'intro.md'`
- Project slugs generated from filename, accessed via `project.slug` not `project.data.slug`
- Client scripts in `public/` need `is:inline` directive to bypass Vite bundling
- `define:vars` passes server data to inline scripts as JavaScript variables
