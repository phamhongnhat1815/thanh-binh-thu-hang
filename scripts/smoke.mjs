import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const origin=process.argv[2]||'http://localhost:3001';
for(const route of ['/','/invitation']){
 const response=await fetch(origin+route);assert.equal(response.status,200);const html=await response.text();assert.ok(html.includes('15.11.2026'));assert.ok(!html.includes('ladipagev3.min.js'));assert.ok(!html.includes('/_osh/collect.js'));console.log('PASS page',route);
}
for(const input of ['null','[]','{}','not-json',JSON.stringify({name:'Test',message:'Test',form_item7:'invalid',form_item9:'Khách mời Cô Dâu',guests:'2'})]){
 const r=await fetch(origin+'/api/wishes',{method:'POST',headers:{'Content-Type':'application/json'},body:input});assert.equal(r.status,400);console.log('PASS invalid submission',input.slice(0,30));
}
const wishes=await (await fetch(origin+'/api/wishes')).json();assert.ok(Array.isArray(wishes));for(const wish of wishes)assert.deepEqual(Object.keys(wish).sort(),['message','name']);console.log('PASS public wishes expose only name and message');
const paths=new Set();for(const name of ['cover','invitation']){const css=await readFile(new URL('../public/'+name+'.css',import.meta.url),'utf8');for(const match of css.matchAll(/url\(["']?(\/assets\/[^)"']+)/g))paths.add(match[1]);}
for(const asset of paths){await access(new URL('../public'+asset,import.meta.url));}
const assetPaths=[...paths];let cursor=0;await Promise.all(Array.from({length:8},async()=>{while(cursor<assetPaths.length){const asset=assetPaths[cursor++];const response=await fetch(origin+asset,{method:'HEAD'});assert.equal(response.status,200,asset)}}));console.log('PASS all',paths.size,'CSS assets exist and serve HTTP 200');
console.log('Smoke checks complete.');
