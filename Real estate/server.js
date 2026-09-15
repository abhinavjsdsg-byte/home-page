const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const root = __dirname;

const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

http.createServer((req, res) => {
  let filePath = path.join(root, req.url === "/" ? "index.html" : decodeURIComponent(req.url));

  if (!filePath.startsWith(root)) {
    res.writeHead(403); return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {"Content-Type":"text/plain"});
      return res.end("Not found");
    }
    res.writeHead(200, {"Content-Type": mime[path.extname(filePath)] || "application/octet-stream"});
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`MARK Real Estate page running at http://localhost:${PORT}`);
});
