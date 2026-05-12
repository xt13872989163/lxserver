const fs = require('fs');
const path = require('path');

function createMinimalPNG(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function crc32(data) {
    let crc = 0xffffffff;
    const table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    for (let i = 0; i < data.length; i++) {
      crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  
  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcData), 0);
    return Buffer.concat([length, typeBuffer, data, crc]);
  }
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(2, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      rawData.push(r, g, b);
    }
  }
  
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const icon1024 = createMinimalPNG(1024, 1024, 99, 102, 241);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), icon1024);
console.log('Created icon.png (1024x1024)');

const adaptiveIcon = createMinimalPNG(1024, 1024, 99, 102, 241);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveIcon);
console.log('Created adaptive-icon.png (1024x1024)');

const splash = createMinimalPNG(1284, 2778, 99, 102, 241);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splash);
console.log('Created splash.png (1284x2778)');

const favicon = createMinimalPNG(48, 48, 99, 102, 241);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), favicon);
console.log('Created favicon.png (48x48)');

console.log('All icons created successfully!');
