#!/usr/bin/env node
/**
 * Jadawel website builder.
 *
 * Renders src/pages/*.html into the site root using src/layout.html, so the
 * header, footer, and asset references stay identical across every page.
 * Output is committed; the built HTML in the root is the deliverable and the
 * files under src/ are the editable source.
 *
 *   node tools/build.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildLegal, DOCUMENTS as LEGAL_DOCUMENTS } from "./build-legal.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Absolute origin used for canonical URLs, the sitemap, and social previews.
 * A deployed site must not ship a relative `og:image`, because scrapers resolve
 * it against their own host.
 *
 * The default is the production host on purpose: a host that builds this
 * repository itself — Railpack on CranL, or a plain `npm run build` — sets no
 * environment, and the pages it produces must still point at jadawl.site rather
 * than at whatever name the builder happens to run under.
 *
 *   SITE_URL=https://jadawel.azoz.cloud node tools/build.mjs   # the staging copy
 */
const SITE_URL = (process.env.SITE_URL || "https://jadawl.site").replace(/\/+$/, "");

/**
 * The legal documents are generated from tools/legal/*.mjs, so their entries are
 * derived from the same source rather than written out again here. Each carries
 * its own static title and description (a crawler reads the HTML, not the
 * dictionary) plus the fragment that holds its other language.
 */
const LEGAL_PAGES = LEGAL_DOCUMENTS.map((doc) => ({
  out: `${doc.slug}.html`,
  src: `${doc.slug}.html`,
  nav: null,
  path: `/${doc.slug}.html`,
  priority: "0.3",
  titleKey: `${doc.key}.title`,
  descKey: `${doc.key}.desc`,
  title: `${doc.title.ar} — جداول`,
  description: doc.desc.ar,
  scripts: [`assets/js/i18n-${doc.slug}.js`],
}));

const PAGES = [
  { out: "index.html", src: "index.html", nav: "product", path: "/", priority: "1.0" },
  { out: "templates.html", src: "templates.html", nav: "templates", path: "/templates.html", priority: "0.8" },
  { out: "releases.html", src: "releases.html", nav: "releases", path: "/releases.html", priority: "0.6" },
  ...LEGAL_PAGES,
  { out: "contact.html", src: "contact.html", nav: "contact", path: "/contact.html", priority: "0.7" },
  { out: "404.html", src: "404.html", nav: null, path: null, noindex: true, titleKey: "nf.title" },
];

/** What a page carries when it names nothing of its own. */
const HOME_TITLE = "جداول — منصّة عربية للبيانات، مستضافة داخل المملكة";
const HOME_DESCRIPTION =
  "جداول منصّة سحابية عربية لإدارة البيانات والعمليات، تجري كل عملياتها داخل المملكة العربية السعودية، مع خيار التركيب المحلي داخل مركز بيانات الجهة.";
const HOME_OG_DESCRIPTION =
  "أدِر بياناتك بالعربية على منصّة مستضافة داخل المملكة، مع خيار التركيب المحلي داخل مركز بيانات الجهة.";

const read = (p) => readFile(path.join(root, p), "utf8");

/** Marks the current page in the header navigation. */
function markCurrent(nav, current) {
  if (!current) return nav;
  return nav.replace(
    new RegExp(`(data-nav="${current}")`, "g"),
    `$1 aria-current="page"`,
  );
}


// --- asset versioning -------------------------------------------------------
// Assets ship with a long max-age, so their URLs must change whenever their
// bytes do. Without this a returning visitor keeps an old stylesheet for a week
// while the HTML revalidates, which renders the page with mismatched CSS. Every
// asset reference is stamped with a short content hash at build time.

const hashCache = new Map();

async function assetVersion(relPath) {
  if (hashCache.has(relPath)) return hashCache.get(relPath);
  let version = null;
  try {
    const bytes = await readFile(path.join(root, relPath));
    version = createHash("sha256").update(bytes).digest("hex").slice(0, 10);
  } catch {
    version = null; // not a local file, leave the reference alone
  }
  hashCache.set(relPath, version);
  return version;
}

