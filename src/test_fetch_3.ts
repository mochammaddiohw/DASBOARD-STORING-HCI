import fs from 'fs';

function main() {
  const html = fs.readFileSync('sheet.html', 'utf8');
  
  // 1. Check using docs-sheet-tab-caption
  const regex1 = /docs-sheet-tab-caption">([^<]+)<\/div>/g;
  const matches1 = [...html.matchAll(regex1)].map(m => m[1]);
  console.log('Tab captions found:', matches1);
  
  // 2. Search for the pattern with gid and sheet name:
  // e.g., [7,0,"1832947087",[{"1":[[0,0,"MASTER DASHBOARD"
  // Let's write a regex that matches numbers in quotes, followed by a list containing the sheet name.
  // Pattern: "(\d+)",\[\{"1":\[\[\d+,\d+,"([^"]+)"
  const regex2 = /"(\d+)"\s*,\s*\[\s*\{\s*"1"\s*:\s*\[\s*\[\s*\d+\s*,\s*\d+\s*,\s*"([^"]+)"/g;
  const matches2 = [...html.matchAll(regex2)].map(m => ({ gid: m[1], name: m[2] }));
  console.log('GID-to-Sheet Map found:', matches2);

  // Let's also do a general search for GIDs in the JSON blocks
  // e.g. "[\d+,\d+,\"<sheet-name>\""
  const regex3 = /\[\d+,\d+,"([^"]+)"\]/g;
  const matches3 = [...html.matchAll(regex3)].map(m => m[1]);
  console.log('General match names:', Array.from(new Set(matches3)));
}

main();
