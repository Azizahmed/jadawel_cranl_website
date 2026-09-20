# Jadawel website

A bilingual (Arabic-first) marketing site for **جداول**, built to the approved
Jadawel Visual Identity v1.0. The Arabic content is a rewrite of the material on
`jadawl.site`; the English is an authored parallel, not a back-translation.

**Live on this VPS:** <http://76.13.5.113/> (also <http://srv1278373.hstgr.cloud/>).
nginx serves `/var/www/jadawel` on port 80 and is enabled in the OpenRC `default`
runlevel, so it comes back after a reboot.

To view the site without nginx:

```bash
python3 -m http.server 8899      # then visit http://127.0.0.1:8899/
```

No build step is required to view the site. Everything under the repository root
(`*.html`, `assets/`) is the deliverable and works as static files.

## Deploying on this machine

Alpine 3.22 / OpenRC, no systemd. nginx 1.28 is installed from `apk`:

```bash
apk add nginx && rc-update add nginx default
npm run deploy                                  # or: tools/deploy.sh
SITE_URL=https://jadawl.site npm run deploy      # when a domain is attached
```

`tools/deploy.sh` rebuilds the pages for the target origin, mirrors the static
files into `/var/www/jadawel`, makes them readable by the unprivileged `nginx`
worker, installs the server block from `tools/nginx-jadawel.conf` into
`/etc/nginx/http.d/default.conf`, validates the configuration, and reloads the
service. It refuses to mirror into a system directory.

Serving detail:

- `SITE_URL` is baked into canonical URLs, `og:url`, `og:image` (absolute, as
  scrapers require), `sitemap.xml`, and `robots.txt`
- gzip is on for text, CSS, JS, JSON, XML, and SVG; woff2 and the JPEG artwork are
  already compressed and are excluded
- HTML is sent `Cache-Control: no-cache` so a deploy is visible immediately;
  `/assets/` is `max-age=604800`; the fonts are `font/woff2`
- every location sends `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, and a `Content-Security-Policy` limited to local scripts,
  stylesheets, fonts, and images. A 404 returns the branded `404.html` with a real
  404 status.
- `add_header` is not inherited once a nested block sets its own, so the shared
  headers live in `tools/nginx-jadawel-common.conf` and every location includes it

HTTPS is not configured: Let's Encrypt needs a domain pointed at this host. Once
DNS resolves here, run `apk add certbot certbot-nginx`, issue the certificate, and
the HTTP block can redirect.

## Pages

| File | Content |
| --- | --- |
| `index.html` | Hero with a live product mock, deployment options, pillars, who it fits, impact benchmark, data lifecycle, digital sovereignty, FAQ, closing CTA |
| `templates.html` | Template library, nine ready-to-copy bases with structure previews |
| `releases.html` | Documented release notes for three releases |
| `contact.html` | Walkthrough request form, contact channels, data-location note |
| `404.html` | Branded not-found page, served by nginx with a real 404 status |

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

Five segment photographs, one sovereignty field, and the social cover are new
artwork generated for this project. `image-prompts.txt` records the provider, the
exact prompt, the pixel size, and a SHA-256 prefix for every file.
`assets/img/og-cover.jpg` is hand-composed in `tools/og-card.html` and rendered by
`tools/render-og.mjs` so the Arabic headline and the approved logo stay exact.

The segment photography states **the scale and nature of each entity type** —
a single-room shop, one office floor, a ministry atrium, a corporate atrium with
bridges across several floors, a hospital corridor — rather than showing staged
people. Every frame excludes people, text, logos, plaques, labels, and device
branding. Earlier passes were rejected during review for a third-party logo on a
laptop lid, gibberish whiteboard pseudo-text, and recognisable computer
silhouettes; those files were regenerated and the exclusions are now explicit in
the shared prompt suffix. Review notes are kept in the manifest.

**The table in each segment card is not part of the photograph.** It is real HTML
layered over the lower part of the frame, so the Arabic, the RTL column order, and
the numbers stay correct and crisp at every pixel density.

```bash
tools/generate-images.sh                          # all images, skips existing files
tools/regenerate-image.sh <name> "<prompt>"        # one image, with retries
node tools/render-og.mjs http://127.0.0.1:8899     # social cover from tools/og-card.html
```

Both image scripts read `ZHIPU_API_KEY` from `/root/.config/jcode/zai.env`, which
is specific to this machine. Supply the key another way if you move the project.

## The impact benchmark

The `03 — Impact in numbers` section states a workload-reduction ratio. Those
figures are **third-party outcomes published by Airtable about its own customers**
on `airtable.com`, retrieved September 2026:

| Figure | Claim as published | Customer |
| --- | --- | --- |
| 60% | reduction in creative brief processing time | MGA |
| 70% | faster turnaround time | Publicis Media |
| 5 → 1 | five tools to one system of record | Highspot |
| +10,000 | hours saved after consolidating tooling | Code and Theory |

They are presented as a sector reference and labelled as such in the page copy and
in a source note under the figures, in both languages. They are **not** Jadawel
results, and the page says so. Do not remove that attribution while the section is
in place, and replace the figures with Jadawel's own measurements once they exist.

## Verification

Verified in headless Chromium at 1440, 1024, 900, 768, 390, and 360 px in both
Arabic RTL and English LTR:

- no horizontal overflow at any breakpoint
- no console errors, page errors, failed requests, or 4xx/5xx responses
- the header stays on a single line, and the logo keeps its 120 px minimum width
- the language switch flips `dir`, `lang`, translated content, and title
- both fonts report `loaded`, and Arabic renders with the real Arabic subset
- keyboard focus is visible on every interactive element (3 px blue outline)
- the anchor targets (`#platform`, `#segments`, `#impact`) land clear of the sticky header
- the `Content-Security-Policy` sent by nginx produces no console violations
- the site answers on the public IP, confirmed from outside the machine

