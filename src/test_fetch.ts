import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const url = 'https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/edit?usp=sharing';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    const html = await res.text();
    console.log('HTML length:', html.length);
    
    // Let's search for sheet names in the HTML.
    // They are usually listed in variables or inside some JSON.
    // Let's search for common patterns or print out some snippets.
    const regex = /"([a-zA-Z0-9_\s\-&]+)"\s*,\s*\d+\s*,\s*\[\s*\]\s*,\s*"/g;
    const matches = html.match(regex);
    if (matches) {
      console.log('Possible sheet names match 1:', matches.slice(0, 10));
    }
    
    // Another pattern: "bootstrap_initialTestData" or similar
    const initialTestDataMatch = html.match(/_bootstrap_initialTestData\s*=\s*({[\s\S]*?});/);
    if (initialTestDataMatch) {
      console.log('Found bootstrap_initialTestData!');
      try {
        const jd = JSON.parse(initialTestDataMatch[1]);
        // Let's inspect the keys
        console.log('Keys:', Object.keys(jd));
      } catch (e) {
        // Snippet
        console.log('Snippet of initialTestData:', initialTestDataMatch[1].substring(0, 1000));
      }
    } else {
      console.log('No bootstrap_initialTestData found.');
    }

    // Let's write regex to find all titles in of sheet schema: `"[\w\s]{2,30}",\d+`
    // Let's inspect simple sheet definitions. For example gridData contains: "title":"..." or similar
    const titleMatches = [...html.matchAll(/"title"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
    console.log('Titles found via "title":', Array.from(new Set(titleMatches)));

    const sheetMatches = [...html.matchAll(/"sheetName"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
    console.log('Sheet names found via "sheetName":', Array.from(new Set(sheetMatches)));

  } catch (error) {
    console.error('Error fetching sheet:', error);
  }
}

main();
