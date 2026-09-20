/**
 * Prepares the site's raster brand assets at the size they are displayed.
 *
 * The packaged master is 1412x628, which is 115 kB for the black wordmark, and
 * it is shown 120 px wide. A 240 px asset covers a 2x screen exactly. This
 * downscales the supplied artwork; it does not redraw, recolour, or re-space
 * it, and the master stays in the repository untouched.
 *
 * The favicon is the approved wordmark on a white tile. The identity states
 * that the diamond is a supporting graphic device and not an approved
 * application icon, so the diamond is deliberately not used as an icon.
 *
 * The approved masters are read from the vendored brand kit and embedded as
 * data URIs, so this runs with no web server and assets/logos stays limited to
 * the files the browser actually downloads.
 *
 * Requires puppeteer-core and a system chromium:
 *   npm install && node tools/optimize-logo.mjs
 */
import puppeteer from "puppeteer-core";
import { stat, rm, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KIT = path.join(root, "docs/brand/jadawel-visual-identity/assets");
const OUT = path.join(root, "assets/logos");

/** The approved master, embedded so no server is involved. */
async function master(name) {
  const buf = await readFile(path.join(KIT, name));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

const LOGO_WIDTH = 240;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 628) / 1412); // the master's ratio

const LOGOS = [
  ["jadawel-logo-black-transparent.png", "jadawel-logo-black-240.png"],
  ["jadawel-logo-white-transparent.png", "jadawel-logo-white-240.png"],
];
const FAVICON = { size: 180, markWidth: 128, out: "favicon-180.png" };

const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM || "/usr/bin/chromium",
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
});

/** Waits for every image to be decoded, not just requested. */
const settle = (page) =>
  page.evaluate(() =>
    Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => null)))),
  );

async function shoot(html, width, height, target, minBytes) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await settle(page);
    const drawn = await page.evaluate(() => {
      const i = document.images[0];
      return i ? `${i.naturalWidth}x${i.naturalHeight}` : "none";
    });
    await rm(target, { force: true });
    await page.screenshot({ path: target, omitBackground: true, type: "png" });
    const { size } = await stat(target);
    if (size < minBytes) throw new Error(`${path.basename(target)} looks empty: ${size} bytes (source ${drawn})`);
    console.log(`${path.basename(target)}: ${width}x${height}, ${(size / 1024).toFixed(1)} kB (from ${drawn})`);
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
  );
} finally {
  await browser.close();
}
