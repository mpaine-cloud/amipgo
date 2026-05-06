import fs from 'fs';
const buf = fs.readFileSync('public/amipgo-dark.png');
console.log(buf.slice(0, 8).toString('hex'));
