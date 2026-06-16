import fs from 'fs';

async function main() {
  const url = 'https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/export?format=csv&gid=1973076620';
  try {
    const res = await fetch(url);
    const csv = await res.text();
    console.log(`Downloaded ${csv.length} bytes.`);
    fs.writeFileSync('occupancy_data.csv', csv);
    
    const lines = csv.split('\n');
    console.log('Total Lines:', lines.length);
    console.log('Headers / Samples:');
    console.log(lines.slice(0, 30).join('\n'));
  } catch (error) {
    console.error('Error fetching occupancy GID:', error);
  }
}

main();
