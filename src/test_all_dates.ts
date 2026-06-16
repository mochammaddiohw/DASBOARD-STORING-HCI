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

async function main() {
  const csv = fs.readFileSync('occupancy_data.csv', 'utf8');
  const lines = csv.split('\n');
  const headers = splitCSVLine(lines[0]);
  
  const uniqueDates = new Set<string>();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    if (cells[0]) uniqueDates.add(cells[0].replace(/^["']|["']$/g, '').trim());
  }

  console.log('=== UNIQUE DATES IN CSV ===');
  console.log(Array.from(uniqueDates));

  try {
    const mdResponse = await fetch(
      'https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/gviz/tq?tqx=out:csv&sheet=MASTER%20DASHBOARD'
    );
    const mdCsvText = await mdResponse.text();
    const mdLines = mdCsvText.replace(/\r/g, '').split('\n');
    const mdDates = new Set<string>();
    for (let i = 2; i < mdLines.length; i++) {
      const line = mdLines[i].trim();
      if (!line) continue;
      const cells = splitCSVLine(line);
      const dateStr = cells[7];
      if (dateStr && dateStr !== 'Tanggal' && dateStr !== 'TANGGAL' && !dateStr.includes('Target')) {
        mdDates.add(dateStr.replace(/^["']|["']$/g, '').trim());
      }
    }
    console.log('=== UNIQUE DATES IN MASTER DASHBOARD SHEET ===');
    console.log(Array.from(mdDates));
  } catch (e) {
    console.error('Error fetching master dashboard:', e);
  }
}

main();
