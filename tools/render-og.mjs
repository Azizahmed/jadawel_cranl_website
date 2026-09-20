/**
 * Renders the Jadawel social/OG cover from tools/og-card.html.
 *
 * The card is a real 1200x630 composition built from the approved logo, the
 * bundled font, and the abstract artwork, so the export stays sharp and the
 * Arabic stays correct.
 *
 * Everything is inlined as a data URI and the document is set directly rather
 * than fetched, so this never depends on a web server and cannot silently
 * capture the wrong page. An earlier version navigated to a URL that the
 * deployed tree does not serve and wrote a screenshot of the 404 page over the
 * social preview; the assertions below exist so that cannot happen again.
 *
 * Requires puppeteer-core and a system chromium:
 *   npm install && node tools/render-og.mjs
 */
import puppeteer from "puppeteer-core";
import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "assets/img/og-cover.jpg");

const readText = (p) => readFile(path.join(root, p), "utf8");
const dataUri = async (p, mime) =>
  `data:${mime};base64,${(await readFile(path.join(root, p))).toString("base64")}`;

let html = await readText("tools/og-card.html");

// 1. the brand tokens, inlined
const tokens = await readText("src/css/jadawel-brand.css");
html = html.replace(
  /<link rel="stylesheet" href="[^"]*jadawel-brand\.css" \/>/,
  `<style>\n${tokens}\n</style>`,
);

// 2. the fonts, inlined
for (const [file, mime] of [
  ["NotoSansArabic-arabic.woff2", "font/woff2"],
  ["NotoSansArabic-latin.woff2", "font/woff2"],
]) {
  const uri = await dataUri(`assets/fonts/${file}`, mime);
  html = html.replaceAll(`../assets/fonts/${file}`, uri);
}

// 3. the artwork, inlined
for (const [file, mime] of [
  ["assets/img/sovereignty.jpg", "image/jpeg"],
]) {
  html = html.replaceAll(`../${file}`, await dataUri(file, mime));
}
for (const file of ["assets/logos/jadawel-logo-white-240.png"]) {
  html = html.replaceAll(`../${file}`, await dataUri(file, "image/png"));
}

// Nothing should still point at a relative path.
const leftovers = [...html.matchAll(/src="(\.\.[^"]+)"/g)].map((m) => m[1]);
if (leftovers.length) throw new Error(`unresolved asset references: ${leftovers.join(", ")}`);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM || "/usr/bin/chromium",
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() =>
    Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => null)))),
  );
  await page.evaluate(() => document.fonts.ready);

  // Assert we are rendering the card, not some error page.
  const check = await page.evaluate(() => ({
    headline: document.querySelector("h1")?.textContent.replace(/\s+/g, " ").trim() ?? null,
    logoLoaded: [...document.images].every((i) => i.naturalWidth > 0),
    images: document.images.length,
    box: (() => {
      const b = document.body.getBoundingClientRect();
      return `${Math.round(b.width)}x${Math.round(b.height)}`;
    })(),
  }));
  if (!check.headline || !check.headline.includes("بياناتك بالعربية")) {
    throw new Error(`the card did not render: headline was ${JSON.stringify(check.headline)}`);
  }
  if (!check.logoLoaded) throw new Error("one or more images failed to load");
  if (check.box !== "1200x630") throw new Error(`unexpected card size: ${check.box}`);

  await page.screenshot({ path: target, type: "jpeg", quality: 88 });

  const { size } = await stat(target);
  if (size < 20000) throw new Error(`og-cover.jpg looks empty (${size} bytes)`);
  console.log(`wrote assets/img/og-cover.jpg (${(size / 1024).toFixed(1)} kB, ${check.box})`);
  console.log(`headline: ${check.headline}`);
} finally {
  await browser.close();
}