/** Stamps every relative assets/... reference with ?v=<content hash>. */
async function stampAssets(html) {
  const refs = new Set();
  for (const m of html.matchAll(/(?:src|href)="(assets\/[^"?#]+)"/g)) refs.add(m[1]);
  for (const m of html.matchAll(/url\((['"]?)(assets\/[^'")?#]+)\1\)/g)) refs.add(m[2]);

  let out = html;
  for (const ref of refs) {
    const version = await assetVersion(ref);
    if (!version) continue;
    out = out.split(`"${ref}"`).join(`"${ref}?v=${version}"`);
    out = out.split(`url("${ref}")`).join(`url("${ref}?v=${version}")`);
    out = out.split(`url('${ref}')`).join(`url('${ref}?v=${version}')`);
    out = out.split(`url(${ref})`).join(`url(${ref}?v=${version})`);
  }
  return out;
}

// --- one stylesheet, with its font URLs versioned ---------------------------
// Concatenating the brand tokens and the site stylesheet removes a round trip
// from the critical path, and rewriting the font URLs here is what lets the
// fonts be cached hard without ever going stale.
async function buildStylesheet() {
  // Sources live under src/css; only the generated bundle is deployed.
  const parts = [];
  for (const name of ["jadawel-brand.css", "jadawel.css"]) {
    parts.push(await readFile(path.join(root, "src/css", name), "utf8"));
  }
  let css = parts.join("\n");

  const fontRefs = new Set();
  for (const m of css.matchAll(/url\((['"]?)(\.\.\/fonts\/[^'")?#]+)\1\)/g)) fontRefs.add(m[2]);
  for (const ref of fontRefs) {
    const version = await assetVersion(path.posix.normalize(path.posix.join("assets/css", ref)));
    if (!version) continue;
    css = css.split(`url("${ref}")`).join(`url("${ref}?v=${version}")`);
    css = css.split(`url('${ref}')`).join(`url('${ref}?v=${version}')`);
    css = css.split(`url(${ref})`).join(`url(${ref}?v=${version})`);
  }

  await writeFile(path.join(root, "assets/css/site.css"), css, "utf8");
  const version = createHash("sha256").update(Buffer.from(css, "utf8")).digest("hex").slice(0, 10);
  console.log(`built assets/css/site.css (${(Buffer.byteLength(css) / 1024).toFixed(1)} kB, v=${version})`);
}

const [layout, header, footer] = await Promise.all([
  read("src/layout.html"),
  read("src/partials/header.html"),
  read("src/partials/footer.html"),
]);

await buildStylesheet();
await buildLegal();

for (const page of PAGES) {
  const body = await read(path.join("src/pages", page.src));
  const seo = page.noindex
    ? `    <meta name="robots" content="noindex, follow" />`
    : `    <link rel="canonical" href="${SITE_URL}${page.path}" />\n` +
      `    <meta property="og:url" content="${SITE_URL}${page.path}" />`;
  const htmlAttrs =
    (page.titleKey ? ` data-title-key="${page.titleKey}"` : "") +
    (page.descKey ? ` data-desc-key="${page.descKey}"` : "");
  const pageScripts = (page.scripts || []).map((src) => `    <script src="${src}"></script>`).join("\n");
  const html = layout
    .replace("{{HTML_ATTRS}}", htmlAttrs)
    .replaceAll("__SITE_URL__", SITE_URL)
    .replaceAll("{{TITLE}}", page.title || HOME_TITLE)
    .replaceAll("{{DESCRIPTION}}", page.description || HOME_DESCRIPTION)
    .replaceAll("{{OG_TITLE}}", page.title || HOME_TITLE)
    .replaceAll("{{OG_DESCRIPTION}}", page.description || HOME_OG_DESCRIPTION)
    .replace("{{SEO}}", seo)
    .replace("{{HEADER}}", markCurrent(header, page.nav))
    .replace("{{CONTENT}}", body.trimEnd())
    .replace("{{FOOTER}}", footer.trimEnd())
    .replace("{{PAGE_SCRIPTS}}", pageScripts);
  await writeFile(path.join(root, page.out), await stampAssets(html), "utf8");
  const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
  console.log(`built ${page.out} (${kb} kB)`);
}

// --- crawler files ---------------------------------------------------------
const indexable = PAGES.filter((page) => page.path);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexable.map(
    (page) =>
      `  <url>\n    <loc>${SITE_URL}${page.path}</loc>\n    <priority>${page.priority}</priority>\n  </url>`,
  ),
  "</urlset>",
  "",
].join("\n");
await writeFile(path.join(root, "sitemap.xml"), sitemap, "utf8");

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /404.html",
  "",
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  "",
].join("\n");
await writeFile(path.join(root, "robots.txt"), robots, "utf8");

console.log(`built sitemap.xml and robots.txt for ${SITE_URL}`);

// --- font coverage guard ---------------------------------------------------
// assets/fonts holds fonts trimmed to the characters the site renders, which is
// what took the page from 197 kB of fonts to 43 kB. That trim is only safe if
// something notices when new copy needs a character the font no longer has, so
// every build checks the pages against the coverage record.
const coverageFile = path.join(root, "assets/fonts/coverage.txt");
let covered = null;
try {
  covered = new Set(
    (await readFile(coverageFile, "utf8"))
      .trim()
      .split(/\s+/)
      .map((hex) => parseInt(hex, 16)),
  );
} catch {
  console.warn("warning: assets/fonts/coverage.txt missing, skipping the font coverage check");
}

const rendered = new Set();
for (const page of PAGES) {
  let text = await readFile(path.join(root, page.out), "utf8");
  text += await readFile(path.join(root, "assets/js/i18n.js"), "utf8");
  // Ignore markup, so tag and attribute names do not count as rendered text.
  text = text
    .replace(/<svg\b[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/url\([^)]*\)/g, " ");
  for (const char of text) rendered.add(char.codePointAt(0));
}

// Whitespace and bidi controls carry meaning but have no glyph of their own.
const noGlyphNeeded = (cp) =>
  (cp >= 0x0000 && cp <= 0x0020) ||
  (cp >= 0x007f && cp <= 0x009f) ||
  (cp >= 0x200b && cp <= 0x2010) ||
  cp === 0xfeff ||
  cp === 0x00ad;

const uncovered = covered
  ? [...rendered].filter((cp) => !noGlyphNeeded(cp) && !covered.has(cp)).sort((a, b) => a - b)
  : [];

if (uncovered.length) {
  console.error(
    `\nfont coverage FAILED: ${uncovered.length} character(s) in the pages are not in the shipped fonts:\n  ` +
      uncovered.map((cp) => `${String.fromCodePoint(cp)} (U+${cp.toString(16).toUpperCase().padStart(4, "0")})`).join(", ") +
      "\nRun: python3 tools/subset-fonts.py",
  );
  process.exit(1);
}
if (covered) console.log(`font coverage ok (${covered.size} codepoints shipped)`);
