// Cross-checks the Laws glossary table in index.html against data/laws.json:
// every <tr id="law-..."> row must have a matching JSON entry with a lagen.nu source link
// actually present in the row, and every JSON entry must have a matching row. Run from
// the repo root: node tools/check-law-sources.js
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const laws = require('../data/laws.json');

const byId = new Map(laws.map(l => [l.id, l]));
const rowIds = new Set();
const rowRe = /<tr id="law-([a-z0-9-]+)"><td>([\s\S]*?)<\/td>/g;
let m, problems = 0;

while ((m = rowRe.exec(html))) {
  const rowId = m[1];
  const cell = m[2];
  rowIds.add(rowId);

  const entry = byId.get(rowId);
  if (!entry) {
    console.log('MISSING JSON ENTRY: row "law-' + rowId + '" has no matching id in data/laws.json');
    problems++;
    continue;
  }

  const linkMatch = cell.match(/<a class="lawsrc" href="([^"]+)"/);
  if (!linkMatch) {
    console.log('MISSING SOURCE LINK: row "law-' + rowId + '" has no a.lawsrc link');
    problems++;
    continue;
  }
  if (linkMatch[1] !== entry.sources.lagen_nu) {
    console.log('LINK MISMATCH: row "law-' + rowId + '" links to ' + linkMatch[1] +
      ' but data/laws.json lists ' + entry.sources.lagen_nu);
    problems++;
  }
  if (!/^https:\/\/lagen\.nu\//.test(linkMatch[1])) {
    console.log('SUSPICIOUS URL: row "law-' + rowId + '" source link is not a lagen.nu URL: ' + linkMatch[1]);
    problems++;
  }
}

laws.forEach(entry => {
  if (!rowIds.has(entry.id)) {
    console.log('ORPHANED JSON ENTRY: data/laws.json has "' + entry.id + '" but no matching <tr id="law-' + entry.id + '"> in index.html');
    problems++;
  }
});

console.log('\nGlossary rows checked:', rowIds.size, '| JSON entries:', laws.length, '| problems:', problems);
process.exit(problems ? 1 : 0);
