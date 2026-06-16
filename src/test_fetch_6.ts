import fs from 'fs';

function main() {
  const html = fs.readFileSync('sheet.html', 'utf8');
  
  // Let's find all instances of class="docs-sheet-tab" and print the whole div
  let index = 0;
  console.log('=== docs-sheet-tab elements ===');
  while (true) {
    index = html.indexOf('class="docs-sheet-tab', index);
    if (index === -1) break;
    // Find matching ending tag or print next 1000 characters
    console.log(html.substring(index - 100, index + 350));
    index += 20;
  }
}

main();
