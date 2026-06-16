import fs from 'fs';

function main() {
  const csv = fs.readFileSync('occupancy_data.csv', 'utf8');
  const lines = csv.split('\n');
  const countsByDate: Record<string, number> = {};
  
  // Let's analyze dates in the CSV
  lines.forEach((line, index) => {
    if (index === 0) return; // header
    const cells = line.split(',');
    const date = cells[0]?.trim();
    if (date) {
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    }
  });
  
  console.log('Counts by date:', countsByDate);
  
  // Let's filter lines for '5 Jun 2026'
  const filterDate = '5 Jun 2026';
  const filteredLines = lines.filter((line, i) => {
    if (i === 0) return false;
    const cells = line.split(',');
    return cells[0]?.trim() === filterDate;
  });
  
  console.log(`\nFiltered lines for '${filterDate}': ${filteredLines.length}`);
  // Log first 15 of them
  filteredLines.slice(0, 30).forEach((line, idx) => {
    console.log(`${idx + 1}: ${line}`);
  });
}

main();
