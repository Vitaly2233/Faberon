---
name: minimize-color-palette
description: Keeps the Faberon UI palette deliberately small and reusable. Use when creating or reviewing components, design tokens, themes, colors, states, or visual styling in this repository.
---

# Minimize Color Palette

Keep the app palette as small and reusable as possible so global color changes remain straightforward.

Enter `frontend` before running application or package commands. Never run package-manager commands from the repository root. Keep package-manager caches outside the repository.

## Instructions

1. Inspect `src/styles/index.css` before introducing or changing a color.
2. Reuse an existing semantic Tailwind color token whenever it can express the intended role.
3. Do not add color literals, arbitrary Tailwind colors, or component-local palette values in JSX, TSX, or CSS.
4. Add a token only when no existing token can represent a distinct semantic role such as brand, surface, text, border, success, or hero treatment.
5. Prefer one token with opacity variants over several nearly identical shades.
6. Before adding a token, check whether an existing token can be renamed or reused without changing its meaning.
7. Use the same semantic token for the same purpose across every page and component.
8. Keep MUI styling aligned with the Tailwind tokens; do not create a separate MUI palette.
9. When reviewing changes, flag duplicate, near-duplicate, hardcoded, or one-off colors and recommend the existing replacement token.

## Acceptance check

- Every product color is defined centrally in the global Tailwind theme.
- Components contain semantic color utilities rather than color literals.
- Each token has a clear role and is reused wherever that role appears.
- Changing one token updates that color consistently across the application.
