async function main() {
  try {
    const response = await fetch(
      'https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/export?format=csv&gid=1973076620'
    );
    const csvText = await response.text();
    const lines = csvText.split('\n');
    const unique = new Set<string>();
    
    // Find column index for Periode or Tanggal
    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
    const dateIdx = headers.findIndex(h => h.includes('tanggal') || h.includes('periode') || h.includes('date'));
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cells = line.split(',');
      if (cells[dateIdx]) {
        unique.add(cells[dateIdx].replace(/^["']|["']$/g, '').trim());
      }
    }
    console.log('=== UNIQUE DATES IN LIVE GOOGLE SHEET (OCCUPANCY) ===');
    console.log(Array.from(unique));
  } catch (e) {
    console.error('Error fetching live occupancy sheet:', e);
  }
}

main();
