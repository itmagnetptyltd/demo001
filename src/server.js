import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const DEFAULT_PORT = 4173;
const HOST = "127.0.0.1";

/** Only these files are ever served; every other path is 404. */
const FILES = Object.freeze({
  "/": { file: "index.html", type: "text/html; charset=utf-8" },
  "/index.html": { file: "index.html", type: "text/html; charset=utf-8" },
  "/app.js": { file: "app.js", type: "text/javascript; charset=utf-8" },
  "/calculator.js": {
    file: "calculator.js",
    type: "text/javascript; charset=utf-8",
  },
  "/styles.css": { file: "styles.css", type: "text/css; charset=utf-8" },
});

const SECURITY_HEADERS = Object.freeze({
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
});

const port = Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10);

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", `http://${HOST}`).pathname;
  const entry = Object.hasOwn(FILES, pathname) ? FILES[pathname] : undefined;
  if (request.method !== "GET" || entry === undefined) {
    response.writeHead(404, SECURITY_HEADERS).end();
    return;
  }
  const body = await readFile(new URL(entry.file, import.meta.url));
  response
    .writeHead(200, { ...SECURITY_HEADERS, "Content-Type": entry.type })
    .end(body);
});

server.listen(port, HOST);
