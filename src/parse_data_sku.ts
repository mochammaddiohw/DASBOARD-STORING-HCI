import fs from 'fs';

function main() {
  const csv = fs.readFileSync('occupancy_data.csv', 'utf8');
  const lines = csv.split('\n');
  
  // Let's print out all lines for '5 Jun 2026' in full, so we can see all 47 of them.
  console.log('=== ALL ROWS FOR 5 JUN 2026 ===');
  lines.forEach((line, index) => {
    if (index === 0) return;
    const cells = line.split(',');
    if (cells[0]?.trim() === '5 Jun 2026') {
      // Find cells 3 (SKUGroup), 5 (Descr), 6 (CBM Loc), 7 (Stock), 8 (% Utilization)
      console.log(`SKUGroup: ${cells[3]}, Descr: ${cells[5]}, CBMLoc: ${cells[6]}, Stock: ${cells[7]}, Util%: ${cells[8]}`);
    }
  });
}

main();
