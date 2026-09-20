/**
 * Renders the Jadawel social/OG cover from tools/og-card.html.
 *
 * The card is a real 1200x630 composition built from the approved logo, the
 * bundled fallback font, and the generated abstract artwork, so the export
 * stays sharp and the Arabic stays correct.
 *
 * Uses the system chromium directly, so this script has no npm dependencies.
 * The page must be reachable over HTTP, because a file:// page is not allowed
 * to load the bundled woff2 files.
 *
 *   python3 -m http.server 8899 &
 *   node tools/render-og.mjs [baseUrl]
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.argv[2] || "http://127.0.0.1:8899";
const target = path.join(root, "assets/img/og-cover.jpg");

const chrome = process.env.CHROMIUM || "/usr/bin/chromium";

await run(chrome, [
  "--headless",
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--font-render-hinting=none",
  "--virtual-time-budget=6000",
  "--window-size=1200,630",
  `--screenshot=${target}`,
  `${base}/tools/og-card.html`,
]);

const { size } = await stat(target);
if (size < 20000) throw new Error(`og-cover.jpg looks empty (${size} bytes)`);
console.log(`wrote ${path.relative(root, target)} (${(size / 1024).toFixed(1)} kB, 1200x630)`);
