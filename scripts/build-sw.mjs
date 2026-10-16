import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
async function walk(dir) {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = dir + '/' + e.name;
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.name !== 'sw.js') files.push(p);
  }
  return files;
}
const files = await walk('dist');
const hash = createHash('sha256');
for (const file of files.sort()) hash.update(await readFile(file));
const version = 'lanternmere-' + hash.digest('hex').slice(0, 12);
const urls = ['/', ...files.map((f) => '/' + f.slice(5))];
await writeFile(
  'dist/sw.js',
  `const CACHE=${JSON.stringify(version)};const FILES=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);for(let i=0;i<FILES.length;i+=6)await cache.addAll(FILES.slice(i,i+6));await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('lanternmere-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/'))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(event.request.mode==='navigate'){try{return await fetch(event.request);}catch{return await cache.match('/');}}return await cache.match(event.request)||fetch(event.request);})());});
`,
);
console.log(`Offline cache prepared: ${urls.length} files, version ${version}.`);
