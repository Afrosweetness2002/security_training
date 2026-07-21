// Throwaway helper: extract translation keys for a section the same way app.js does.
// Usage: node tools/extract-keys.js s02b
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const id = process.argv[2];
const secMatch = html.match(new RegExp('<section id="' + id + '">([\\s\\S]*?)\\n</section>'));
if (!secMatch) { console.error('section not found'); process.exit(1); }
const sec = secMatch[1];

function decode(s) {
  return s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
           .replace(/&amp;/g, '&');
}
function stripTags(s) { return s.replace(/<[^>]+>/g, ''); }
function keyOf(inner) {
  return decode(stripTags(inner)).replace(/\s+/g, ' ').trim();
}

// leaf tags per app.js SEL (excluding svg 'text', handled separately via data-t)
const TAGS = ['h2','h3','h4','p','li','th','td','figcaption'];
const results = [];
for (const tag of TAGS) {
  const re = new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + tag + '>', 'g');
  let m;
  while ((m = re.exec(sec))) {
    // skip if this element is itself inside an <svg> block (shouldn't be for these tags, but guard anyway)
    results.push({ tag, key: keyOf(m[1]), inner: m[1].trim() });
  }
}

// svg text labels, keyed by data-t
const textRe = /<text[^>]*data-t="([^"]+)"[^>]*>([\s\S]*?)<\/text>/g;
let tm;
const labels = [];
while ((tm = textRe.exec(sec))) {
  labels.push({ id: tm[1], key: decode(stripTags(tm[2])).trim() });
}

console.log('=== PROSE (' + results.length + ') ===');
results.forEach((r, i) => console.log(i + ' [' + r.tag + '] ' + JSON.stringify(r.key)));
console.log('\n=== DIAGRAM LABELS (' + labels.length + ') ===');
labels.forEach(l => console.log(l.id + ': ' + JSON.stringify(l.key)));
