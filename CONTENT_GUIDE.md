# Content Management Guide

This portfolio uses Astro's content collections with markdown files for easy content management.

## Content Structure

```
src/content/
├── sections/          # Single-page sections
│   ├── intro.md       # Introduction text
│   ├── timeline.md    # Timeline entries
│   └── contact.md     # Contact information
└── projects/          # Individual project files
    ├── project-1.md
    ├── project-2.md
    └── ...
```

## Editing Content

### Sections (intro, timeline, contact)

Edit the markdown files in `src/content/sections/`:

**intro.md** - Your introduction paragraph
**timeline.md** - Timeline entries (one per line)
**contact.md** - Contact links

These sections support basic markdown formatting (bold, italic, links).

### Projects

Each project gets its own markdown file in `src/content/projects/`. The filename should be URL-friendly (lowercase, hyphens instead of spaces).

#### Project Frontmatter

```markdown
---
title: "Project Title"          # Required
url: "example.com"              # Optional - external link (without https://)
hasImages: true                 # Set to true if project has images
showImages: true                # Set to false to hide image indicator
tags: ["tag1", "tag2"]          # Optional - project categories
year: 2024                      # Required - project year
slug: "project-slug"            # Required - unique identifier
order: 1                        # Optional - custom sort order (lower = first)
---

Project description goes here (for future use on right side).
```

#### Sorting

Projects are sorted by:
1. Year (descending - newest first)
2. Order field (ascending - lower numbers first)

## Adding New Projects

1. Create a new `.md` file in `src/content/projects/`
2. Add the frontmatter with required fields
3. Save and the project will automatically appear on the site

## Example Project File

```markdown
---
title: "My Amazing Project"
url: "myproject.com"
hasImages: true
showImages: true
tags: ["web development", "design"]
year: 2024
slug: "my-amazing-project"
order: 1
---

Detailed project description will be displayed on the right side in future updates.
```

## Assets

Place your assets in the `public/` directory:

- **Fonts**: `public/fonts/`
- **Images**: `public/images/`
- **Favicons**: `public/images/favicon_0.png` through `favicon_5.png`
- **JavaScript**: `public/js/`
- **CSS**: `public/css/`

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```
