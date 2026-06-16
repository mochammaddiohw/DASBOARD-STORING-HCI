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
  
  const targetDate = '5 Jun 2026';
  const rows: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i]);
    if (cells[0] === targetDate) {
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cells[idx] || '';
      });
      rows.push(rowObj);
    }
  }

  // Define Groups
  const Area1SKUs = new Set([
    'R1100A', 'R110AB', 'R1100M', 'R1100N', 'R1100O', 'R110BD', 'R110BE', 'R110BF', 
    'R110BG', 'R110BH', 'R110BI', 'R110BJ', 'R110BK', 'R110BL', 'R110BM', 'R110BN', 
    'R110CB', 'R110CC', 'R110CD', 'R110CE', 'R110CF', 'R110CG', 'R110CH'
  ]);
  const Area2SKUs = new Set([
    'R1100I', 'R110AF', 'R110AG', 'R110AQ', 'R110BB', 'R110BP', 'R110BQ', 'R110BR', 'R110CI', 'R110AM'
  ]);

  let a1C = 0, a1S = 0;
  let a2C = 0, a2S = 0;
  let a3C = 0, a3S = 0;

  rows.forEach(r => {
    const cbm = parseFloat(r['CBM Loc'].replace(/,/g, '')) || 0;
    const stock = parseFloat(r.Stock.replace(/,/g, '')) || 0;
    if (Area1SKUs.has(r.SKUGroup)) {
      a1C += cbm;
      a1S += stock;
    } else if (Area2SKUs.has(r.SKUGroup)) {
      a2C += cbm;
      a2S += stock;
    } else {
      a3C += cbm;
      a3S += stock;
    }
  });

  console.log('=== GROUP SUMS FOR 5 JUN 2026 ===');
  console.log(`AREA 1 -> Capacity CBM: ${a1C}, Stock Used: ${a1S}, Rate: ${((a1S/a1C)*100).toFixed(2)}%`);
  console.log(`AREA 2 -> Capacity CBM: ${a2C}, Stock Used: ${a2S}, Rate: ${((a2S/a2C)*100).toFixed(2)}%`);
  console.log(`AREA 3 -> Capacity CBM: ${a3C}, Stock Used: ${a3S}, Rate: ${((a3S/a3C)*100).toFixed(2)}%`);
}

main();
