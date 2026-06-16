import fs from 'fs';

function main() {
  const html = fs.readFileSync('sheet.html', 'utf8');

  // Let's search for any occurrence of gid numbers
  // Usually, in sheet.html there's a JSON array or JS array or HTML structure.
  // For tabs: they have an attribute like data-id or similar, or they are in a big array.
  // Let's search for "docs-sheet-tab" or find what's after "NOTE", "PICKING", "occupancy", etc.
  
  // Let's do a regex search for something like:
  // [number, number, "some_number", [{"1":[[0,0,"some_sheet_name"
  // Let's check:
  const regex = /\[\s*\d+\s*,\s*\d+\s*,\s*"(\d+)"\s*,\s*\[\s*\{\s*"1"\s*:\s*\[\s*\[\s*\d+\s*,\s*\d+\s*,\s*"([^"]+)"/g;
  const matches = [...html.matchAll(regex)];
  console.log('Found GID and Sheet Name matches:', matches.map(m => ({ gid: m[1], name: m[2] })));

  // Let's do another wider check:
  // Searching for any string of digits in quotes like "1832947087" or similar followed after some characters by "MASTER DASHBOARD"
  // Or general format in the bootstrap JSON.
  // Let's write a simple loop to find "NOTE", "PICKING", etc. and look what gids are near them.
  const sheetNames = [
    'NOTE',
    'PICKING',
    'PUTAWAY',
    'MOVE/PRESSING',
    'occupancy',
    'PRODUCTIVITY PICKING',
    'SUPPORT',
    'MASTER DASHBOARD',
    'Sheet11',
    'productivity & case id'
  ];

  for (const name of sheetNames) {
    let index = 0;
    console.log(`\n--- Matches for ${name} ---`);
    while (true) {
      index = html.indexOf(`"${name}"`, index);
      if (index === -1) break;
      console.log(`Found "${name}" at index ${index}`);
      // Print 200 chars around it
      console.log(html.substring(Math.max(0, index - 150), Math.min(html.length, index + 150)));
      index += name.length + 2;
    }
  }
}

main();
