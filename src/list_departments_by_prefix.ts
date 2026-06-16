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
  
  // Parse rows for '5 Jun 2026'
  const TargetDate = '5 Jun 2026';
  const rowObjs: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    if (cells[0] === TargetDate) {
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cells[idx] || '';
      });
      rowObjs.push(rowObj);
    }
  }
  
  console.log(`Analyzing SKUs of date ${TargetDate}:`);
  
  // Let's group by prefix: the first 4 characters of SKUGroup e.g., R110
  const prefixGroups: Record<string, any[]> = {};
  rowObjs.forEach(row => {
    const prefix = row.SKUGroup.substring(0, 4);
    if (!prefixGroups[prefix]) prefixGroups[prefix] = [];
    prefixGroups[prefix].push(row);
  });
  
  Object.keys(prefixGroups).forEach(prefix => {
    const rows = prefixGroups[prefix];
    let totalCBM = 0;
    let totalStock = 0;
    rows.forEach(r => {
      const cbm = parseFloat(r['CBM Loc'].replace(/,/g, '')) || 0;
      const stock = parseFloat(r.Stock.replace(/,/g, '')) || 0;
      totalCBM += cbm;
      totalStock += stock;
    });
    console.log(`\nPrefix ${prefix} has ${rows.length} rows:`);
    console.log(`  Total CBM Loc: ${totalCBM.toLocaleString('id-ID')}`);
    console.log(`  Total Stock: ${totalStock.toLocaleString('id-ID')}`);
    console.log(`  Average Util%: ${((totalStock / (totalCBM || 1)) * 100).toFixed(2)}%`);
    console.log('  Items:');
    rows.forEach(r => {
      console.log(`    SKUGroup: ${r.SKUGroup}, Putawayzone: ${r.Putawayzone}, Descr: ${r.Descr || '(blank)'}, CBM: ${r['CBM Loc']}, Stock: ${r.Stock}`);
    });
  });
}

main();
