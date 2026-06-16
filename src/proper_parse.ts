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
  console.log('Headers:', headers);
  
  const parsedRows: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    if (cells[0] === '5 Jun 2026') {
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cells[idx] || '';
      });
      parsedRows.push(rowObj);
    }
  }
  
  console.log(`Parsed ${parsedRows.length} rows for 5 Jun 2026.`);
  parsedRows.forEach((row, idx) => {
    console.log(`${idx + 1}: SKUGroup: ${row.SKUGroup}, Putawayzone: ${row.Putawayzone}, Descr: ${row.Descr}, CBMLoc: ${row['CBM Loc']}, Stock: ${row.Stock}, Util%: ${row['% Utilization']}`);
  });
}

main();
