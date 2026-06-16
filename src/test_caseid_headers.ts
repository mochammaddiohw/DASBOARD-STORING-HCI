async function main() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('CASE ID OPEN')}`;
    const res = await fetch(url);
    const csvText = await res.text();
    const lines = csvText.replace(/\r/g, '').split('\n');
    if (lines.length > 0) {
      const headers = lines[0].split(',').map((h, i) => `${i} (${String.fromCharCode(65 + i)}): ${h}`);
      console.log('=== CASE ID OPEN HEADERS ===');
      console.log(headers.slice(0, 30).join('\n'));
      
      console.log('=== FIRST 3 ROWS ===');
      for (let i = 1; i < Math.min(lines.length, 4); i++) {
        console.log(`Row ${i}:`, lines[i]);
      }
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

main();
