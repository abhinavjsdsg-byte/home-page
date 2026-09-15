const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const root = __dirname;
const mime = {
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".png":"image/png",
  ".webp":"image/webp",
  ".svg":"image/svg+xml",
  ".ico":"image/x-icon"
};

http.createServer((req,res)=>{
  let pathname = decodeURIComponent(req.url.split("?")[0]);
  if(pathname === "/") pathname="/index.html";
  const file = path.join(root, pathname);
  if(!file.startsWith(root)){res.writeHead(403);return res.end("Forbidden");}

  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404,{"Content-Type":"text/plain"});return res.end("Not found");}
    res.writeHead(200,{"Content-Type":mime[path.extname(file).toLowerCase()]||"application/octet-stream"});
    res.end(data);
  });
}).listen(PORT,()=>console.log(`MARK Legacy page running at http://localhost:${PORT}`));
