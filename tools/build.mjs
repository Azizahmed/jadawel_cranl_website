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

const PAGES = [
  { out: "index.html", src: "index.html", nav: "product" },
  { out: "templates.html", src: "templates.html", nav: "templates" },
  { out: "releases.html", src: "releases.html", nav: "releases" },
  { out: "contact.html", src: "contact.html", nav: "contact" },
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
  const html = layout
    .replace("{{HEADER}}", markCurrent(header, page.nav))
    .replace("{{CONTENT}}", body.trimEnd())
    .replace("{{FOOTER}}", footer.trimEnd());
  await writeFile(path.join(root, page.out), html, "utf8");
  const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
  console.log(`built ${page.out} (${kb} kB)`);
}
