/**
 * Headless verification harness for the Jadawel website.
 * Drives the locally served site with puppeteer-core + the system chromium:
 *  - collects console errors, page errors, and failed requests
 *  - reports horizontal overflow at several widths
 *  - checks the language/direction toggle really flips dir + content
 *  - writes per-section screenshots for visual review
 *
 * Requires puppeteer-core and a system chromium:
 *   npm install && node tools/verify.mjs http://127.0.0.1 ./out
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] || "http://127.0.0.1:8899";
const OUT = process.argv[3] || "./out";
const PAGES = ["index.html", "templates.html", "releases.html", "contact.html"];
const WIDTHS = [1440, 1024, 768, 390];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
});

const problems = [];

async function newPage(width, height = 1000) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      problems.push(`[console.${msg.type()}] ${page.url()} :: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => problems.push(`[pageerror] ${page.url()} :: ${err.message}`));
  page.on("requestfailed", (req) =>
    problems.push(`[requestfailed] ${req.url()} :: ${req.failure()?.errorText}`),
  );
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`[http ${res.status()}] ${res.url()}`);
  });
  return page;
}

const report = [];

for (const path of PAGES) {
  const page = await newPage(1440);
  await page.goto(`${BASE}/${path}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  // --- overflow probe across widths -------------------------------------
  const overflow = {};
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
    await new Promise((r) => setTimeout(r, 350));
    overflow[width] = await page.evaluate(() => {
      const doc = document.documentElement;
      const over = doc.scrollWidth - doc.clientWidth;
      const wide = [];
      if (over > 1) {
        document.querySelectorAll("body *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > doc.clientWidth + 1 || r.left < -1)) {
            wide.push(`${el.tagName.toLowerCase()}.${el.className}`.slice(0, 90));
          }
        });
      }
      return { over, wide: [...new Set(wide)].slice(0, 8) };
    });
  }

  // --- fonts -------------------------------------------------------------
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  const fonts = await page.evaluate(() => {
    const loaded = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`);
    const h1 = document.querySelector("h1");
    return { loaded, h1Family: h1 ? getComputedStyle(h1).fontFamily : null };
  });

  // --- language toggle ---------------------------------------------------
  const beforeDir = await page.evaluate(() => document.documentElement.dir);
  const beforeH1 = await page.evaluate(() => document.querySelector("h1")?.textContent.trim());
  await page.click('.header-actions [data-lang-set="en"]');
  await new Promise((r) => setTimeout(r, 400));
  const after = await page.evaluate(() => ({
    dir: document.documentElement.dir,
    lang: document.documentElement.lang,
    h1: document.querySelector("h1")?.textContent.trim(),
    title: document.title,
  }));

  report.push({ path, overflow, fonts, beforeDir, beforeH1, after });

  // --- screenshots -------------------------------------------------------
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.click('.header-actions [data-lang-set="ar"]');
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(async () => {
    // Walk the page so every IntersectionObserver reveal settles.
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 700));
  // Freeze reveal animations so captures are not caught mid-transition.
  await page.addStyleTag({
    content: ".reveal{opacity:1!important;transform:none!important;transition:none!important}",
  });

  const name = path.replace(".html", "");
  await page.screenshot({ path: `${OUT}/${name}-ar-full.png`, fullPage: true });

  if (path === "index.html") {
    const sectionIds = ["platform", "segments", "impact", "lifecycle", "sovereignty", "faq"];
    await shoot(page, ".hero", `${OUT}/hero-ar.png`);
    for (const id of sectionIds) await shoot(page, `#${id}`, `${OUT}/sec-${id}-ar.png`);
    await shoot(page, ".cta-band", `${OUT}/cta-ar.png`);
    await shoot(page, ".site-footer", `${OUT}/footer-ar.png`);

    // English pass
    await page.click('.header-actions [data-lang-set="en"]');
    await new Promise((r) => setTimeout(r, 500));
    await shoot(page, ".hero", `${OUT}/hero-en.png`);
    await shoot(page, "#sovereignty", `${OUT}/sec-sovereignty-en.png`);
    await shoot(page, "#segments", `${OUT}/sec-segments-en.png`);
    await shoot(page, "#impact", `${OUT}/sec-impact-en.png`);
    await page.click('.header-actions [data-lang-set="ar"]');
  }

  // mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `${OUT}/${name}-mobile-ar.png`, fullPage: true });

  await page.close();
}

async function shoot(page, selector, path) {
  const handle = await page.$(selector);
  if (!handle) throw new Error(`missing selector ${selector}`);
  await page.evaluate((sel) => {
    document.querySelector(sel).scrollIntoView({ block: "start" });
  }, selector);
  await new Promise((r) => setTimeout(r, 400));
  await handle.screenshot({ path });
  console.log(`shot ${path}`);
}

console.log(JSON.stringify(report, null, 2));
console.log("\n=== PROBLEMS ===");
console.log(problems.length ? [...new Set(problems)].join("\n") : "none");

await browser.close();
