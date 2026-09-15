const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".webp":"image/webp",
  ".svg":"image/svg+xml",
  ".mp4":"video/mp4"
};

http.createServer((req,res)=>{
  let requestPath = decodeURIComponent(req.url.split("?")[0]);
  if(requestPath === "/") requestPath = "/construction.html";

  const filePath = path.join(ROOT, requestPath);

  if(!filePath.startsWith(ROOT)){
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath,(err,data)=>{
    if(err){
      res.writeHead(404,{"Content-Type":"text/plain"});
      return res.end("404 — File not found");
    }
    res.writeHead(200,{"Content-Type":MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream"});
    res.end(data);
  });
}).listen(PORT,()=>console.log(`MARK Construction: http://localhost:${PORT}`));
