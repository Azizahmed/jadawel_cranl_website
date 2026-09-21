/**
 * Prepares the site's raster brand assets from the approved v1.1 master.
 *
 * The v1.1 lockup is the composite: the Arabic wordmark plus the blue
 * five-square grid symbol as one unit, 1654x548. The identity sets a 180 px
 * minimum width in digital use, so a 360 px asset covers a 2x screen exactly.
 * This downscales the supplied artwork; it does not redraw, recolour, re-space,
 * or separate the parts, and the master stays in the repository untouched.
 *
 * The favicon uses the full lockup. The identity states the five-square grid
 * symbol is not approved as a standalone application icon, so it is never
 * extracted on its own.
 *
 * Requires puppeteer-core and a system chromium:
 *   npm install && node tools/optimize-logo.mjs
 * The approved masters are read from the vendored brand kit and embedded as
 * data URIs, so this runs with no web server.
 */
import puppeteer from "puppeteer-core";
import { stat, rm, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KIT = path.join(root, "docs/brand/jadawel-visual-identity/assets/logos");
const OUT = path.join(root, "assets/logos");

// Master geometry, straight from the packaged file.
const MASTER_W = 1654;
const MASTER_H = 548;

// 2x the 135 px the site displays.
const LOGO_WIDTH = 270;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * MASTER_H) / MASTER_W);

const LOGOS = [
  ["jadawel-logo-black-transparent.png", "jadawel-logo-black-270.png"],
  ["jadawel-logo-white-transparent.png", "jadawel-logo-white-270.png"],
];
const FAVICON = { size: 180, markWidth: 150, out: "favicon-180.png" };

/** The approved master, embedded so no server is involved. */
async function master(name) {
  const buf = await readFile(path.join(KIT, name));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM || "/usr/bin/chromium",
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
});

async function shoot(html, width, height, target, minBytes, expectSource) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() =>
      Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => null)))),
    );
    const drawn = await page.evaluate(() => {
      const i = document.images[0];
      return i ? `${i.naturalWidth}x${i.naturalHeight}` : "none";
    });
    if (drawn !== expectSource) throw new Error(`${path.basename(target)}: master is ${drawn}, expected ${expectSource}`);
    await rm(target, { force: true });
    await page.screenshot({ path: target, omitBackground: true, type: "png" });
    const { size } = await stat(target);
    if (size < minBytes) throw new Error(`${path.basename(target)} looks empty: ${size} bytes`);
    console.log(`${path.basename(target)}: ${width}x${height}, ${(size / 1024).toFixed(1)} kB`);
  } finally {
    await page.close();
  }
}

try {
  for (const [src, out] of LOGOS) {
    await shoot(
      `<!doctype html><meta charset="utf-8">
       <style>html,body{margin:0;background:transparent}img{display:block;width:${LOGO_WIDTH}px;height:${LOGO_HEIGHT}px}</style>
       <img src="${await master(src)}" alt="">`,
      LOGO_WIDTH,
      LOGO_HEIGHT,
      path.join(OUT, out),
      800,
      `${MASTER_W}x${MASTER_H}`,
    );
  }

  const s = FAVICON.size;
  await shoot(
    `<!doctype html><meta charset="utf-8">
     <style>html,body{margin:0;background:transparent}
     .tile{width:${s}px;height:${s}px;background:#fff;border-radius:38px;display:grid;place-items:center}
     img{display:block;width:${FAVICON.markWidth}px;height:auto}</style>
     <div class="tile"><img src="${await master("jadawel-logo-black-transparent.png")}" alt=""></div>`,
    s,
    s,
    path.join(OUT, FAVICON.out),
    800,
    `${MASTER_W}x${MASTER_H}`,
  );
} finally {
  await browser.close();
}
