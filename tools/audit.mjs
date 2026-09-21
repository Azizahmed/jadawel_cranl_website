/**
 * Accessibility and layout audit for the Jadawel website.
 * Requires puppeteer-core and a system chromium.
 *   npm install && node tools/audit.mjs http://127.0.0.1:8899
 *  - contrast of key text/background pairs against WCAG AA
 *  - images: alt presence
 *  - heading order
 *  - visible keyboard focus on interactive elements
 *  - clipped text detection (scrollWidth/scrollHeight overflow on text nodes)
 */
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] || "http://127.0.0.1:8899";
const PAGES = [
  "index.html",
  "templates.html",
  "releases.html",
  "privacy.html",
  "security.html",
  "terms.html",
  "contact.html",
  "404.html",
];

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
});

const findings = [];
for (const path of PAGES) {
  for (const lang of ["ar", "en"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.goto(`${BASE}/${path}?lang=${lang}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);

    const result = await page.evaluate(() => {
      const out = { contrast: [], altMissing: [], headings: [], clipped: [] };

      const parse = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(",").map((v) => parseFloat(v));
        return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
      };
      const lum = ({ r, g, b }) => {
        const f = (v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const over = (fg, bg) => ({
        r: fg.r * fg.a + bg.r * (1 - fg.a),
        g: fg.g * fg.a + bg.g * (1 - fg.a),
        b: fg.b * fg.a + bg.b * (1 - fg.a),
        a: 1,
      });
      const bgOf = (el) => {
        let n = el;
        let acc = null;
        while (n) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c && c.a > 0) acc = acc ? over(acc, c) : c;
          if (acc && acc.a >= 1) return acc;
          n = n.parentElement;
        }
        return acc || { r: 255, g: 255, b: 255, a: 1 };
      };
      const ratio = (a, b) => {
        const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
        return (l1 + 0.05) / (l2 + 0.05);
      };

      const targets = [
        ["body copy", "p"],
        ["heading", "h1, h2, h3"],
        ["nav link", ".site-nav a"],
        ["footer text", ".site-footer p, .footer-bottom span, .footer-col a"],
        ["card body", ".card p"],
        ["eyebrow", ".eyebrow"],
        ["token", ".token"],
        ["chip", ".chip"],
        ["form label", ".field label"],
        ["form hint", ".field .hint"],
        ["lede", ".section-lede, .hero-lede"],
      ];
      for (const [label, sel] of targets) {
        for (const el of [...document.querySelectorAll(sel)].slice(0, 40)) {
          const st = getComputedStyle(el);
          if (st.display === "none" || !el.textContent.trim()) continue;
          const fg = parse(st.color);
          if (!fg) continue;
          const eff = fg.a < 1 ? over(fg, bgOf(el.parentElement || el)) : fg;
          const bg = bgOf(el);
          const size = parseFloat(st.fontSize);
          const bold = parseInt(st.fontWeight, 10) >= 700;
          const large = size >= 24 || (size >= 18.66 && bold);
          const need = large ? 3 : 4.5;
          const r = ratio(eff, bg);
          if (r < need) {
            out.contrast.push({ label, sel, sample: el.textContent.trim().slice(0, 28), ratio: +r.toFixed(2), need });
          }
        }
      }

      for (const img of document.querySelectorAll("img")) {
        if (!img.hasAttribute("alt")) out.altMissing.push(img.getAttribute("src"));
      }

      let prev = 0;
      for (const h of document.querySelectorAll("h1, h2, h3, h4")) {
        const lvl = +h.tagName[1];
        if (prev && lvl > prev + 1) out.headings.push(`${h.tagName} after H${prev}: ${h.textContent.trim().slice(0, 30)}`);
        prev = lvl;
      }

      for (const el of document.querySelectorAll("p, h1, h2, h3, span, a, li, td, th, label, summary, button")) {
        const st = getComputedStyle(el);
        if (st.display === "none" || st.overflow === "visible") continue;
        if (st.textOverflow === "ellipsis" || st.overflowX === "auto" || st.overflowX === "scroll") continue;
        if (el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
          out.clipped.push(`${el.tagName.toLowerCase()}.${el.className}`.slice(0, 70));
        }
      }
      out.clipped = [...new Set(out.clipped)].slice(0, 10);
      return out;
    });

    // focus visibility
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const st = getComputedStyle(el);
      return { tag: el.tagName, outline: st.outlineWidth + " " + st.outlineStyle + " " + st.outlineColor };
    });

    for (const c of result.contrast) findings.push(`[contrast ${path}/${lang}] ${c.label} ${c.ratio}:1 (need ${c.need}) "${c.sample}"`);
    for (const a of result.altMissing) findings.push(`[alt ${path}/${lang}] missing alt: ${a}`);
    for (const h of result.headings) findings.push(`[heading ${path}/${lang}] ${h}`);
    for (const cl of result.clipped) findings.push(`[clipped ${path}/${lang}] ${cl}`);
    if (!focus || !/none/.test(focus.outline) === false && focus.outline.startsWith("0px")) {
      findings.push(`[focus ${path}/${lang}] first Tab focus outline: ${JSON.stringify(focus)}`);
    }
    console.log(`${path} ${lang}: ok`);
    await page.close();
  }
}

console.log("\n=== FINDINGS ===");
console.log(findings.length ? findings.join("\n") : "none");
await browser.close();
