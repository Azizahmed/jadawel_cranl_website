#!/usr/bin/env node
/**
 * Rewrites image-prompts.txt from the prompt table in tools/generate-images.sh,
 * adding the pixel size and a SHA-256 prefix for every file that exists on disk.
 *
 *   node tools/write-manifest.mjs
 */
import { readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = await readFile(path.join(root, "tools/generate-images.sh"), "utf8");

// Read the heredoc table and expand the $NOPEOPLE variable it references.
const noPeople = script.match(/^NOPEOPLE="(.*)"$/m)?.[1] ?? "";
const block = script.split("JOBS=$(cat <<EOF")[1].split("\nEOF")[0].trim();
const jobs = block
  .split("\n")
  .filter((line) => line.includes("|"))
  .map((line) => {
    const [name, size, ...rest] = line.split("|");
    return { name: name.trim(), size: size.trim(), prompt: rest.join("|").replace("$NOPEOPLE", noPeople).trim() };
  });

const REVIEW_NOTES = {
  "sector-medium":
    "Regenerated during review: the first pass showed a whiteboard with gibberish pseudo-text, and the second pass showed recognisable all-in-one computer silhouettes. Both are excluded in the final prompt.",
  "sector-specialized":
    "Regenerated during review: the first pass had small door plaques carrying pseudo-text.",
  "sector-small-business":
    "Two earlier passes showed people, and one showed a laptop with a third-party logo on the lid. The final prompt removes people and devices entirely.",
};

const lines = [
  "# Jadawel website imagery — generation manifest",
  "",
  "Provider: Zhipu CogView-4 (`cogview-4-250304`) through https://api.z.ai/api/paas/v4/images/generations.",
  "Copyright status: model output, generated for this project. Not sourced from stock libraries.",
  "Files are JPEG (the provider returns JPEG even when the URL ends in .png) at the stated pixel size.",
  "",
  "Direction: the segment photographs show the scale and nature of each entity type rather than",
  "people. No people, text, logos, plaques, labels, or device branding appear in any frame. The",
  "table shown in each card is real markup layered over the photograph, not generated pixels, so",
  "the Arabic stays correct and crisp.",
  "",
  "Regenerate everything: `tools/generate-images.sh` (skips files that already exist).",
  "Redo one file: `tools/regenerate-image.sh <name> \"<prompt>\"`.",
  "`assets/img/og-cover.jpg` is not from the model: it is composed in `tools/og-card.html` and",
  "rendered by `tools/render-og.mjs`, using the approved white logo and the sovereignty artwork as",
  "a texture field.",
  "",
];

for (const job of jobs) {
  const file = path.join(root, "assets/img", `${job.name}.jpg`);
  let digest = "MISSING";
  let bytes = 0;
  try {
    const buf = await readFile(file);
    digest = createHash("sha256").update(buf).digest("hex").slice(0, 16);
    bytes = (await stat(file)).size;
  } catch {
    /* file not generated yet */
  }
  lines.push(`## ${job.name}.jpg`);
  lines.push(`- size: ${job.size}`);
  lines.push(`- bytes: ${bytes}`);
  lines.push(`- sha256: ${digest}`);
  if (REVIEW_NOTES[job.name]) lines.push(`- review note: ${REVIEW_NOTES[job.name]}`);
  lines.push(`- prompt: ${job.prompt}`);
  lines.push("");
}

lines.push("## og-cover.jpg");
lines.push("- size: 1200x630");
lines.push("- composed from: assets/logos/jadawel-logo-white-transparent.png, assets/img/sovereignty.jpg (texture field), tools/og-card.html");
lines.push("- rendered by: tools/render-og.mjs (headless chromium, 1x)");
lines.push("- note: hand-composed rather than model-generated, so the Arabic headline and the approved logo stay exact.");
lines.push("");

await writeFile(path.join(root, "image-prompts.txt"), lines.join("\n"), "utf8");
console.log(`wrote image-prompts.txt (${jobs.length} generated files + og-cover)`);
