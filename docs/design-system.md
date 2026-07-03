# VoyageAI Design System

This phase establishes the reusable visual and interaction foundation for the entire application. It is intentionally page-agnostic and does not include landing page, dashboard, auth, trip, AI, or business-logic screens.

## Architecture

The system is organized into these layers:

1. `src/lib` contains immutable design tokens and motion presets.
2. `src/theme` owns theme state, theme resolution, and the animated theme switch.
3. `src/components/ui` contains reusable visual primitives and content patterns.
4. `src/components/motion` contains animation wrappers and motion utilities.
5. `src/components/three` contains reusable background and depth components.
6. `src/components/layout` contains composition wrappers for structure and spacing.
7. `src/components/form` contains React Hook Form and Zod integration primitives.
8. `src/components/providers` contains app-wide providers such as the canvas wrapper.
9. `src/icons` centralizes icon exports.

## Token Model

The token system is intentionally semantic rather than page-specific.

- Color tokens cover primary, secondary, accent, success, warning, error, muted, border, glass, and overlay.
- Gradient tokens cover hero, aurora, mesh, and soft surfaces.
- Shadow tokens cover soft, medium, strong, glow, and glass depth.
- Radius tokens cover the full corner scale from subtle to pill.
- Blur and opacity tokens support glassmorphism and depth effects.
- Typography tokens cover display, heading, body, caption, label, and mono styles.
- Motion tokens cover durations, curves, and transition presets.
- Z-index tokens establish stacking order for overlays, popovers, modals, and toasts.

## Theme System

- Light, dark, and system modes are supported.
- The theme switch is animated and persists across sessions.
- The theme is applied to the document root and mirrored to CSS variables.
- Reduced-motion behavior is respected by all motion components that consume Framer Motion or GSAP.

## Component Plan

The design system is built around reusable primitives rather than page templates.

### Base UI

- Buttons, icon buttons, loading buttons
- Cards, glass cards, interactive cards, statistic cards, feature cards, AI cards, destination cards
- Inputs, textarea, OTP input, password input, search input, combobox, select, autocomplete
- Checkbox, radio, switch, slider, calendar
- Popover, dropdown, tooltip, dialog, drawer, sheet
- Accordion, tabs, command palette
- Toast, alert, badge, chip
- Avatar, avatar group
- Skeleton, spinner, progress, circular progress
- Timeline, breadcrumb, pagination, data table
- Empty state, 404 state, error state, loading state
- Section headers, dividers, floating action button

### Motion

- Fade, slide, scale, rotate, reveal, stagger
- Hover, magnetic button, parallax, floating elements
- Smooth page transition wrapper, route transition wrapper
- Scroll reveal, mouse follow, text reveal, counter animation

### 3D and Depth

- Floating orb, gradient blob, particle background, animated grid, glow background
- 3D card wrapper and canvas provider

### Layout

- Navbar, footer, container, grid, section, stack
- Sidebar skeleton, topbar skeleton, page wrapper, dashboard layout wrapper, hero wrapper

## Intended Usage

These components are the only approved building blocks for all future application work:

- Landing page
- Authentication screens
- Dashboard surfaces
- Profile pages
- Trips workflows
- AI chat surfaces
- Future admin, reporting, and support tooling

## Reusability Rules

- No component should encode a page-specific layout.
- Every component must accept composable children or data-driven props.
- Components must expose sensible defaults and className overrides.
- Variants should be handled through props or utility functions, not copied markup.
- Motion components should degrade gracefully when reduced motion is enabled.
- 3D components should lazy-load and remain opt-in.

## Usage Map

- `ThemeProvider` is mounted once in the root layout.
- `ThemeToggle` can be placed in any header or settings menu.
- `CanvasProvider` is used only by 3D surfaces that need WebGL.
- UI primitives are imported from `@/components/ui` or their category file.
- Motion wrappers are imported from `@/components/motion`.
- Layout wrappers are imported from `@/components/layout`.
- Form primitives are imported from `@/components/form`.

## Performance Principles

- Tree-shake by category import paths.
- Lazy-load 3D surfaces.
- Keep animation wrappers small and composable.
- Avoid unnecessary re-renders by keeping token data static.
- Prefer CSS effects for subtle depth and reserve JS animation for actual motion.
