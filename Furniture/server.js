const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const mime = {
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".webp":"image/webp",
  ".svg":"image/svg+xml"
};

http.createServer((req,res)=>{
  let file = decodeURIComponent(req.url.split("?")[0]);
  if(file === "/") file = "/custom-furniture.html";
  const target = path.join(root,file);
  fs.readFile(target,(err,data)=>{
    if(err){res.writeHead(404,{"Content-Type":"text/plain"});return res.end("Not found");}
    res.writeHead(200,{"Content-Type":mime[path.extname(target)] || "application/octet-stream"});
    res.end(data);
  });
}).listen(3000,()=>console.log("MARK Custom Furniture: http://localhost:3000"));
