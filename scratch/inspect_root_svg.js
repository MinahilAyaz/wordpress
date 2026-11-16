const fs = require('fs');
const s = fs.readFileSync('header_logo.svg', 'utf8');
console.log('--- ROOT header_logo.svg HEADER ---');
console.log(s.slice(0, 300));
console.log('--- PATHS ---');
const matches = s.match(/<path[^>]+>/g) || [];
matches.forEach((m, i) => {
  console.log(`Path ${i}:`, m.slice(0, 150));
});
