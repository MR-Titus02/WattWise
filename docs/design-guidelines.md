# WattWise design guidelines

## Visual identity

WattWise uses a calm, nature-inspired palette and a simple “W” mark. The design is friendly and educational rather than corporate. Core CSS custom properties live in `css/style.css`.

- Primary green: `#168A58`
- Deep green: `#105C3B`
- Light green: `#E9F7EF`
- Warm accent: `#F4C95D`
- Page background: `#F7FAF8`
- Primary text: `#1E293B`
- Muted text: `#5D6B69`
- Borders: `#E2E8E5`

The light theme is the default. Visitors can switch to the optional dark theme from the header; the dark palette and surface treatments are in `css/dark-theme.css`, and the selected theme is saved in browser LocalStorage. The visual overview of both themes and all five pages is [WattWise-design-showcase.pdf](./WattWise-design-showcase.pdf).

The system font stack is intentional: it avoids a network dependency and remains readable if optional external resources are unavailable. The home illustration is inline SVG, so it has no external image or licensing dependency.

## Components and layout

Shared containers, navigation, buttons, form controls, footer, and empty states are in `css/components.css`. Global design tokens, typography, and focus styling are in `css/style.css`; shared breakpoints are in `css/responsive.css`; page-specific styles live in `css/pages/`.

Use whitespace and clear content hierarchy. Cards are reserved for actions and related content, not every paragraph. Keep the header, footer, and primary action consistent across pages.

## Accessibility

Maintain semantic landmarks and heading order, visible focus, labels for controls, descriptive accessible names, keyboard-operable navigation, `aria-live` feedback where useful, and reduced-motion support. Do not rely on color alone to convey meaning. Test at browser zoom and with keyboard-only interaction.

## Responsive behavior

The layout uses CSS Grid and Flexbox, collapsing grids and navigation at narrow widths. Test around 360, 390, 768, 1024, and 1440 CSS pixels; verify that text, controls, chart labels, and cards do not overflow.

## Content, data, and assets

The page content is English. Keep copy straightforward and suitable for local household contexts. Appliance values are illustrative; never describe them as model specifications. Do not claim a tariff, bill amount, or savings percentage without a verified source and effective date. Document any third-party source or asset in `docs/references.md`.
