---
name: minimize-color-palette
description: Keeps Faberon's UI palette small, semantic, and reusable. Use when creating or reviewing colors, design tokens, themes, states, or visual styling.
---

# Minimize Color Palette

Inspect `frontend/src/styles/index.css` and every affected component before changing color behavior.

## Workflow

1. Map each requested color to a semantic role such as brand, surface, text, border, success, or hero treatment.
2. Reuse an existing token when it represents that role.
3. Prefer opacity variants of one token over near-duplicate shades.
4. Add a token only for a distinct, reusable semantic role; define it in the global Tailwind theme.
5. Use the same token for the same role throughout the application and keep MUI aligned with Tailwind.

Do not add color literals, arbitrary Tailwind colors, component-local palette values, or a separate MUI palette. When reviewing, report duplicate, near-duplicate, hardcoded, and one-off colors with the existing semantic replacement when available.

## Acceptance criteria

- Product colors are defined centrally.
- Components contain semantic color utilities rather than color literals.
- Each token has one clear role and meaningful reuse.
- Changing a token updates that role consistently across the application.
