# Jadawel website

A bilingual (Arabic-first) marketing site for **جداول**, built to the approved
Jadawel Visual Identity **v1.1**. The Arabic content is a rewrite of the material on
`jadawl.site`; the English is an authored parallel, not a back-translation.

**Production:** <https://jadawl.site> — served by CranL from the image this
repository builds (root `Dockerfile`, build type *Dockerfile*), hosted in Saudi
Arabia.

**Staging copy on this VPS:** <https://jadawel.azoz.cloud/> — the same build,
served by nginx from `/var/www/jadawel`. Plain HTTP still answers on
<http://76.13.5.113/> and on any other name pointed here, because the `:80`
block is the default server, and the service is enabled in the OpenRC `default`
runlevel so it comes back after a reboot.

Deploy for the production host name, so canonical URLs, `og:url`, `og:image`,
the sitemap, and `robots.txt` all name it:

```bash
SITE_URL=https://jadawl.site bash tools/deploy.sh
```

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

HTTPS runs on `jadawel.azoz.cloud` with a Let's Encrypt certificate issued and
renewed by `acme.sh` (EC-256, HTTP-01 through `/var/www/acme`), installed at
`/etc/nginx/certs/jadawel.azoz.cloud.{crt,key}` and served by
`tools/nginx-jadawel-tls.conf`. `tools/deploy.sh` installs that vhost only once
the certificate exists, because an `ssl_certificate` pointing at a missing file
stops nginx from starting:

```bash
acme.sh --issue -d jadawel.azoz.cloud --webroot /var/www/acme --keylength ec-256
acme.sh --install-cert -d jadawel.azoz.cloud --ecc \
  --key-file       /etc/nginx/certs/jadawel.azoz.cloud.key \
  --fullchain-file /etc/nginx/certs/jadawel.azoz.cloud.crt \
  --reloadcmd      "rc-service nginx reload"
```

The `:80` default server keeps a `/.well-known/acme-challenge/` location pointed
at `/var/www/acme`. Every certificate on this machine validates through it, so
removing that location does not fail a deploy — it breaks renewal weeks later, on
the next scheduled run. Adding another host name means: point its DNS here, issue
a certificate the same way, add the name to `server_name` in the TLS vhost, and
redeploy.

## Pages

| File | Content |
| --- | --- |
| `index.html` | Hero with a live product mock, who it fits, what the data does, digital sovereignty, deployment options, FAQ, closing band |
| `templates.html` | Template library, nine ready-to-copy bases with structure previews |
| `releases.html` | Documented release notes for three releases |
| `privacy.html` | Privacy and data protection, under the Saudi personal data protection law |
| `security.html` | Security and compliance: controls, national frameworks, shared responsibility |
| `terms.html` | Terms of use, with Saudi law as the governing law |
| `contact.html` | Walkthrough request form, contact channels, data-location note |
| `404.html` | Branded not-found page, served by nginx with a real 404 status |

Navigation collapses to a menu button below **1140 px**, where the language
switch moves inside the opened panel.

## Source layout

The root HTML is generated so the header and footer cannot drift between pages:

```
src/layout.html            document shell (head, direction, asset links)
src/partials/header.html   logo, navigation, language switch, CTAs
src/partials/footer.html   brand block, three link columns, legal row
src/pages/*.html           page bodies, wrapped by the layout
tools/build.mjs            writes src/pages/*.html into the root pages
tools/legal/*.mjs          the three legal documents, Arabic and English together
tools/build-legal.mjs       generates the legal pages and their dictionary
```

```bash
node tools/build.mjs        # rebuild every root page after editing src/ or tools/legal/
node tools/build-legal.mjs  # generate just the legal pages and their fragments
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

## Legal documents

`privacy.html`, `security.html`, and `terms.html` are generated, not hand-written
in `src/pages`. The text lives once in `tools/legal/{privacy,security,terms}.mjs`,
Arabic and English in the same block, and `tools/build-legal.mjs` turns each
document into:

- `src/pages/<slug>.html` — Arabic inline, every visible string carrying a
  `data-i18n` key, wrapped by the layout like any other page
- `assets/js/i18n-<slug>.js` — that page's dictionary fragment, both languages

The page loads its own fragment after `i18n.js` and before `site.js`, so a
document costs one extra request and no reader downloads the other two. Both
languages are generated from the same block, which is what keeps the Arabic page
and the English switch from drifting apart.

Each page carries its own static `<title>` and description, and names the
dictionary keys that replace them at runtime (`data-title-key`, `data-desc-key`),
so a shared link and a crawler both see the document's own title.

The documents are written against the Kingdom's instruments, and each one is
generated from a single file, so an update is one edit and one build:

- `privacy.html` — نظام حماية البيانات الشخصية ولائحته التنفيذية (سدايا)، ولائحة
  تنظيم نقل البيانات الشخصية خارج المملكة
- `security.html` — ECC 2-2024، CCC 2-2024، DCC-1:2022 (الهيئة الوطنية للأمن
  السيبراني)، نظام الأمن السيبراني، والإطار التنظيمي لخدمات الحوسبة السحابية
- `terms.html` — نظام التعاملات الإلكترونية، نظام مكافحة الجرائم المعلوماتية،
  وأنظمة المملكة كقانون واجب التطبيق

Where a number is a commercial choice rather than a legal one (the liability cap,
the 60-day price notice, the 30-day export window, retention periods), it is
stated in the text and can be changed in the source file alone.

## Brand application

- **Logo.** v1.1 replaced the plain wordmark with a composite lockup: the Arabic
  wordmark plus the blue five-square grid symbol as one fixed unit. The header
  and the social card carry the primary black-and-blue version; the footer
  carries the approved white-and-blue reverse for Ink. Nothing is traced,
  recoloured, re-spaced, or separated, and the grid symbol is never extracted on
  its own.
- **Logo size.** Displayed at **135 px**, which is the brand owner's instruction
  and **below the 180 px minimum v1.1 sets for digital use**. See *Deviations*.
- **Colour.** Jadawel Ink structures navigation, framing, and the footer; Jadawel
  Blue marks the one active action per view; Cloud and White carry reading
  surfaces; Mint, Amber, and Coral appear only as labelled states.
- **Type.** `Thmanyah Sans` leads every font stack. See *Deviations* below for
  the fallback that is actually shipping.
- **Colour.** Jadawel Blue moved from `#2563EB` to `#0059FC` in v1.1. That value
  and its tints live in `src/css/jadawel-brand.css`, copied from the packaged
  token file, and every derived tint was recomputed from it.