Re-run the checks against a local server with:

```bash
python3 -m http.server 8899 &
node tools/build.mjs                       # confirm the committed HTML matches src/
npm install && npm run verify             # overflow, console/network, fonts, language switch
npm run audit                             # WCAG AA contrast, alt text, heading order, focus, clipping
node tools/write-manifest.mjs             # refresh image-prompts.txt after regenerating artwork
```

## Deviations and open items

1. **No HTTPS yet.** The deployment is plain HTTP on port 80. Certificates need a
   domain whose DNS resolves to this host, and there is none; the origin is only
   reachable by IP today.
2. **Thmanyah Sans is not licensed on this host.** The site self-hosts
   **Noto Sans Arabic** (SIL OFL 1.1, licence text in `assets/fonts/OFL.txt`) and
   keeps `"Thmanyah Sans"` first in every font stack, so a licensed install wins
   automatically. Shipping without a licensed Thmanyah Sans is a disclosed
   production exception, not a replacement identity. Every screenshot and
   rendered measurement in this repository was taken in the fallback face.
3. **The logo is raster.** The packaged master is a 1774x887 PNG. It is placed
   within its native dimensions, but true vector output needs the approved
   outlined SVG, AI, or PDF source.
4. **The source site was not scraped.** The rewrite covers the positioning,
   deployment options, lifecycle, sovereignty, FAQ, template, and release
   material. Claims were carried over, not invented or extended.
5. **The impact figures are third-party.** They are Airtable's published customer
   outcomes, used as a sector reference with visible attribution in both languages.
   Substituting Jadawel's own measurements is the obvious next step.
6. **The contact form does not transmit.** It is a static demo: submitting shows
   a status message that points the visitor to `info@jadawl.site`. Wire it to a
   real endpoint before launch.
7. **Not tested:** real screen readers, actual mobile browsers, and printing.
   `prefers-reduced-motion` and `prefers-color-scheme: light` are handled in CSS.

## Brand provenance

`docs/brand/jadawel-visual-identity/` holds the installed brand kit: the editable
source (`source/build_identity.mjs`), the identity guide PDF, the approved logo
files, and the written identity rules used here.
