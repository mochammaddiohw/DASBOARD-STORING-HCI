import fs from 'fs';

function main() {
  const csv = fs.readFileSync('occupancy_data.csv', 'utf8');
  const lines = csv.split('\n');
  
  lines.forEach((line, index) => {
    if (line.includes('AREA') || line.includes('Area')) {
      console.log(`Line ${index}: ${line.trim()}`);
    }
  });
}

main();
