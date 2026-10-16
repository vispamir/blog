import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('out');
const files=fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
let checked=0;
for(const f of files){
 const html=fs.readFileSync(path.join(root,f),'utf8');
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  const url=match[1].split(/[?#]/)[0];if(!url.startsWith('/')||url.startsWith('//'))continue;
  const decoded=decodeURIComponent(url);const dest=path.join(root,decoded);
  if(!fs.existsSync(dest)&&!fs.existsSync(path.join(dest,'index.html')))throw new Error(`${f}: missing ${url}`);
  checked++;
 }
}
for(const p of ['index.html','404.html','articles/index.html','search/index.html','about/index.html','categories/index.html','sitemap.xml','robots.txt'])if(!fs.existsSync(path.join(root,p)))throw new Error(`Missing ${p}`);
console.log(`Verified ${files.length} HTML documents and ${checked} local asset/route references.`);
