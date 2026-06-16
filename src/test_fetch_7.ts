import fs from 'fs';

function main() {
  const html = fs.readFileSync('sheet.html', 'utf8');

  // Let's search for sheet name strings in quotes inside that big JSON block.
  // There are blocks like: [4, 0, "SOME_GID", [{"1":[[0,0,"occupancy"
  // Let's write a flexible regex:
  // \[\s*(\d+)\s*,\s*\d+\s*,\s*"(\d+)"\s*,\s*\[\s*\{\s*"1"\s*:\s*\[\s*\[\s*\d+\s*,\s*\d+\s*,\s*"([^"]+)"
  // Wait, in JS compiled output, the quotes might have slashes: e.g. \"1832947087\" and \"MASTER DASHBOARD\"
  const regex = /\[\s*(\d+)\s*,\s*\d+\s*,\s*\\"(\d+)\\"\s*,\s*\[\s*\\{\s*\\"1\\"\s*:\s*\[\s*\[\s*\d+\s*,\s*\d+\s*,\s*\\"([^"]+)\\"/g;
  const matches = [...html.matchAll(regex)];
  console.log('Regex escapes matches:', matches.map(m => ({ index: m[1], gid: m[2], name: m[3] })));

  // Let's write another regex that searches for \"occupancy\" in the html and logs the preceding 200 characters.
  const name = 'occupancy';
  let idx = 0;
  while (true) {
    idx = html.indexOf(name, idx);
    if (idx === -1) break;
    console.log(`\nContext for "${name}" at ${idx}:`);
    console.log(html.substring(Math.max(0, idx - 150), Math.min(html.length, idx + 150)));
    idx += name.length;
  }
}

main();
