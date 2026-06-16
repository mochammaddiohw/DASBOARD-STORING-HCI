/**
 * Google Apps Script Web App Entrypoint
 * This file (code.gs) is used when deploying the dashboard using Google Apps Script.
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index-gas')
    .setTitle('NDC SIdoarjo Storing Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Custom parse function as requested:
 * Converts: const parse = (data: Data) => {} 
 * To pure JavaScript: function parse(data) {}
 */
function parse(data) {
  if (!data) return null;
  // Parse logic for individual records
  return {
    sku: data.sku || ''
  };
}

/**
 * Fetches the CSV content of the Occupancy GSheet from Google Sheets using UrlFetchApp.
 * As requested, replaces browser fetch() with UrlFetchApp.fetch().
 */
function fetchCSV() {
  const url = 'https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/export?format=csv&gid=1973076620';
  
  try {
    const response = UrlFetchApp.fetch(url);
    const csvText = response.getContentText();
    Logger.log("Fetched " + csvText.length + " bytes of occupancy CSV.");
    return csvText;
  } catch (error) {
    Logger.log("Error inside fetchCSV: " + error.toString());
    throw error;
  }
}

/**
 * General helper to split a line of CSV considering double quoted fields
 */
function splitCSVLine(line) {
  const result = [];
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

/**
 * Port of parse_data.ts
 * Analyzes unique dates in the CSV and prints counts, plus filters lines for a specific date
 */
function parseData(csvText, filterDate) {
  const dateToFilter = filterDate || '5 Jun 2026';
  const lines = csvText.replace(/\r/g, '').split('\n');
  const countsByDate = {};
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    const dateStr = cells[0] ? cells[0].trim() : '';
    if (dateStr) {
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    }
  }
  
  Logger.log('Counts by date: ' + JSON.stringify(countsByDate));
  
  const filteredLines = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    if (cells[0] && cells[0].trim() === dateToFilter) {
      filteredLines.push(line);
    }
  }
  
  Logger.log("Filtered lines for '" + dateToFilter + "': " + filteredLines.length);
  return {
    countsByDate: countsByDate,
    filteredLinesCount: filteredLines.length,
    samples: filteredLines.slice(0, 10)
  };
}

/**
 * Port of proper_parse.ts
 * Parses lines into structured key-value objects based on CSV header definitions
 */
function properParse(csvText, filterDate) {
  const dateToFilter = filterDate || '5 Jun 2026';
  const lines = csvText.replace(/\r/g, '').split('\n');
  if (lines.length === 0) return [];
  
  const headers = splitCSVLine(lines[0]);
  const parsedRows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    if (cells[0] && cells[0].trim() === dateToFilter) {
      const rowObj = {};
      headers.forEach(function(h, idx) {
        rowObj[h] = cells[idx] || '';
      });
      parsedRows.push(rowObj);
    }
  }
  
  Logger.log("Parsed " + parsedRows.length + " rows for " + dateToFilter);
  return parsedRows;
}

/**
 * Port of get_sku_areas.ts
 * Builds a lookup map of SKU Group to corresponding Area tags (e.g. AREA 1, AREA 2, AREA 3)
 */
function getSkuAreas(csvText) {
  const lines = csvText.replace(/\r/g, '').split('\n');
  const mapping = {};
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    const sku = cells[3] ? cells[3].trim() : '';
    if (sku) {
      // Find any cell in the line that contains 'AREA' keyword
      let areaVal = '';
      for (let j = 0; j < cells.length; j++) {
        if (/AREA\s*\d/i.test(cells[j])) {
          areaVal = cells[j].trim().toUpperCase();
          break;
        }
      }
      if (areaVal) {
        mapping[sku.toUpperCase()] = areaVal;
      }
    }
  }
  
  Logger.log('Mapping of SKUGroup to Area: ' + JSON.stringify(mapping));
  return mapping;
}

/**
 * Port of list_all_rows_with_mapping.ts
 * Lists cells with their index and maps Area tag matching to SKU
 */
function listAllRowsWithMapping(csvText) {
  const lines = csvText.replace(/\r/g, '').split('\n');
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCSVLine(line);
    const sku = cells[3] ? cells[3].trim() : '';
    const descr = cells[5] ? cells[5].trim() : '';
    
    let areaTag = '';
    for (let idx = 0; idx < cells.length; idx++) {
      if (cells[idx].indexOf('AREA') > -1 || cells[idx].indexOf('Area') > -1) {
        areaTag = cells[idx] + " (col " + idx + ")";
        break;
      }
    }
    
    if (areaTag) {
      result.push({
        sku: sku,
        descr: descr,
        areaTag: areaTag
      });
    }
  }
  
  Logger.log("Rows with area tags found: " + result.length);
  return result;
}

/**
 * Safe general helper to fetch any specific sheet tab as a CSV text string on behalf of the client
 * Useful if client fetches face CORS restrictions in target environments
 */
function fetchSheetAsCSV(sheetName) {
  const spreadsheetId = '1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk';
  const url = 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(sheetName);
  
  try {
    const response = UrlFetchApp.fetch(url);
    return response.getContentText();
  } catch (error) {
    Logger.log("Error fetching sheet " + sheetName + ": " + error.toString());
    return null;
  }
}
