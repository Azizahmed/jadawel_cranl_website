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
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Absolute origin used for canonical URLs, the sitemap, and social previews.
 * A deployed site must not ship a relative `og:image`, because scrapers resolve
 * it against their own host. Override per environment:
 *   SITE_URL=https://jadawl.site node tools/build.mjs
 */
const SITE_URL = (process.env.SITE_URL || "http://srv1278373.hstgr.cloud").replace(/\/+$/, "");

const PAGES = [
  { out: "index.html", src: "index.html", nav: "product", path: "/", priority: "1.0" },
  { out: "templates.html", src: "templates.html", nav: "templates", path: "/templates.html", priority: "0.8" },
  { out: "releases.html", src: "releases.html", nav: "releases", path: "/releases.html", priority: "0.6" },
  { out: "contact.html", src: "contact.html", nav: "contact", path: "/contact.html", priority: "0.7" },
  { out: "404.html", src: "404.html", nav: null, path: null, noindex: true, titleKey: "nf.title" },
];

const read = (p) => readFile(path.join(root, p), "utf8");

/** Marks the current page in the header navigation. */
function markCurrent(nav, current) {
  if (!current) return nav;
  return nav.replace(
    new RegExp(`(data-nav="${current}")`, "g"),
    `$1 aria-current="page"`,
  );
}

const [layout, header, footer] = await Promise.all([
  read("src/layout.html"),
  read("src/partials/header.html"),
  read("src/partials/footer.html"),
]);

for (const page of PAGES) {
  const body = await read(path.join("src/pages", page.src));
  const seo = page.noindex
    ? `    <meta name="robots" content="noindex, follow" />`
    : `    <link rel="canonical" href="${SITE_URL}${page.path}" />\n` +
      `    <meta property="og:url" content="${SITE_URL}${page.path}" />`;
  const htmlAttrs = page.titleKey ? ` data-title-key="${page.titleKey}"` : "";
  const html = layout
    .replace("{{HTML_ATTRS}}", htmlAttrs)
    .replaceAll("__SITE_URL__", SITE_URL)
    .replace("{{SEO}}", seo)
    .replace("{{HEADER}}", markCurrent(header, page.nav))
    .replace("{{CONTENT}}", body.trimEnd())
    .replace("{{FOOTER}}", footer.trimEnd());
  await writeFile(path.join(root, page.out), html, "utf8");
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
