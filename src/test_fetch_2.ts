import fs from 'fs';

async function main() {
  const url = 'https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/edit?usp=sharing';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  
  // Save HTML to analyze if needed
  fs.writeFileSync('sheet.html', html);
  console.log('Saved sheet.html');
  
  // Search for occurrence of "MASTER DASHBOARD"
  let index = html.indexOf('MASTER DASHBOARD');
  while (index !== -1) {
    console.log('Found "MASTER DASHBOARD" at index', index);
    console.log(html.substring(Math.max(0, index - 200), Math.min(html.length, index + 300)));
    index = html.indexOf('MASTER DASHBOARD', index + 1);
  }
}

main();
