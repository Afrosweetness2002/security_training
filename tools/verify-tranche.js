// Verify every key in assets/i18n.sv.js matches a real element in a given section of index.html,
// and flag prose/diagram text in that section that has no SV translation yet.
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const svSrc = fs.readFileSync('assets/i18n.sv.js', 'utf8');
const window = {};
eval(svSrc);
const SV = window.SV;

const id = process.argv[2];
const secMatch = html.match(new RegExp('<section id="' + id + '">([\\s\\S]*?)\\n</section>'));
if (!secMatch) { console.error('section not found'); process.exit(1); }
const sec = secMatch[1];

function decode(s) { return s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, '&'); }
function stripTags(s) { return s.replace(/<[^>]+>/g, ''); }
function keyOf(inner) { return decode(stripTags(inner)).replace(/\s+/g, ' ').trim(); }

const TAGS = ['h2','h3','h4','p','li','th','td','figcaption'];
const proseKeys = new Set();
for (const tag of TAGS) {
  const re = new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + tag + '>', 'g');
  let m;
  while ((m = re.exec(sec))) {
    const k = keyOf(m[1]);
    if (k) proseKeys.add(k);
  }
}
const textRe = /<text[^>]*data-t="([^"]+)"[^>]*>/g;
const diagIds = new Set();
let tm;
while ((tm = textRe.exec(sec))) diagIds.add(tm[1]);

// 1. Untranslated: keys present in section but with no SV entry and containing English-looking content
let untranslated = 0;
proseKeys.forEach(k => {
  if (!(k in SV) && /[a-zA-Z]{3}/.test(k) && /\b(the|is|you|and|of|a|to)\b/i.test(k)) {
    console.log('UNTRANSLATED:', JSON.stringify(k));
    untranslated++;
  }
});
diagIds.forEach(id => {
  if (!(id in SV)) console.log('UNTRANSLATED DIAGRAM (may be already-Swedish, verify):', id);
});

// 2. Orphaned SV keys: dN.x keys with no matching data-t anywhere in the whole document
const allDiagIds = new Set();
let am;
const allTextRe = /<text[^>]*data-t="([^"]+)"[^>]*>/g;
while ((am = allTextRe.exec(html))) allDiagIds.add(am[1]);
Object.keys(SV).forEach(k => {
  if (/^d\d+\.\d+$/.test(k) && !allDiagIds.has(k)) {
    console.log('ORPHANED DIAGRAM KEY (no matching data-t anywhere in index.html):', k);
  }
});

console.log('\nSection prose leaf count:', proseKeys.size, '| diagram labels:', diagIds.size);
console.log('Untranslated prose flagged:', untranslated);
