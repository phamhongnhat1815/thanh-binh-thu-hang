// Preserve the supplied BeyondPerfection outlines and add the missing Vietnamese ằ.
// Run from the project root: node scripts/build-cover-font.cjs
// The new composite uses the original ă and grave accent; all existing glyphs stay intact.
const fs = require('node:fs');
const source = fs.readFileSync('public/assets/f9ff95087332fc94.ttf');
const tables = new Map();
for (let i = 0; i < source.readUInt16BE(4); i++) {
  const p = 12 + i * 16;
  const tag = source.toString('ascii', p, p + 4);
  tables.set(tag, Buffer.from(source.subarray(source.readUInt32BE(p + 8), source.readUInt32BE(p + 8) + source.readUInt32BE(p + 12))));
}
const head = tables.get('head'), maxp = tables.get('maxp'), hhea = tables.get('hhea');
const oldCount = maxp.readUInt16BE(4), newGlyph = oldCount;
const oldLoca = tables.get('loca'), shortLoca = head.readInt16BE(50) === 0;
const offsets = Array.from({ length: oldCount + 1 }, (_, i) => shortLoca ? oldLoca.readUInt16BE(i * 2) * 2 : oldLoca.readUInt32BE(i * 4));
const composite = Buffer.alloc(30);
// Raise and slightly enlarge the original grave so it stays legible at 20px.
composite.writeInt16BE(-1, 0);
[-51, -4, 697, 1065].forEach((v, i) => composite.writeInt16BE(v, 2 + i * 2));
composite.writeUInt16BE(0x0023, 10); composite.writeUInt16BE(196, 12);
composite.writeInt16BE(0, 14); composite.writeInt16BE(0, 16);
composite.writeUInt16BE(0x0043, 18); composite.writeUInt16BE(308, 20);
composite.writeInt16BE(-140, 22); composite.writeInt16BE(125, 24);
composite.writeInt16BE(Math.round(1.35 * 16384), 26);
composite.writeInt16BE(Math.round(1.15 * 16384), 28);
const glyf = tables.get('glyf').subarray(0, offsets[oldCount]);
tables.set('glyf', Buffer.concat([glyf, composite]));
const newLoca = Buffer.alloc((oldCount + 2) * 4);
[...offsets, glyf.length + composite.length].forEach((v, i) => newLoca.writeUInt32BE(v, i * 4));
tables.set('loca', newLoca); head.writeInt16BE(1, 50);
const hmtx = tables.get('hmtx'), metricCount = hhea.readUInt16BE(34), newHmtx = Buffer.alloc((oldCount + 1) * 4);
for (let i = 0; i < oldCount; i++) {
  newHmtx.writeUInt16BE(hmtx.readUInt16BE(Math.min(i, metricCount - 1) * 4), i * 4);
  newHmtx.writeInt16BE(hmtx.readInt16BE(i < metricCount ? i * 4 + 2 : metricCount * 4 + (i - metricCount) * 2), i * 4 + 2);
}
hmtx.copy(newHmtx, oldCount * 4, 196 * 4, 196 * 4 + 4);
tables.set('hmtx', newHmtx); hhea.writeUInt16BE(oldCount + 1, 34); maxp.writeUInt16BE(oldCount + 1, 4);
maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(10), 100), 10);
maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(12), 4), 12);
maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(28), 2), 28);
maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(30), 1), 30);
const cmap = tables.get('cmap');
function extendFormat4(data) {
  const n = data.readUInt16BE(6) / 2, points = [];
  for (let i = 0; i < n; i++) {
    const end = data.readUInt16BE(14 + 2 * i), start = data.readUInt16BE(16 + 2 * n + 2 * i);
    const delta = data.readInt16BE(16 + 4 * n + 2 * i), ro = 16 + 6 * n + 2 * i, r = data.readUInt16BE(ro);
    for (let code = start; code <= end && code < 65535; code++) {
      const raw = r ? data.readUInt16BE(ro + r + 2 * (code - start)) : code;
      const gid = r && raw === 0 ? 0 : (raw + delta) & 65535;
      if (gid && code !== 0x1eb1) points.push([code, gid]);
    }
  }
  points.push([0x1eb1, newGlyph], [65535, 0]); points.sort((a, b) => a[0] - b[0]);
  const count = points.length, out = Buffer.alloc(16 + count * 8), power = 2 ** Math.floor(Math.log2(count));
  out.writeUInt16BE(4, 0); out.writeUInt16BE(out.length, 2); out.writeUInt16BE(data.readUInt16BE(4), 4);
  out.writeUInt16BE(count * 2, 6); out.writeUInt16BE(power * 2, 8); out.writeUInt16BE(Math.log2(power), 10); out.writeUInt16BE(count * 2 - power * 2, 12);
  points.forEach(([code, gid], i) => {
    out.writeUInt16BE(code, 14 + i * 2); out.writeUInt16BE(code, 16 + count * 2 + i * 2);
    out.writeUInt16BE((gid - code) & 65535, 16 + count * 4 + i * 2);
  });
  return out;
}
const recordCount = cmap.readUInt16BE(2), cmapHeader = Buffer.from(cmap.subarray(0, 4 + recordCount * 8)), chunks = [];
let nextCmapOffset = cmapHeader.length;
for (let i = 0; i < recordCount; i++) {
  const p = 4 + i * 8, off = cmap.readUInt32BE(p + 4), format = cmap.readUInt16BE(off);
  const length = format >= 8 ? cmap.readUInt32BE(off + 4) : cmap.readUInt16BE(off + 2);
  let sub = Buffer.from(cmap.subarray(off, off + length));
  if (format === 4) sub = extendFormat4(sub);
  cmapHeader.writeUInt32BE(nextCmapOffset, p + 4); chunks.push(sub); nextCmapOffset += sub.length;
}
tables.set('cmap', Buffer.concat([cmapHeader, ...chunks]));
const post = Buffer.from(tables.get('post').subarray(0, 32)); post.writeUInt32BE(0x00030000); tables.set('post', post);
head.writeUInt32BE(0, 8);
function checksum(data) { let n = 0; for (let i = 0; i < data.length; i += 4) { const p = Buffer.alloc(4); data.copy(p, 0, i, Math.min(i + 4, data.length)); n = (n + p.readUInt32BE(0)) >>> 0; } return n; }
const directory = Buffer.from(source.subarray(0, 12 + tables.size * 16)); let offset = directory.length; const output = [directory]; let headOffset;
[...tables].forEach(([tag, data], i) => {
  const p = 12 + i * 16, padded = Buffer.alloc(Math.ceil(data.length / 4) * 4); data.copy(padded);
  directory.writeUInt32BE(checksum(data), p + 4); directory.writeUInt32BE(offset, p + 8); directory.writeUInt32BE(data.length, p + 12);
  if (tag === 'head') headOffset = offset;
  output.push(padded); offset += padded.length;
});
const result = Buffer.concat(output); result.writeUInt32BE((0xb1b0afba - checksum(result)) >>> 0, headOffset + 8);
if (checksum(result) !== 0xb1b0afba) throw new Error('Invalid font checksum');
fs.writeFileSync('public/assets/cover-script-vietnamese-v2.ttf', result);
console.log({ newGlyph, bytes: result.length, checksum: checksum(result).toString(16) });
