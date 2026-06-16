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
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    if (cells[0] === '5 Jun 2026') {
      // Print Cells that contain 'AREA'
      const areaVal = cells.find(c => c.includes('AREA'));
      console.log(`SKUGroup: ${cells[3]}, Descr: ${cells[5]}, CBMLoc: ${cells[6]}, Stock: ${cells[7]}, Area Found: ${areaVal || 'NONE'}`);
    }
  }
}

main();
