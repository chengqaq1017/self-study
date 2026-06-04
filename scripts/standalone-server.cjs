const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const publicDir = path.join(root, "public");
const nextStaticDir = path.join(root, ".next", "static");

const externalPort = Number.parseInt(process.env.PORT || "3000", 10);
const internalPort = Number.parseInt(
  process.env.NEXT_INTERNAL_PORT || String(externalPort + 1),
  10,
);
const hostname = process.env.BIND_HOST || "0.0.0.0";

const child = spawn(process.execPath, ["server.js"], {
  cwd: root,
  env: {
    ...process.env,
    PORT: String(internalPort),
    HOSTNAME: "127.0.0.1",
  },
  stdio: "inherit",
});

function contentType(filePath) {
  const ext = path.extname(filePath);
  switch (ext) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

function safeJoin(baseDir, requestPath) {
  const decoded = decodeURIComponent(requestPath);
  const target = path.normalize(path.join(baseDir, decoded));
  if (!target.startsWith(baseDir + path.sep) && target !== baseDir) {
    return null;
  }
  return target;
}

function serveFile(filePath, res, immutable = false) {
  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    res.writeHead(200, {
      "cache-control": immutable
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate",
      "content-length": stats.size,
      "content-type": contentType(filePath),
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function proxyToNext(req, res) {
  const upstream = http.request(
    {
      hostname: "127.0.0.1",
      port: internalPort,
      method: req.method,
      path: req.url,
      headers: req.headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 500, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstream.on("error", () => {
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    res.end("Bad Gateway");
  });

  req.pipe(upstream);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");

  if (url.pathname.startsWith("/_next/static/")) {
    const relativePath = url.pathname.slice("/_next/static/".length);
    const filePath = safeJoin(nextStaticDir, relativePath);
    if (filePath) {
      serveFile(filePath, res, true);
      return;
    }
  }

  if (url.pathname !== "/" && !url.pathname.includes("..")) {
    const filePath = safeJoin(publicDir, url.pathname.slice(1));
    if (filePath && fs.existsSync(filePath)) {
      serveFile(filePath, res);
      return;
    }
  }

  proxyToNext(req, res);
});

server.listen(externalPort, hostname, () => {
  console.log(
    `Static wrapper listening on ${hostname}:${externalPort}, proxying Next on 127.0.0.1:${internalPort}`,
  );
});

function shutdown() {
  server.close(() => {
    child.kill("SIGTERM");
  });
  setTimeout(() => child.kill("SIGKILL"), 5000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
child.on("exit", (code) => {
  process.exit(code || 0);
});
