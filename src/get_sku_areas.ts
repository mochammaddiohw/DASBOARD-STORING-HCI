import fs from 'fs';

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function main() {
  const csv = fs.readFileSync('occupancy_data.csv', 'utf8');
  const lines = csv.split('\n');
  
  const mapping: Record<string, string> = {};
  
  lines.forEach((line, index) => {
    if (index === 0) return;
    const cells = splitCSVLine(line);
    const sku = cells[3];
    if (sku) {
      // Find any cell in the line that has 'AREA 1', 'AREA 2' or 'AREA 3'
      const areaVal = cells.find(c => /AREA\s*\d/i.test(c));
      if (areaVal) {
        mapping[sku.toUpperCase()] = areaVal.trim().toUpperCase();
      }
    }
  });
  
  console.log('Mapping of SKUGroup to Area:', mapping);
}

main();
