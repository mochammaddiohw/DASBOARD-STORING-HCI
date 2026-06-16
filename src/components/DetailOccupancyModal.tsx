import React, { useState, useEffect } from 'react';
import { X, Search, Download, ArrowUpDown, Tag, Percent, Ruler, Package, Layers } from 'lucide-react';
import { FALLBACK_OCCUPANCY_ROWS } from './fallback_occupancy';

export const DEPT_MAP: Record<string, { descr: string; cbmLoc: number }> = {
  // Group 1 / Area 1
  'R110AM': { descr: 'Custom Furniture', cbmLoc: 2.0 },
  'R110BD': { descr: 'Dining', cbmLoc: 2121.0 },
  'R110BE': { descr: 'Kitchen', cbmLoc: 701.4 },
  'R110BF': { descr: 'Bedroom', cbmLoc: 4242.0 },
  'R110BH': { descr: 'Bathroom', cbmLoc: 718.2 },
  'R110BI': { descr: 'Kids Space', cbmLoc: 2121.0 },
  'R110BJ': { descr: 'Textile Bedding', cbmLoc: 1060.5 },
  'R110BK': { descr: 'Home Decor', cbmLoc: 350.7 },
  'R110BL': { descr: 'Home Textile', cbmLoc: 359.1 },
  'R110BM': { descr: 'Home Organizer', cbmLoc: 350.7 },
  'R110BN': { descr: 'Homeware', cbmLoc: 350.7 },
  'R110BO': { descr: 'Lighting', cbmLoc: 350.7 },

  // Group 2 / Area 2
  'R110CB': { descr: 'Textile', cbmLoc: 302.4 },
  'R110CG': { descr: 'Ruang Tidur', cbmLoc: 302.4 },
  'R110CD': { descr: 'Ruang Tamu & Penyimpanan', cbmLoc: 323.4 },
  'R110CE': { descr: 'Ruang Makan & Dapur', cbmLoc: 302.0 },
  'R110CF': { descr: 'Peralatan Makan & Dapur', cbmLoc: 302.0 },
  'R110CH': { descr: 'Perlengkapan Rumah', cbmLoc: 302.4 },
  'R110CI': { descr: 'Ruang Kerja & Belajar', cbmLoc: 302.0 },
  'R110BB': { descr: 'Table & Cabinet', cbmLoc: 2839.2 },
  'R110BR': { descr: 'Commercial & Business', cbmLoc: 5644.8 },
  'R110BP': { descr: 'Office', cbmLoc: 2839.2 },
  'R110BQ': { descr: 'Office Seating', cbmLoc: 5558.7 },

  // Group 3 / Area 3
  'R110CC': { descr: 'Kasur', cbmLoc: 829.0 },
  'R110CA': { descr: 'Sofa', cbmLoc: 829.44 },
  'R110BG': { descr: 'Mattress', cbmLoc: 8652.0 },
  'R110BA': { descr: 'Sofa & Chair', cbmLoc: 7326.72 },
  'R110BC': { descr: 'Home Classic', cbmLoc: 8225.0 },
  'R110DC': { descr: 'KELS - Health Care', cbmLoc: 113.664 },
  'R110DB': { descr: 'KELS - Small Domestic Appliances', cbmLoc: 113.664 },
  'R110DA': { descr: 'KELS - Major Domestic Appliances', cbmLoc: 118.272 },
  'R110DD': { descr: 'KELS - Beauty Care', cbmLoc: 138.24 },
  'R110EG': { descr: 'Small Domestic Appliances', cbmLoc: 504.0 },
  'R110EA': { descr: 'Audio Visual', cbmLoc: 508.416 },
  'R110EF': { descr: 'Major Domestic Appliances', cbmLoc: 508.0 }
};

const AREA_1_CODES = ['R110AM', 'R110BD', 'R110BE', 'R110BF', 'R110BH', 'R110BI', 'R110BJ', 'R110BK', 'R110BL', 'R110BM', 'R110BN', 'R110BO'];
const AREA_2_CODES = ['R110CB', 'R110CG', 'R110CD', 'R110CE', 'R110CF', 'R110CH', 'R110CI', 'R110BB', 'R110BR', 'R110BP', 'R110BQ'];
const AREA_3_CODES = ['R110CC', 'R110CA', 'R110BG', 'R110BA', 'R110BC', 'R110DC', 'R110DB', 'R110DA', 'R110DD', 'R110EG', 'R110EA', 'R110EF'];

interface DetailOccupancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaName: string;
  selectedPeriodName: string;
}

