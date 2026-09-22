#!/usr/bin/env node
/**
 * Serves the built site from the repository root.
 *
 * This is the second way the site runs. The first is the image in
 * deploy/cranl/Dockerfile, where nginx serves the same files with the same
 * headers; that is what the site image is for. This exists because a host that
 * builds the repository itself — Railpack, which is what CranL reaches for when
 * an app is left on auto-detect — runs `npm run build` and then `npm start`, and
 * with no start script it has nothing to serve.
 *
 * So the rule here is parity with deploy/cranl/nginx.conf: the same legacy
 * redirects, the same security headers, the same cache lifetimes, the same
 * branded 404 with a real 404 status. If you change one, change the other.
 *
 * No dependencies: Node's own http, fs, path and zlib.
 *
 *   npm run build && PORT=8080 npm start
 */
import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";

/** The previous site's URLs, exactly as the nginx server block redirects them. */
const REDIRECTS = new Map([
  ["/privacy", "/privacy.html"],
  ["/terms", "/terms.html"],
  ["/security", "/security.html"],
  ["/templates", "/templates.html"],
  ["/releases", "/releases.html"],
  ["/contact", "/contact.html"],
  ["/docs", "/security.html"],
  ["/docs/", "/security.html"],
  ["/technical-details", "/security.html"],
  ["/pricing", "/#faq"],
  ["/en", "/?lang=en"],
  ["/sitemap-index.xml", "/sitemap.xml"],
]);

const HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; " +
    "font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'",
};

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

/** Only text is worth compressing; the fonts and artwork are already packed. */
const compressible = (type) => /^(text\/|application\/(javascript|json|xml))/.test(type);

function cacheControl(pathname) {
  if (pathname.startsWith("/assets/")) return "public, max-age=604800";
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return "public, max-age=3600";
  return "no-cache";
}

/** Resolves a URL path to a file inside ROOT, refusing anything that escapes it. */
async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const target = path.resolve(ROOT, "." + decoded);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null;

  for (const candidate of [target, path.join(target, "index.html")]) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) return { file: candidate, stat };
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

function send(req, res, status, headers, body) {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(body ?? "");
  const wantsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  const type = headers["Content-Type"] || "";
  const gz = wantsGzip && compressible(type) && payload.length > 512;

  res.writeHead(status, {
    ...headers,
    ...(gz ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
    ...(req.method === "HEAD" ? {} : { "Content-Length": gz ? undefined : payload.length }),
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }
  if (gz) {
    const stream = createGzip();
    stream.pipe(res);
    stream.end(payload);
    return;
  }
  res.end(payload);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(req, res, 405, { ...HEADERS, "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" }, "Method Not Allowed\n");
    return;
  }

  const redirect = REDIRECTS.get(pathname) ?? REDIRECTS.get(pathname.replace(/\/+$/, ""));
  if (redirect) {
    send(req, res, 301, { ...HEADERS, Location: redirect, "Content-Type": "text/plain; charset=utf-8" }, `Moved to ${redirect}\n`);
    return;
  }

  const found = await resolveFile(pathname);
  if (!found) {
    const notFound = await resolveFile("/404.html");
    if (!notFound) {
      send(req, res, 404, { ...HEADERS, "Content-Type": "text/plain; charset=utf-8" }, "Not Found\n");
      return;
    }
    const body = await fs.readFile(notFound.file);
    send(req, res, 404, { ...HEADERS, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }, body);
    return;
  }

  const type = TYPES[path.extname(found.file).toLowerCase()] || "application/octet-stream";
  const headers = {
    ...HEADERS,
    "Content-Type": type,
    "Cache-Control": cacheControl(pathname),
    "Last-Modified": new Date(found.stat.mtimeMs).toUTCString(),
  };

  if (req.method === "HEAD") {
    send(req, res, 200, headers, Buffer.alloc(0));
    return;
  }

  // Streamed rather than read: the artwork runs to a few hundred kilobytes and
  // there is no reason to hold it in memory for every request.
  const stat = found.stat;
  const wantsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  const gz = wantsGzip && compressible(type) && stat.size > 512;
  res.writeHead(200, {
    ...headers,
    ...(gz ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : { "Content-Length": stat.size }),
  });
  const stream = createReadStream(found.file);
  if (gz) {
    stream.pipe(createGzip()).pipe(res);
  } else {
    stream.pipe(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Jadawel site served from ${ROOT} on http://${HOST}:${PORT}`);
});
