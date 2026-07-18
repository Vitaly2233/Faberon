---
name: minimize-color-palette
description: Keeps Faberon's UI palette small, semantic, and reusable. Use when creating or reviewing colors, design tokens, themes, states, exceptional sizes, or visual styling.
---

# Minimize Color Palette

Inspect `frontend/src/styles/index.css` and every affected component before changing color or exceptional size behavior.

## Workflow

1. Map each requested color or exceptional size to a semantic role such as brand, surface, text, border, overlay, success, page title, or layout measure.
2. Reuse an existing token when it represents that role.
3. Prefer opacity variants of one token over near-duplicate shades.
4. Add a token only for a distinct, reusable semantic role; define it in the global Tailwind theme in `index.css`.
5. Use the same token for the same role throughout the application and keep MUI aligned with Tailwind.
6. Prefer Tailwind's standard spacing, radius, and font-size utilities; reserve custom size tokens for repeated exceptional values.

Do not add color literals, arbitrary Tailwind colors, component-local palette values, or a separate MUI palette. When reviewing, report duplicate, near-duplicate, hardcoded, and one-off colors or sizes with the existing semantic replacement when available.

## Acceptance criteria

- Product colors and exceptional sizes are defined centrally.
- Components contain semantic utilities rather than color or one-off size literals.
- Each token has one clear role and meaningful reuse.
- Changing a token updates that role consistently across the application.
