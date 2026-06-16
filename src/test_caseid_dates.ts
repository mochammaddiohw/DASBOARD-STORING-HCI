async function main() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('CASE ID OPEN')}`;
    const res = await fetch(url);
    const csvText = await res.text();
    const lines = csvText.replace(/\r/g, '').split('\n');
    const uniqueReqDates = new Set<string>();
    const uniqueAreas = new Set<string>();
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cells = line.split(',');
      const reqDate = cells[6] ? cells[6].replace(/^["']|["']$/g, '').trim() : '';
      const area = cells[22] ? cells[22].replace(/^["']|["']$/g, '').trim() : '';
      if (reqDate) uniqueReqDates.add(reqDate);
      if (area) uniqueAreas.add(area);
    }
    
    console.log('=== UNIQUE REQUESTEDSHIPDATE IN CASE ID OPEN ===');
    console.log(Array.from(uniqueReqDates));
    console.log('=== UNIQUE AREAS IN CASE ID OPEN ===');
    console.log(Array.from(uniqueAreas));
  } catch (e) {
    console.error('Error:', e);
  }
}

main();
