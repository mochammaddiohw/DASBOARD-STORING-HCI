import fs from 'fs';

function main() {
  const csv = fs.readFileSync('occupancy_data.csv', 'utf8');
  const lines = csv.split('\n');
  let found =0;
  lines.forEach((line, index) => {
    if (line.includes('R118')) {
      console.log(`Line ${index}: ${line}`);
      found++;
    }
  });
  console.log('Total R118 occurrences:', found);
}

main();