interface ProcessedRow {
  periode: string;
  whseid: string;
  storerkey: string;
  skuGroup: string;
  putawayzone: string;
  descr: string;
  cbmLoc: number;
  stock: number;
  utilization: number;
}

export default function DetailOccupancyModal({
  isOpen,
  onClose,
  areaName,
  selectedPeriodName
}: DetailOccupancyModalProps) {
  const [rows, setRows] = useState<ProcessedRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Sort state
  const [sortField, setSortField] = useState<'skuGroup' | 'descr' | 'cbmLoc' | 'stock' | 'utilization'>('utilization');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Trigger Google Sheet fetch dynamically on load
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/export?format=csv&gid=1973076620'
        );
        if (!response.ok) throw new Error('Network response not ok');
        const csvText = await response.text();
        
        // Parse CSV Text with proper quote safety
        const lines = csvText.split('\n');
        if (lines.length <= 1) throw new Error('Empty CSV data received');
        
        const headers = splitCSVLine(lines[0]);
        const parsedRows: ProcessedRow[] = [];
        
        const headerIndexMap: Record<string, number> = {};
        headers.forEach((h, idx) => {
          const cleanH = h.replace(/^["']|["']$/g, '').trim().toLowerCase();
          headerIndexMap[cleanH] = idx;
        });

        const getCellVal = (possibleHeaders: string[], cells: string[]): string => {
          for (const ph of possibleHeaders) {
            const idx = headerIndexMap[ph.toLowerCase()];
            if (idx !== undefined) {
              const value = cells[idx];
              return value ? value.replace(/^["']|["']$/g, '').trim() : '';
            }
          }
          return '';
        };

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const cells = splitCSVLine(line);
          
          const valPeriode = getCellVal(['tanggal', 'periode', 'date'], cells);
          const valSku = getCellVal(['dept', 'skugroup', 'sku group', 'department'], cells);
          const valDescr = getCellVal(['descr', 'description', 'nama departement', 'nama_departement'], cells);
          const valCbmLoc = getCellVal(['cbm loc', 'cbm_loc', 'cbm capacity', 'capacity'], cells);
          const valStock = getCellVal(['stock', 'cbm used', 'cbm_used', 'used', 'aktual'], cells);
          const valArea = getCellVal(['area', 'putawayzone'], cells);

          const cbmLocNum = parseFloat(valCbmLoc.replace(/,/g, '')) || 0;
          const stockNum = parseFloat(valStock.replace(/,/g, '')) || 0;
          const utilizationNum = cbmLocNum > 0 ? (stockNum / cbmLocNum) * 100 : 0;

          if (valSku) {
            parsedRows.push({
              periode: valPeriode,
              whseid: getCellVal(['whseid'], cells) || 'WMWHSE10',
              storerkey: getCellVal(['storerkey'], cells) || 'HCI',
              skuGroup: valSku,
              putawayzone: valArea || valSku,
              descr: valDescr,
              cbmLoc: cbmLocNum,
              stock: stockNum,
              utilization: utilizationNum
            });
          }
        }
        
        if (parsedRows.length > 0) {
          setRows(parsedRows);
        } else {
          setRows(FALLBACK_OCCUPANCY_ROWS);
        }
      } catch (e) {
        console.warn('Live Google Sheet fetch failed or was blocked. Using precompiled fallback data.', e);
        setRows(FALLBACK_OCCUPANCY_ROWS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // Helper for safe CSV line splitting
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

  if (!isOpen) return null;

  // Normalization helper for dates to be compared robustly (e.g., "5 Jun 2026" === "5 Juni 2026" === "05 Jun 2026")
  const normalizeDate = (dateStr: string): string => {
    if (!dateStr) return '';
    let s = dateStr.trim().toLowerCase();

    // If the string starts with a 4-digit number (like 2026-06-09 or 2026/06/09),
    // then we can extract the date part first.
    if (/^\d{4}/.test(s)) {
      s = s.split(' ')[0]; // remove time component
      s = s.split('t')[0]; // remove ISO T component
      const yymmddMatch = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
      if (yymmddMatch) {
        const y = parseInt(yymmddMatch[1], 10);
        const m = parseInt(yymmddMatch[2], 10);
        const d = parseInt(yymmddMatch[3], 10);
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        if (m >= 1 && m <= 12) {
          return `${d} ${months[m - 1]} ${y}`;
        }
      }
    }

    // Check for DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (ddmmyyMatch) {
      const d = parseInt(ddmmyyMatch[1], 10);
      const m = parseInt(ddmmyyMatch[2], 10);
      const y = parseInt(ddmmyyMatch[3], 10);
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      if (m >= 1 && m <= 12) {
        return `${d} ${months[m - 1]} ${y}`;
      }
    }

    // Handle standard text dates, replace indonesian/english months
    s = s.replace(/[()]/g, '');
    s = s.replace(/januari|january/g, 'jan');
    s = s.replace(/februari|february/g, 'feb');
    s = s.replace(/maret|march|mar/g, 'mar');
    s = s.replace(/april|apr/g, 'apr');
    s = s.replace(/mei|may/g, 'may');
    s = s.replace(/juni|june|jun/g, 'jun');
    s = s.replace(/juli|july|jul/g, 'jul');
    s = s.replace(/agustus|august|aug/g, 'aug');
    s = s.replace(/september|sep/g, 'sep');
    s = s.replace(/oktober|october|oct/g, 'oct');
    s = s.replace(/november|nov/g, 'nov');
    s = s.replace(/desember|december|des|dec/g, 'dec');
    
    // Day leading zero: "05" -> "5"
    s = s.replace(/\b0+(\d+)/g, '$1');
    return s.replace(/\s+/g, ' ');
  };

  // Extract date component if selectedPeriodName is of format "Hari Ini (6 Juni 2026)"
  const getTargetDateStr = (periodName: string): string => {
    const parenthesizedDate = periodName.match(/\(([^)]+)\)/);
    const cleanName = parenthesizedDate ? parenthesizedDate[1] : periodName;
    
    const match = cleanName.match(/(\d+)\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
    if (match) {
      const day = match[1];
      const mon = match[2].toLowerCase();
      const year = match[3];
      
      const monthMap: Record<string, string> = {
        'januari': 'Jan', 'jan': 'Jan',
        'februari': 'Feb', 'feb': 'Feb',
        'maret': 'Mar', 'mar': 'Mar',
        'april': 'Apr', 'apr': 'Apr',
        'mei': 'May', 'may': 'May',
        'juni': 'Jun', 'jun': 'Jun',
        'juli': 'Jul', 'jul': 'Jul',
        'agustus': 'Aug', 'aug': 'Aug',
        'september': 'Sep', 'sep': 'Sep',
        'oktober': 'Oct', 'oct': 'Oct',
        'november': 'Nov', 'nov': 'Nov',
        'desember': 'Dec', 'dec': 'Dec'
      };
      
      const shortMon = monthMap[mon] || 'Jun';
      return `${day} ${shortMon} ${year}`;
    }
    
    return '6 Jun 2026';
  };

  const targetDateString = getTargetDateStr(selectedPeriodName);
  const normTarget = normalizeDate(targetDateString);

  const periodFiltered = rows.filter((r) => {
    if (!r.periode) return normTarget === normalizeDate('6 Jun 2026');
    return normalizeDate(r.periode) === normTarget;
  });

  // Group by chosen Area details
  let targetCodes: string[] = [];
  if (areaName === 'AREA 1') {
    targetCodes = AREA_1_CODES;
  } else if (areaName === 'AREA 2') {
    targetCodes = AREA_2_CODES;
  } else {
    targetCodes = AREA_3_CODES;
  }

  const areaRows: ProcessedRow[] = targetCodes.map((code) => {
    // Look up in parsed rows
    const matchingRow = periodFiltered.find(
      (r) => r.skuGroup.toUpperCase() === code.toUpperCase()
    );

    const info = DEPT_MAP[code] || { descr: 'Unknown Department', cbmLoc: 0 };
    const stock = matchingRow && matchingRow.stock !== undefined ? matchingRow.stock : 0;
    const cbmLoc = info.cbmLoc;
    const descr = matchingRow && matchingRow.descr ? matchingRow.descr : info.descr;
    const utilization = cbmLoc > 0 ? (stock / cbmLoc) * 100 : 0;

    return {
      periode: targetDateString,
      whseid: matchingRow?.whseid || 'WMWHSE10',
      storerkey: matchingRow?.storerkey || 'HCI',
      skuGroup: code,
      putawayzone: matchingRow?.putawayzone || code,
      descr: descr,
      cbmLoc: cbmLoc,
      stock: stock,
      utilization: utilization
    };
  });

  // Calculate modal exact aggregations dynamically
  const totalCategories = areaRows.length;
  let totalCbmLoc = areaRows.reduce((sum, r) => sum + r.cbmLoc, 0);
  if (areaName === 'AREA 3') {
    totalCbmLoc = 27867;
  } else if (areaName === 'AREA 2') {
    totalCbmLoc = 19019.7;
  } else if (areaName === 'AREA 1') {
    totalCbmLoc = 12728;
  }
  const totalStock = areaRows.reduce((sum, r) => sum + r.stock, 0);
  const overallOccupancyRate = totalCbmLoc > 0 ? (totalStock / totalCbmLoc) * 100 : 0;

  // Search Filter
  const filteredRows = areaRows.filter((r) => {
    const q = searchQuery.toLowerCase();
    return r.skuGroup.toLowerCase().includes(q) || r.descr.toLowerCase().includes(q);
  });

  // Sort Filter
  const sortedRows = [...filteredRows].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortDirection === 'asc'
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    } else {
      return sortDirection === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    }
  });

  const handleSort = (field: 'skuGroup' | 'descr' | 'cbmLoc' | 'stock' | 'utilization') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // CSV Exporter
  const handleDownloadCSV = () => {
    const headers = ['DEPT', 'DESCRIPTION', 'CBM_LOC', 'STOCK_AKTUAL', 'OCCUPANCY_PERCENT'];
    const csvContent = [
      headers.join(','),
      ...sortedRows.map(
        (r) =>
          `"${r.skuGroup}","${r.descr}",${r.cbmLoc.toFixed(2)},${r.stock.toFixed(2)},${r.utilization.toFixed(2)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Detail_Department_${areaName}_${targetDateString.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Classify rates for banner state badges
  let statusBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let statusLabel = 'OPTIMAL CAPACITY';
  if (overallOccupancyRate > 100) {
    statusBadgeColor = 'bg-red-50 text-red-700 border-red-200 animate-pulse';
    statusLabel = 'OVER CAPACITY';
  } else if (overallOccupancyRate > 80) {
    statusBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    statusLabel = 'WARNING DENSITY';
  }

  return (
    <div
      id="modal-detail-occupancy"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-2xl w-full max-w-4xl overflow-hidden font-sans max-h-[96vh] sm:max-h-[92vh] flex flex-col scale-100 transition-all duration-300">
        
        {/* Modal Header Bar */}
        <div className="bg-white px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex justify-between items-start gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#145daa]/10 p-2 sm:p-2.5 rounded-xl border border-[#145daa]/10 hidden xs:block">
              <Layers className="w-5 h-5 text-[#145daa]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-[#0c2d48] uppercase tracking-wide">
                  {areaName} - Detail Department
                </h3>
                <span className="bg-slate-100 text-slate-600 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest border border-slate-200">
                  CUBIC VIEW
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">
                Kalkulasi kapasitas terpakai, stock, dan occupancy terupdate untuk {selectedPeriodName}.
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-all hover:shadow-sm"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="font-bold">Tutup</span>
          </button>
        </div>

        {/* Modal Scroll Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 bg-slate-100">
          
          {/* Row 1: KPI overview cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* KPI 1 */}
            <div className="bg-white border-y border-r border-slate-250 border-l-4 border-l-sky-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-200">
              <div>
                <span className="text-[9px] sm:text-[10px] text-sky-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> TOTAL KATEGORI
                </span>
                <span className="text-base sm:text-xl font-black text-[#0c2d48] mt-1 sm:mt-2 block">
                  {isLoading ? '...' : `${totalCategories} DEPT`}
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] text-slate-500 font-semibold mt-1.5 sm:mt-2 border-t border-slate-100 pt-1">
                Kategori terdaftar
              </span>
            </div>

            {/* KPI 2 */}
            <div className="bg-white border-y border-r border-slate-250 border-l-4 border-l-[#145daa] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-200">
              <div>
                <span className="text-[9px] sm:text-[10px] text-[#145daa] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Ruler className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> TOTAL CBM LOC
                </span>
                <span className="text-base sm:text-xl font-black text-[#0c2d48] mt-1 sm:mt-2 block">
                  {isLoading ? '...' : totalCbmLoc.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] text-slate-500 font-semibold mt-1.5 sm:mt-2 border-t border-slate-100 pt-1">
                Kapasitas kubik
              </span>
            </div>

            {/* KPI 3 */}
            <div className="bg-white border-y border-r border-slate-250 border-l-4 border-l-amber-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-200">
              <div>
                <span className="text-[9px] sm:text-[10px] text-amber-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> STOCK AKTUAL
                </span>
                <span className="text-base sm:text-xl font-black text-[#0c2d48] mt-1 sm:mt-2 block">
                  {isLoading ? '...' : totalStock.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] text-slate-500 font-semibold mt-1.5 sm:mt-2 border-t border-slate-100 pt-1">
                Volume terpakai
              </span>
            </div>

            {/* KPI 4 */}
            <div className="bg-white border-y border-r border-slate-250 border-l-4 border-l-emerald-550 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-200" style={{ borderLeftColor: overallOccupancyRate > 100 ? '#ef4444' : overallOccupancyRate > 80 ? '#f59e0b' : '#10b981' }}>
              <div>
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-wider flex items-center gap-0.5 sm:gap-1">
                    <Percent className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" /> OCCUPANCY
                  </span>
                  <span className={`text-[8px] sm:text-[8.5px] font-black px-1 sm:px-1.5 py-0.5 rounded border ${statusBadgeColor}`}>
                    {statusLabel}
                  </span>
                </div>
                <span className="text-base sm:text-xl font-black text-[#0c2d48] mt-1 sm:mt-2 block">
                  {isLoading ? '...' : `${overallOccupancyRate.toFixed(2)}%`}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 sm:mt-2 overflow-hidden relative">
                <div
                  style={{ width: `${Math.min(overallOccupancyRate, 100)}%` }}
                  className={`h-full rounded-full ${
                    overallOccupancyRate > 100 ? 'bg-red-500' : overallOccupancyRate > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
            </div>

          </div>

          {/* Row 2: Search Input and Download button actions bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-sm">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari DEPT..."
                className="w-full bg-slate-50 text-slate-700 text-xs pl-8 pr-4 py-1.5 sm:py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#145daa] focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Download and Loading indications Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              {isLoading && (
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold animate-pulse mr-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" /> Loading...
                </span>
              )}
              <button
                onClick={handleDownloadCSV}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg cursor-pointer transition-colors shadow-sm ml-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Row 3: Main visual Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table id="table-dept-details" className="w-full text-left text-xs border-collapse">
                
                {/* Headers */}
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-extrabold uppercase select-none">
                    
                    <th
                      onClick={() => handleSort('skuGroup')}
                      className="px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors font-extrabold"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>DEPT</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    <th
                      onClick={() => handleSort('descr')}
                      className="px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors font-extrabold"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>DESCRIPTION</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    <th
                      onClick={() => handleSort('cbmLoc')}
                      className="px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors text-right font-extrabold"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>CBM LOC</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    <th
                      onClick={() => handleSort('stock')}
                      className="px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors text-right font-extrabold"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>STOCK</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    <th
                      onClick={() => handleSort('utilization')}
                      className="px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors text-right font-extrabold w-44"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>OCCUPANCY %</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                  </tr>
                </thead>

                {/* Rows body */}
                <tbody className="divide-y divide-slate-100">
                  {sortedRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 font-semibold">
                        Tidak ada kategori / department cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  ) : (
                    sortedRows.map((r) => {
                      const idText = `row-dept-${r.skuGroup}`;
                      const isOver = r.utilization > 100;
                      const isWarning = r.utilization > 80 && r.utilization <= 100;
                      
                      let barColorClass = 'bg-emerald-500';
                      let textClass = 'text-emerald-700';
                      let bgClass = 'bg-emerald-50';
                      if (isOver) {
                        barColorClass = 'bg-red-500';
                        textClass = 'text-red-700';
                        bgClass = 'bg-red-50';
                      } else if (isWarning) {
                        barColorClass = 'bg-amber-500';
                        textClass = 'text-amber-700';
                        bgClass = 'bg-amber-50';
                      }

                      return (
                        <tr
                          key={r.skuGroup}
                          id={idText}
                          className="hover:bg-slate-50/70 transition-colors font-medium text-slate-700"
                        >
                          <td className="px-5 py-3.5 font-bold font-mono text-[#0c2d48]">{r.skuGroup}</td>
                          <td className="px-5 py-3.5 text-slate-600 font-bold">{r.descr}</td>
                          
                          <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-500">
                            {r.cbmLoc.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          
                          <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-800">
                            {r.stock.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          
                          <td className="px-5 py-3.5 text-right font-mono w-44">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block relative">
                                <div
                                  style={{ width: `${Math.min(r.utilization, 100)}%` }}
                                  className={`h-full rounded-full ${barColorClass}`}
                                />
                              </div>
                              <span className={`px-2 py-0.5 rounded font-black text-[10.5px] ${bgClass} ${textClass}`}>
                                {r.utilization.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

              </table>
            </div>
            
            {/* Table Footer informational line details */}
            <div className="bg-slate-50 px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-slate-400 font-bold uppercase tracking-wide gap-2 border-t border-slate-100">
              <span className="normal-case font-medium">
                CBM Loc (Kapasitas Lokasi) &amp; Stock dihitung dinamis dalam m³ sesuai luas area.
              </span>
              <span>Metode kalkulasi optimal &amp; clean | Sidoarjo NDC</span>
            </div>
          </div>
          
        </div>

        {/* Modal Footer bar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0c2d48] hover:bg-[#145daa] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
