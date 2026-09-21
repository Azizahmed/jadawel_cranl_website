#!/usr/bin/env node
/**
 * Builds the three legal documents into site pages.
 *
 * The content lives once, in tools/legal/*.mjs, Arabic and English side by side.
 * From it this script writes:
 *
 *   src/pages/privacy.html    Arabic inline, every string carrying its data-i18n key
 *   src/pages/security.html   same shape as every other page in src/pages
 *   src/pages/terms.html
 *   assets/js/i18n-<slug>.js  the dictionary fragment that page loads, Arabic and
 *                             English, so the language switch works on it
 *
 * The site's markup pattern is what makes this work: Arabic is what the static
 * page carries, and site.js swaps textContent per [data-i18n] key when a reader
 * picks English. Both languages therefore have to be in the dictionary, and both
 * are generated from the same source block.
 *
 *   node tools/build-legal.mjs            # writes the pages and the fragments
 *   node tools/build.mjs                  # runs this first, then builds the site
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import privacy from "./legal/privacy.mjs";
import security from "./legal/security.mjs";
import terms from "./legal/terms.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

export const DOCUMENTS = [privacy, security, terms];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;").replace(/\n/g, " ");

/** Strings shared by all three documents, so the generator owns them once. */
const SHARED = {
  contents: { ar: "المحتويات", en: "Contents" },
  contentsAria: { ar: "محتويات الوثيقة", en: "Document contents" },
  updated: { ar: "آخر تحديث", en: "Last updated" },
  version: { ar: "الإصدار", en: "Version" },
  contact: { ar: "للتواصل", en: "Contact" },
  related: { ar: "وثائق مرتبطة", en: "Related documents" },
  relatedNote: {
    ar: "هذه الوثيقة مكمّلة لأخواتها، وتُقرأ معها.",
    en: "This document complements the others and is read with them.",
  },
  backToTop: { ar: "أعلى الصفحة", en: "Back to top" },
};

/** The three documents, as the footer and the related block link them. */
const SIBLINGS = {
  privacy: { href: "privacy.html", label: { ar: "الخصوصية وحماية البيانات", en: "Privacy and data protection" } },
  security: { href: "security.html", label: { ar: "الأمان والامتثال", en: "Security and compliance" } },
  terms: { href: "terms.html", label: { ar: "شروط الاستخدام", en: "Terms of use" } },
};

/**
 * Renders one document into page markup, collecting the dictionary as it goes.
 * Every element that a reader can see carries a key, so nothing is left in one
 * language after a switch.
 */
