# Web and product application

Apply these rules to websites, landing pages, dashboards, product UI, email pages, and reusable digital components.

## Tokens and assets

Start from `assets/tokens/jadawel-brand.css` or the JSON equivalent. Copy the required logo file into the product's managed static assets rather than referencing a skill-folder path at runtime. Preserve the original pixel dimensions and transparency.

## Direction and language

- Arabic is the default locale and root direction.
- Set `dir="rtl"` at the document or application root for Arabic and switch to `ltr` for English.
- Use CSS logical properties for spacing and positioning.
- Keep numbers and short technical tokens such as API, URL, CSV, and version strings in isolated left-to-right spans when needed.
- Test the same components in Arabic RTL and English LTR at mobile and desktop widths.

## Interface expression

- Use Jadawel Ink for navigation, framing, primary text, and persistent structure.
- Use Jadawel Blue for the active action, selected item, focus state, or one priority message.
- Use Cloud and White for dense reading and data surfaces.
- Use state colors semantically and pair them with labels or icons.
- Use an 8 px spacing rhythm where it fits the existing product system; keep major sections visibly open.
- Keep cards, tables, and controls restrained. Let information density come from structure, not decoration.

## Logo placement

Use the full logo in the header, authentication surface, primary navigation, footer, or campaign hero as appropriate. Keep the clear-space rule and minimum 120 px width. Provide `alt="جداول"` for meaningful instances and empty alt text only when the same adjacent text already names the brand.

## Accessibility and performance

- Meet WCAG AA contrast for essential text and controls.
- Keep keyboard focus visible; blue may be used for the focus indicator when contrast is sufficient.
- Do not encode status using color alone.
- Use the transparent PNG directly; avoid CSS filters that recolor the logo.
- Size images explicitly, compress non-logo photography, and avoid loading both logo variants when one is sufficient.

## Digital completion criteria

The page or component works at the requested breakpoints, preserves RTL/LTR behavior, contains the correct logo asset, uses brand tokens consistently, has no overflow or clipped Arabic, and passes an actual browser inspection rather than only a source-code review.
