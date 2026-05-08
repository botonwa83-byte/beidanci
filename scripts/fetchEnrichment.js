#!/usr/bin/env node

// Fetch real phonetics and example sentences from free dictionary API
// Usage: node scripts/fetchEnrichment.js

const fs = require('fs');
const path = require('path');

const RAW_PATH = path.join(__dirname, '..', 'src', 'data', 'wordDatabaseRaw.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'wordEnrichment.json');

// Load existing enrichment if any (for incremental updates)
let existing = {};
if (fs.existsSync(OUTPUT_PATH)) {
  try {
    existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
  } catch (e) {}
}

const rawData = JSON.parse(fs.readFileSync(RAW_PATH, 'utf8'));

// Collect all unique words
const allWords = new Set();
rawData.roots.forEach(r => r.words.forEach(w => allWords.add(w.word.toLowerCase())));
if (rawData.supplement) {
  Object.values(rawData.supplement).forEach(list => {
    list.forEach(w => allWords.add(w.word.toLowerCase()));
  });
}

const wordList = [...allWords].sort();
console.log(`Total unique words: ${wordList.length}`);

// Skip words we already have
const toFetch = wordList.filter(w => !existing[w] || !existing[w].phonetic);
console.log(`Words to fetch: ${toFetch.length} (already have ${wordList.length - toFetch.length})`);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWord(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];

    // Get phonetic
    let phonetic = entry.phonetic || '';
    if (!phonetic && entry.phonetics) {
      for (const p of entry.phonetics) {
        if (p.text) { phonetic = p.text; break; }
      }
    }

    // Get examples per part of speech
    const examples = [];
    if (entry.meanings) {
      for (const meaning of entry.meanings) {
        for (const def of meaning.definitions) {
          if (def.example) {
            examples.push(def.example);
          }
        }
      }
    }

    return {
      phonetic: phonetic || '',
      examples: examples.slice(0, 3),
    };
  } catch (e) {
    return null;
  }
}

async function main() {
  const result = { ...existing };
  let fetched = 0;
  let failed = 0;
  const batchSize = 5; // concurrent requests

  for (let i = 0; i < toFetch.length; i += batchSize) {
    const batch = toFetch.slice(i, i + batchSize);
    const promises = batch.map(async (word) => {
      const data = await fetchWord(word);
      if (data) {
        result[word] = data;
        fetched++;
      } else {
        failed++;
      }
    });

    await Promise.all(promises);

    // Rate limit: ~450ms between batches
    if (i + batchSize < toFetch.length) {
      await sleep(450);
    }

    // Progress
    if ((i + batchSize) % 50 === 0 || i + batchSize >= toFetch.length) {
      console.log(`Progress: ${Math.min(i + batchSize, toFetch.length)}/${toFetch.length} (fetched: ${fetched}, failed: ${failed})`);
      // Save intermediate results
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
  console.log(`\nDone! Fetched: ${fetched}, Failed: ${failed}`);
  console.log(`Total words with data: ${Object.keys(result).length}`);
  console.log(`Saved to: ${OUTPUT_PATH}`);
}

main().catch(console.error);
