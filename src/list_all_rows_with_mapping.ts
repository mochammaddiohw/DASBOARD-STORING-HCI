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
  const headers = splitCSVLine(lines[0]);
  
  // Let's print rows for 1 Jun 2026 to see if other rows have AREA tags we missed.
  console.log('=== ROW ANALYSIS ===');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    const sku = cells[3];
    const descr = cells[5];
    
    // Check if any column contains 'AREA'
    let areaTag = '';
    cells.forEach((cell, cellIdx) => {
      if (cell.includes('AREA') || cell.includes('Area')) {
        areaTag = `${cell} (col ${cellIdx})`;
      }
    });
    
    if (areaTag) {
      console.log(`SKU: ${sku}, Descr: ${descr || '(blank)'}, Area Tag: ${areaTag}`);
    }
  }
}

main();
