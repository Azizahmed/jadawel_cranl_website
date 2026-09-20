# Jadawel website

A bilingual (Arabic-first) marketing site for **جداول**, built to the approved
Jadawel Visual Identity v1.0. The Arabic content is a rewrite of the material on
`jadawl.site`; the English is an authored parallel, not a back-translation.

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8899      # then visit http://127.0.0.1:8899/
```

No build step is required to view the site. Everything under the repository root
(`*.html`, `assets/`) is the deliverable and works as static files.

## Pages

| File | Content |
| --- | --- |
| `index.html` | Hero with a live product mock, deployment options, pillars, who it fits, data lifecycle, digital sovereignty, FAQ, closing CTA |
| `templates.html` | Template library, nine ready-to-copy bases with structure previews |
| `releases.html` | Documented release notes for three releases |
| `contact.html` | Walkthrough request form, contact channels, data-location note |

Navigation collapses to a menu button below **1120 px**, where the language
switch moves inside the opened panel.

## Source layout

The root HTML is generated so the header and footer cannot drift between pages:

```
src/layout.html            document shell (head, direction, asset links)
src/partials/header.html   logo, navigation, language switch, CTAs
src/partials/footer.html   brand block, three link columns, legal row
src/pages/*.html           page bodies, wrapped by the layout
tools/build.mjs            writes src/pages/*.html into the four root pages
```

```bash
node tools/build.mjs        # rebuild the four root pages after editing src/
```

## Bilingual behaviour

Arabic is the default locale and root direction (`lang="ar" dir="rtl"`). The
`ع / EN` switch in the header (and inside the collapsed panel) rewrites text,
`lang`, `dir`, `document.title`, and the meta description. The choice is stored
in `localStorage` and can be forced with `?lang=en`.

Strings live in `assets/js/i18n.js`; markup carries `data-i18n` keys, plus
`data-i18n-attr="attr:key"` for attributes. Latin technical tokens (`TLS 1.3`,
`AES-256`, `CSV`, `PostgreSQL`, `2FA`) sit in `<span class="ltr">` so they stay
isolated and correctly ordered inside RTL prose.

## Brand application

- **Logo.** The packaged master is used unmodified at 120 px width (its identity
  minimum) in the header, and the white reverse version in the footer and on the
  social card. Nothing is traced, recoloured, or given effects.
- **Colour.** Jadawel Ink structures navigation, framing, and the footer; Jadawel
  Blue marks the one active action per view; Cloud and White carry reading
  surfaces; Mint, Amber, and Coral appear only as labelled states.
- **Type.** `Thmanyah Sans` leads every font stack. See *Deviations* below for
  the fallback that is actually shipping.
- **Composition.** The section numbering, the vertical blue bar, and the diamond
  device come from the identity system. The diamond only marks focus; it is never
  used as a logo or an app icon.

## Imagery

Five sector photographs, one sovereignty field, and the social cover are new
artwork generated for this project. `image-prompts.txt` records the provider, the
exact prompt, the pixel size, and a SHA-256 prefix for every file.
`assets/img/og-cover.jpg` is hand-composed in `tools/og-card.html` and rendered by
`tools/render-og.mjs` so the Arabic headline and the approved logo stay exact.

Scope of the photographic direction: credible Saudi work contexts, natural
behaviour, and no clichés, per the identity's imagery rule. Device branding,
pseudo-text, and hand-drawn artifacts were rejected during review and the affected
files were regenerated.

```bash
tools/generate-images.sh                          # all images, skips existing files
tools/regenerate-image.sh <name> "<prompt>"        # one image, with retries
node tools/render-og.mjs http://127.0.0.1:8899     # social cover from tools/og-card.html
```

Both image scripts read `ZHIPU_API_KEY` from `/root/.config/jcode/zai.env`, which
is specific to this machine. Supply the key another way if you move the project.

## Verification

Verified in headless Chromium at 1440, 1024, 900, 768, 390, and 360 px in both
Arabic RTL and English LTR:

- no horizontal overflow at any breakpoint
- no console errors, page errors, failed requests, or 4xx/5xx responses
- the header stays on a single line, and the logo keeps its 120 px minimum width
- the language switch flips `dir`, `lang`, translated content, and title
- both fonts report `loaded`, and Arabic renders with the real Arabic subset
- keyboard focus is visible on every interactive element (3 px blue outline)

Re-run the checks against a local server with:

```bash
python3 -m http.server 8899 &
node tools/build.mjs          # confirm the committed HTML matches src/
```

## Deviations and open items

1. **Thmanyah Sans is not licensed on this host.** The site self-hosts
   **Noto Sans Arabic** (SIL OFL 1.1, licence text in `assets/fonts/OFL.txt`) and
   keeps `"Thmanyah Sans"` first in every font stack, so a licensed install wins
   automatically. Shipping without a licensed Thmanyah Sans is a disclosed
   production exception, not a replacement identity. Every screenshot and
   rendered measurement in this repository was taken in the fallback face.
2. **The logo is raster.** The packaged master is a 1774x887 PNG. It is placed
   within its native dimensions, but true vector output needs the approved
   outlined SVG, AI, or PDF source.
3. **The public site is not scraped.** The rewrite covers the positioning,
   deployment options, lifecycle, sovereignty, FAQ, template, and release
   material. Claims were carried over, not invented or extended.
4. **`og:image` uses a relative URL.** Social scrapers need an absolute URL;
   set it once the production domain is known, in `src/layout.html`.
5. **The contact form does not transmit.** It is a static demo: submitting shows
   a status message that points the visitor to `info@jadawl.site`. Wire it to a
   real endpoint before launch.
6. **Not tested:** real screen readers, actual mobile browsers, and printing.
   `prefers-reduced-motion` and `prefers-color-scheme: light` are handled in CSS.

## Brand provenance

`docs/brand/jadawel-visual-identity/` holds the installed brand kit: the editable
source (`source/build_identity.mjs`), the identity guide PDF, the approved logo
files, and the written identity rules used here.