- **Composition.** The section numbering, the vertical blue bar, and the diamond
  device come from the identity system. The diamond still marks focus only, and
  v1.1 confirms the five-square grid symbol is part of the logo rather than an
  icon shape, so it is not used as a bullet or a standalone mark.

## The platform stage

`02` on the home page is a single composed diagram: the headline over a Saudi
map field, the five segments as cards on either side, connector lines running
into a Jadawel window, the deployment and security strip below, and the promise
wedge in the corner.

Every part of it is HTML, CSS, and inline SVG. There is not one raster image in
the section, which is why it replaced five photographs and made the page lighter
at the same time. One hidden `<svg>` sprite holds the five segment illustrations
and every UI glyph, so each shape is defined once and referenced with `<use>`.

The app window is real markup, so the Arabic, the RTL column order, and the
Western digits stay correct at any density instead of being baked into pixels.
The map is a public-domain [Natural Earth](https://www.naturalearthdata.com/)
outline projected to a flat path, not a traced or invented shape. It is sized
and positioned so that roughly three quarters of the country stays visible above
the product window; at its original size only a third showed and the outline
read as an abstract blob rather than a country.

Rebuild the section after editing its copy:

```bash
python3 tools/build-stage.py     # rewrites the section inside src/pages/index.html
node tools/build.mjs
```

## Performance

Measured on this machine, cold cache, same nginx and the same gzip settings,
previous commit against the current one:

| | Before | After | |
| --- | ---: | ---: | --- |
| Initial load, desktop | 346 kB | **98 kB** | −72% |
| Initial load, mobile | 345 kB | **93 kB** | −73% |
| Whole page after scrolling | 1058 kB | **159 kB** | −85% |
| Requests | 15 | **8** | |
| First contentful paint | 844 ms | **572 ms** | −32% |

What produced it:

- **The five segment photographs are gone from the page.** They were 726 kB and
  used to load on scroll. The composed stage replaced them with markup.
- **Fonts: 197 kB to 43 kB.** `tools/subset-fonts.py` trims the bundled Noto
  Sans Arabic to the 132 characters this site actually renders, keeping the
  variable weight axis and every Arabic shaping feature. The full-width
  originals live in `tools/fonts/` and are never deployed.
- **The header logo: 184 kB master to 12 kB.** It is displayed 135 px wide, so
  `tools/optimize-logo.mjs` renders a 270 px asset for 2x screens. That script
  also builds the favicon from the full lockup, since v1.1 does not approve the
  grid symbol as a standalone application icon.
- **The deployed tree is 389 kB**, down from roughly 3.5 MB. Source material
  (`assets/photography/`, `tools/fonts/`, `docs/`) is excluded by
  `tools/deploy.sh` and stays in the repository.
- **One stylesheet instead of two.** The build concatenates the brand tokens and
  the site stylesheet into `assets/css/site.css`, so the critical path has one
  fewer round trip. Only the generated bundle is deployed; the sources live in
  `src/css/`.

### Asset caching

Assets ship with `Cache-Control: max-age=604800` while the HTML revalidates on
every request. With fixed asset URLs that combination is a bug: a returning
visitor gets fresh markup against a week-old stylesheet, and the page renders
with mismatched CSS.

Every asset reference is therefore stamped with a short content hash at build
time, `assets/css/site.css?v=e1e2963424`, and the font URLs inside the
stylesheet are stamped the same way. Changing an asset changes its URL, so a
deploy can never serve a stale one and the long `max-age` becomes safe. The
`og:image` is deliberately left unversioned because social scrapers cache by
URL and it does not affect rendering.

A trimmed font can silently drop a glyph, so that risk is closed mechanically:
every build re-reads the pages, extracts the characters they render, and fails
with the offending codepoint and the fix if any of them is missing from
`assets/fonts/coverage.txt`.

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

## Deploying on CranL

CranL hosts the site in Saudi Arabia, and it does not run this repository's
build: the pages are built here and committed, so CranL's only job is to serve
them.

- **Repository:** `code92-dev/jadawel_website` (this one)
- **Build type:** `Dockerfile` — the root `Dockerfile` pins the published image
  (`ghcr.io/code92-dev/jadawel_website`) and does nothing else
- **Port:** 80 — CranL injects `PORT=80` for application routing, which is where
  nginx listens
- **Domain:** `jadawl.site` and `www`, fronted by the app's Bunny edge

The site image itself is `deploy/cranl/Dockerfile`: nginx plus the committed
pages, fonts, logos and artwork, with no build step and no external requests at
runtime. `.github/workflows/publish-image.yml` builds it, runs it, checks the
home page, a legacy redirect, an asset and the branded 404, and only then pushes
it — so a broken site is never published. Publish with:

```bash
gh workflow run publish-image.yml -f tag=latest
```

The container's server block is `deploy/cranl/nginx.conf`, the twin of
`tools/nginx-jadawel-site.conf`: compression, cache lifetimes, the security
headers, the branded 404, and the previous site's extensionless URLs
(`/privacy`, `/terms`, `/security`, `/docs`, `/pricing`, `/en`) redirected to
their new homes. Change one file and check the other.

What ships is what is committed, so a deploy is:

```bash
SITE_URL=https://jadawl.site node tools/build.mjs   # rebuild for the production origin
git commit -am "…" && git push                      # the committed HTML is the deliverable
```

then redeploy the app in CranL and purge the Bunny cache, because Bunny keeps
serving the old HTML until it is told not to. Pushing alone changes nothing.

## Verification

Verified in headless Chromium at 1440, 1024, 900, 768, 390, and 360 px in both
Arabic RTL and English LTR:

- no horizontal overflow at any breakpoint
- no console errors, page errors, failed requests, or 4xx/5xx responses
- the header stays on a single line from 1141 px up, and the lockup holds its 135 px size
- the language switch flips `dir`, `lang`, translated content, and title
- both fonts report `loaded`, and Arabic renders with the real Arabic subset
- keyboard focus is visible on every interactive element (3 px blue outline)
- the `Content-Security-Policy` sent by nginx produces no console violations
- the site answers on the public IP, confirmed from outside the machine

Re-run the checks against a local server with:

```bash
python3 -m http.server 8899 &
node tools/build.mjs                       # confirm the committed HTML matches src/
npm install && npm run verify             # overflow, console/network, fonts, language switch
npm run audit                             # WCAG AA contrast, alt text, heading order, focus, clipping
```

## Deviations and open items

1. **The public domain is not this machine.** `jadawl.site` still serves the older
   site (an Astro build published through Bunny/CranL), so this build is verified
   on `https://jadawel.azoz.cloud/` only. Moving to production means pointing that
   domain here, or publishing this build to the host that serves it.
2. **Thmanyah Sans is not licensed on this host.** The site self-hosts
   **Noto Sans Arabic** (SIL OFL 1.1, licence text in `assets/fonts/OFL.txt`) and
   keeps `"Thmanyah Sans"` first in every font stack, so a licensed install wins
   automatically. Shipping without a licensed Thmanyah Sans is a disclosed
   production exception, not a replacement identity. Every screenshot and
   rendered measurement in this repository was taken in the fallback face.
3. **The logo is displayed below the identity minimum.** v1.1 sets a 180 px
   minimum width in digital use; the brand owner asked for the lockup 25% smaller
   than the 180 px it was first set to, which lands at 135 px. At that size the
   five-square grid symbol is about 10 px per cell, still legible but tighter than
   the identity intends. Raising it back is a one-line change in
   `src/css/jadawel.css`.
4. **The logo is raster.** The packaged master is a 1654x548 PNG. It is placed
   within its native dimensions, but true vector output needs the approved
   outlined SVG, AI, or PDF source.
5. **The source site was not scraped.** The rewrite covers the positioning,
   deployment options, lifecycle, sovereignty, FAQ, template, and release
   material. Claims were carried over, not invented or extended.
6. **The contact form does not transmit.** It is a static demo: submitting shows
   a status message that points the visitor to `info@jadawl.site`. Wire it to a
   real endpoint before launch.
7. **The fonts are trimmed to the copy that exists today.** Adding text needs
   `python3 tools/subset-fonts.py` before committing. Forgetting is not silent:
   the build fails and names the missing codepoint.
8. **Not tested:** real screen readers, actual mobile browsers, and printing.
   `prefers-reduced-motion` and `prefers-color-scheme: light` are handled in CSS.

## Brand provenance

`docs/brand/jadawel-visual-identity/` holds the installed **v1.1** brand kit: the
editable source (`source/build_identity.mjs`), the identity guide PDF and PPTX,
the approved logos including the composite lockup, the token files, and the
written identity rules used here. It is excluded from the deploy; the site only
ships `assets/logos/` at the sizes it displays.