function renderDocument(doc) {
  const dict = { ar: {}, en: {} };
  const put = (key, pair) => {
    dict.ar[key] = pair.ar;
    dict.en[key] = pair.en;
    return key;
  };
  const key = (suffix) => `${doc.key}.${suffix}`;

  put(key("title"), doc.title);
  put(key("eyebrow"), doc.eyebrow);
  put(key("lede"), doc.lede);
  put(key("updated"), doc.updated);
  put(key("desc"), doc.desc);

  const toc = [];
  const articles = [];

  doc.sections.forEach((section, sIndex) => {
    const n = sIndex + 1;
    const titleKey = put(key(`s${n}.title`), section.title);
    toc.push(
      `              <li><a href="#${doc.slug}-${section.id}" data-i18n="${titleKey}">${esc(section.title.ar)}</a></li>`,
    );

    const body = [];
    section.blocks.forEach((block, bIndex) => {
      const b = bIndex + 1;
      const k = (suffix = "") => key(`s${n}.b${b}${suffix}`);

      if (block.p) {
        body.push(`              <p data-i18n="${put(k(), block.p)}">${esc(block.p.ar)}</p>`);
      } else if (block.h3) {
        body.push(`              <h3 data-i18n="${put(k(), block.h3)}">${esc(block.h3.ar)}</h3>`);
      } else if (block.note) {
        body.push(
          `              <div class="doc-note">\n` +
            `                <p data-i18n="${put(k(), block.note)}">${esc(block.note.ar)}</p>\n` +
            `              </div>`,
        );
      } else if (block.link) {
        body.push(
          `              <p class="doc-more"><a class="btn btn-ghost btn-sm" href="${attr(block.link.href)}" data-i18n="${put(
            k(),
            block.link.label,
          )}">${esc(block.link.label.ar)}</a></p>`,
        );
      } else if (block.ul || block.ol) {
        const items = block.ul || block.ol;
        const tag = block.ul ? "ul" : "ol";
        const rendered = items
          .map(
            (item, iIndex) =>
              `                <li data-i18n="${put(k(`i${iIndex + 1}`), item)}">${esc(item.ar)}</li>`,
          )
          .join("\n");
        body.push(`              <${tag} class="doc-list">\n${rendered}\n              </${tag}>`);
      } else if (block.dl) {
        const rendered = block.dl
          .map((pair, dIndex) => {
            const termKey = put(k(`d${dIndex + 1}t`), pair.t);
            const descKey = put(k(`d${dIndex + 1}d`), pair.d);
            return (
              `                <dt data-i18n="${termKey}">${esc(pair.t.ar)}</dt>\n` +
              `                <dd data-i18n="${descKey}">${esc(pair.d.ar)}</dd>`
            );
          })
          .join("\n");
        body.push(`              <dl class="doc-dl">\n${rendered}\n              </dl>`);
      } else if (block.table) {
        const table = block.table;
        const captionKey = put(k("c"), table.caption);
        const head = table.head
          .map((cell, cIndex) => `<th scope="col" data-i18n="${put(k(`h${cIndex + 1}`), cell)}">${esc(cell.ar)}</th>`)
          .join("");
        const rows = table.rows
          .map((row, rIndex) => {
            const cells = row
              .map((cell, cIndex) => `<td data-i18n="${put(k(`r${rIndex + 1}c${cIndex + 1}`), cell)}">${esc(cell.ar)}</td>`)
              .join("");
            return `                  <tr>${cells}</tr>`;
          })
          .join("\n");
        body.push(
          `              <div class="doc-table-wrap">\n` +
            `                <table class="doc-table">\n` +
            `                  <caption data-i18n="${captionKey}">${esc(table.caption.ar)}</caption>\n` +
            `                  <thead>\n                    <tr>${head}</tr>\n                  </thead>\n` +
            `                  <tbody>\n${rows}\n                  </tbody>\n` +
            `                </table>\n` +
            `              </div>`,
        );
      } else {
        throw new Error(`unknown block in ${doc.slug} s${n} b${b}: ${Object.keys(block)[0]}`);
      }
    });

    articles.push(
      `          <article class="doc-section" id="${doc.slug}-${section.id}">\n` +
        `            <h2 data-i18n="${titleKey}">${esc(section.title.ar)}</h2>\n` +
        `${body.join("\n")}\n` +
        `          </article>`,
    );
  });

  const siblingCards = Object.entries(SIBLINGS)
    .filter(([slug]) => slug !== doc.slug)
    .map(([slug, sibling]) => {
      const labelKey = put(key(`related.${slug}`), sibling.label);
      return (
        `              <li><a href="${sibling.href}" data-i18n="${labelKey}">${esc(sibling.label.ar)}</a></li>`
      );
    })
    .join("\n");

  const relatedKey = put(key("related.note"), SHARED.relatedNote);
  const relatedTitleKey = put(key("related.title"), SHARED.related);

  const html = `      <section class="page-head">
        <div class="shell">
          <p class="section-num" data-i18n="${key("eyebrow")}">${esc(doc.eyebrow.ar)}</p>
          <h1 data-i18n="${key("title")}">${esc(doc.title.ar)}</h1>
          <p class="section-lede" data-i18n="${key("lede")}">${esc(doc.lede.ar)}</p>

          <div class="doc-meta">
            <span><b data-i18n="lg.common.updated">${esc(SHARED.updated.ar)}</b> <span data-i18n="${key("updated")}">${esc(
              doc.updated.ar,
            )}</span></span>
            <span><b data-i18n="lg.common.version">${esc(SHARED.version.ar)}</b> <span>${esc(doc.version)}</span></span>
            <span><b data-i18n="lg.common.contact">${esc(SHARED.contact.ar)}</b> <a href="mailto:info@jadawl.site" dir="ltr">info@jadawl.site</a></span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="shell doc">
          <nav class="doc-toc" aria-label="${attr(SHARED.contentsAria.ar)}" data-i18n-attr="aria-label:lg.common.contentsAria">
            <b data-i18n="lg.common.contents">${esc(SHARED.contents.ar)}</b>
            <ol>
${toc.join("\n")}
            </ol>
            <p class="doc-top"><a href="#main" data-i18n="lg.common.backToTop">${esc(SHARED.backToTop.ar)}</a></p>
          </nav>

          <div class="doc-body">
${articles.join("\n\n")}

            <aside class="doc-related">
              <b data-i18n="${relatedTitleKey}">${esc(SHARED.related.ar)}</b>
              <p data-i18n="${relatedKey}">${esc(SHARED.relatedNote.ar)}</p>
              <ul>
${siblingCards}
              </ul>
            </aside>
          </div>
        </div>
      </section>
`;

  for (const [key2, pair] of Object.entries(SHARED)) {
    dict.ar[`lg.common.${key2}`] = pair.ar;
    dict.en[`lg.common.${key2}`] = pair.en;
  }

  return { html, dict };
}

function renderFragment(dict) {
  return `/* ==========================================================================
   Jadawel — dictionary fragment, generated by tools/build-legal.mjs.
   Do not edit by hand: the text lives in tools/legal/*.mjs.
   Loaded after i18n.js and before site.js, on the document's own page only.
   ========================================================================== */
(function () {
  "use strict";
  var DICT = (window.JADWEL_I18N = window.JADWEL_I18N || {});
  var PACKS = ${JSON.stringify(dict, null, 2)};
  Object.keys(PACKS).forEach(function (lang) {
    DICT[lang] = DICT[lang] || {};
    Object.keys(PACKS[lang]).forEach(function (key) {
      DICT[lang][key] = PACKS[lang][key];
    });
  });
})();
`;
}

export async function buildLegal({ quiet = false } = {}) {
  await mkdir(path.join(root, "src/pages"), { recursive: true });
  await mkdir(path.join(root, "assets/js"), { recursive: true });

  const written = [];
  for (const doc of DOCUMENTS) {
    const { html, dict } = renderDocument(doc);
    await writeFile(path.join(root, `src/pages/${doc.slug}.html`), html, "utf8");
    await writeFile(path.join(root, `assets/js/i18n-${doc.slug}.js`), renderFragment(dict), "utf8");
    written.push({ slug: doc.slug, keys: Object.keys(dict.ar).length, bytes: Buffer.byteLength(html) });
  }

  if (!quiet) {
    for (const file of written) {
      console.log(
        `built src/pages/${file.slug}.html (${(file.bytes / 1024).toFixed(1)} kB, ${file.keys} keys per language)`,
      );
    }
  }
  return written;
}

// Running the file directly builds just the documents.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  await buildLegal();
  const privacy = await readFile(path.join(root, "src/pages/privacy.html"), "utf8");
  console.log(`\nprivacy.html starts:\n${privacy.split("\n").slice(0, 3).join("\n")}`);
}
