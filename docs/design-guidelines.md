# Design guidelines

## Purpose and status

These are starter guidelines, not a final visual identity. The palette and layout can be revised after team review.

## Starter visual system

The shared tokens are in `css/style.css`. The current example palette uses deep teal, pale green, warm yellow, white, and muted slate. Confirm contrast for actual text and interactive states before release.

## Layout and components

Use the shared `.container`, page-intro, button, and content-section patterns from `css/components.css`. Put cross-site rules in shared stylesheets and page-only rules in `css/pages/`.

## Typography and imagery

System fonts are used by default. Add fonts only with redistribution permission. Prefer relevant, compressed images; record provenance and license in `docs/references.md`.

## Accessibility

Use semantic headings and landmarks, visible keyboard focus, descriptive link text, labeled form controls, meaningful image alternatives, sufficient contrast, and keyboard-operable controls. Do not communicate meaning by color alone.

## Responsive behavior

Check narrow screens, zoom, touch targets, text wrapping, and navigation keyboard behavior. Shared breakpoints belong in `css/responsive.css`; document any page-specific exception.

## Design review

Record agreed decisions, designs, and changes here. Avoid treating starter colors or examples as approved branding.
