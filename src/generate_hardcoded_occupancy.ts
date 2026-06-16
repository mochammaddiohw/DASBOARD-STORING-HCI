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
  
  const targetDates = ['1 Jun 2026', '2 Jun 2026', '3 Jun 2026', '4 Jun 2026', '5 Jun 2026'];
  const allRows: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    const date = cells[0];
    if (targetDates.includes(date)) {
      const row: Record<string, any> = {};
      headers.forEach((h, idx) => {
        row[h] = cells[idx] || '';
      });
      allRows.push({
        periode: row.Periode,
        whseid: row.WHSEID,
        storerkey: row.Storerkey,
        skuGroup: row.SKUGroup,
        putawayzone: row.Putawayzone,
        descr: row.Descr,
        cbmLoc: parseFloat(row['CBM Loc'].replace(/,/g, '')) || 0,
        stock: parseFloat(row.Stock.replace(/,/g, '')) || 0,
        utilization: parseFloat(row['% Utilization'].replace(/,/g, '')) || 0,
      });
    }
  }
  
  fs.writeFileSync('src/components/fallback_occupancy.ts', `export const FALLBACK_OCCUPANCY_ROWS = ${JSON.stringify(allRows, null, 2)};`);
  console.log('Generated src/components/fallback_occupancy.ts with', allRows.length, 'rows');
}

main();
