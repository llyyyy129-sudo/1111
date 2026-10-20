const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.css':'text/css','.js':'text/javascript'};
http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch {res.writeHead(400);return res.end('Bad request');}
  const file = path.resolve(root, '.' + (pathname==='/'?'/index.html':pathname));
  if (!(file===root || file.startsWith(root+path.sep))) {res.writeHead(403);return res.end('Forbidden');}
  fs.stat(file,(err,stat)=>{
    if(err || !stat.isFile()){res.writeHead(404);return res.end('Not found');}
    res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
}).listen(process.env.PORT||3000,'0.0.0.0');
