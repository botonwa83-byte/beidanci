const rawData = require('../src/data/wordDatabaseRaw.json');
const enrichment = require('../src/data/wordEnrichment.json');

// Check phonetic coverage
const allWords = [];
rawData.roots.forEach(r =>
  r.words.forEach(w => allWords.push(w.word.toLowerCase())),
);
if (rawData.supplement) {
  Object.values(rawData.supplement).forEach(list =>
    list.forEach(w => allWords.push(w.word.toLowerCase())),
  );
}

const withPhonetic = allWords.filter(
  w => enrichment[w] && enrichment[w].phonetic,
);
const withExample = allWords.filter(
  w =>
    enrichment[w] &&
    enrichment[w].examples &&
    enrichment[w].examples.length > 0,
);

console.log('=== Coverage Stats ===');
console.log(`Total words: ${allWords.length}`);
console.log(
  `With phonetic: ${withPhonetic.length} (${(
    (withPhonetic.length / allWords.length) *
    100
  ).toFixed(1)}%)`,
);
console.log(
  `With real examples: ${withExample.length} (${(
    (withExample.length / allWords.length) *
    100
  ).toFixed(1)}%)`,
);

// Sample some enriched words
console.log('\n=== Sample Words ===');
const samples = [
  'transport',
  'airport',
  'passport',
  'sport',
  'opportunity',
  'important',
  'structure',
  'incredible',
  'understand',
];
for (const w of samples) {
  const data = enrichment[w];
  if (data) {
    console.log(`\n${w}:`);
    console.log(`  phonetic: ${data.phonetic || '(none)'}`);
    console.log(`  example: ${data.examples[0] || '(fallback template)'}`);
  } else {
    console.log(`\n${w}: (no data)`);
  }
}

// Show some without phonetic
const noPhonetic = allWords.filter(
  w => !enrichment[w] || !enrichment[w].phonetic,
);
console.log(`\n=== Words without phonetic (${noPhonetic.length}) ===`);
console.log(noPhonetic.slice(0, 15).join(', '));
