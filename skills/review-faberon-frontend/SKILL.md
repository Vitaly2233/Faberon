---
name: review-faberon-frontend
description: Reviews Faberon frontend changes for correctness, architecture, accessibility, design-system consistency, scope, and verification.
---

# Review Faberon Frontend

Follow `AGENTS.md` and `CONSTITUTION.md`. Inspect the full change, its callers, and affected runtime paths. If colors or tokens are in scope, also follow `skills/minimize-color-palette`.

## Review method

1. Establish the intended behavior and review the diff in its surrounding context.
2. Trace state, callbacks, routing, and data across container and component boundaries.
3. Check architecture, accessibility, responsive behavior, design-token use, dependency choices, and scope.
4. Run the verification required by `AGENTS.md` when the environment permits.
5. Report only actionable findings, ordered by severity, with file and line references.

Each finding must explain the observable risk or violated invariant. Distinguish confirmed defects from uncertainty, and do not report subjective preferences as defects. If there are no findings, say so and note any verification gaps.

## Review checklist

- Behavior is correct across relevant states, including empty, error, loading, and narrow-screen states when applicable.
- Pages coordinate Zustand, routing, navigation, and side effects; presentational children use typed props and callbacks.
- Stores live in `src/store`, own their store types, and do not depend on page UI types.
- Page-owned code remains local; common components have proven cross-feature reuse and a feature-neutral API.
- Dependency direction does not point from common code into pages or across feature internals.
- Semantic tokens remain centralized and MUI does not introduce a competing styling system.
- Forms, focus, keyboard behavior, accessible names, contrast, and responsive layout remain usable.
- No speculative behavior or unjustified dependency was added.
- Required lint and production-build checks pass.
