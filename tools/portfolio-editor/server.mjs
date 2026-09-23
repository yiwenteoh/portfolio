import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, '../..');
const dist = path.join(project, 'dist');
const dataFile = path.join(dist, 'portfolio-data.js');
const editorFile = path.join(here, 'editor.html');
const token = crypto.randomBytes(24).toString('hex');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.mp3':'audio/mpeg','.ttf':'font/ttf','.pdf':'application/pdf'};

async function readData() {
  const source = await fs.readFile(dataFile, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: dataFile });
  return context.window.PORTFOLIO_DATA;
}
async function readBody(req, max = 20_000_000) {
  const chunks=[]; let size=0;
  for await (const chunk of req) { size += chunk.length; if (size > max) throw new Error('Upload is too large.'); chunks.push(chunk); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}
function reply(res, status, body, type='application/json; charset=utf-8') {
  res.writeHead(status, {'content-type':type,'cache-control':'no-store','x-content-type-options':'nosniff'});
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}
function authorised(req) { return req.headers['x-editor-token'] === token; }
async function handle(req,res) {
  const url = new URL(req.url, 'http://127.0.0.1');
  try {
    if (req.method==='GET' && url.pathname==='/') {
      const html=(await fs.readFile(editorFile,'utf8')).replaceAll('__EDITOR_TOKEN__',token);
      return reply(res,200,html,'text/html; charset=utf-8');
    }
    if (req.method==='GET' && url.pathname==='/api/data') return reply(res,200,await readData());
    if (req.method==='POST' && url.pathname==='/api/save') {
      if (!authorised(req)) return reply(res,403,{error:'Editor token rejected.'});
      const data=await readBody(req);
      const source=`// Managed by the local Portfolio Editor. Advanced edits can still be made here.\nwindow.PORTFOLIO_DATA = ${JSON.stringify(data,null,2)};\n`;
      await fs.writeFile(dataFile,source,'utf8');
      return reply(res,200,{ok:true});
    }
    if (req.method==='POST' && url.pathname==='/api/upload') {
      if (!authorised(req)) return reply(res,403,{error:'Editor token rejected.'});
      const {fileName,dataUrl}=await readBody(req);
      const match=/^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/.exec(dataUrl||'');
      if (!match) return reply(res,400,{error:'Choose a PNG, JPG, WebP or GIF image.'});
      const ext={"image/png":'.png',"image/jpeg":'.jpg',"image/webp":'.webp',"image/gif":'.gif'}[match[1]];
      const base=String(fileName||'image').replace(/\.[^.]+$/,'').replace(/[^a-z0-9_-]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'image';
      const name=`${base}-${Date.now()}${ext}`; const dir=path.join(dist,'assets','uploads');
      await fs.mkdir(dir,{recursive:true}); await fs.writeFile(path.join(dir,name),Buffer.from(match[2],'base64'));
      return reply(res,200,{path:`assets/uploads/${name}`});
    }
    if (req.method==='POST' && url.pathname==='/api/publish') {
      if (!authorised(req)) return reply(res,403,{error:'Editor token rejected.'});
      return execFile('vercel',['deploy','--prod','--yes','--scope','cartpool'],{cwd:project,maxBuffer:5_000_000},(error,stdout,stderr)=>reply(res,error?500:200,{ok:!error,output:`${stdout}\n${stderr}`.trim(),error:error?.message}));
    }
    if (req.method==='GET' && url.pathname.startsWith('/preview/')) {
      const relative=url.pathname.slice('/preview/'.length)||'index.html';
      const file=path.resolve(dist,relative);
      if (!file.startsWith(`${dist}${path.sep}`)) return reply(res,403,'Forbidden','text/plain');
      return reply(res,200,await fs.readFile(file),mime[path.extname(file).toLowerCase()]||'application/octet-stream');
    }
    reply(res,404,{error:'Not found'});
  } catch (error) { reply(res,500,{error:error.message}); }
}

let port=43125;
const server=http.createServer(handle);
server.on('error',error=>{ if(error.code==='EADDRINUSE'&&port<43135){port++;server.listen(port,'127.0.0.1');} else throw error; });
server.listen(port,'127.0.0.1',()=>{
  const url=`http://127.0.0.1:${port}/`;
  console.log(`Portfolio Editor running at ${url}\nKeep this window open while editing. Press Control+C to stop.`);
  execFile('open',[url]);
});
