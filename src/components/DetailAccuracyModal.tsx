import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DetailAccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
  processType: 'picking' | 'putaway' | 'movePressing' | 'all';
  selectedPeriodName: string;
  pickingRows: any[];
  putawayRows: any[];
  movePressingRows: any[];
  defaultArea?: 'AREA 1' | 'AREA 2' | 'AREA 3';
}

const AISLE_PIC_MAP: Record<string, string> = {
  '18': 'SUDARMONO',
  '19': 'SUDARMONO',
  '20': 'TIRMIDHI',
  '21': 'FEBRY',
  '22': 'FEBRY',
  '23': 'JEFRISON',
  '24': 'JEFRISON',
  '25': 'YUSUF',
  '26': 'YUSUF & HERI',
  '27': 'HERI',
  '28': 'GIGIH',
  '29': 'EDWIN',
  '30': 'RIZALI',
  '31': 'JULI',
  '32': 'ROMI',
  '33': 'YUSUFI',
};

const AREA_LORONGS: Record<string, string[]> = {
  'AREA 1': ['18', '19', '20', '21', '22', '23', '24'],
  'AREA 2': ['25', '26', '27', '28', '29'],
  'AREA 3': ['30', '31', '32', '33'],
};

export default function DetailAccuracyModal({
  isOpen,
  onClose,
  processType,
  selectedPeriodName,
  pickingRows,
  putawayRows,
  movePressingRows,
  defaultArea
}: DetailAccuracyModalProps) {
  const [activeArea, setActiveArea] = useState<'AREA 1' | 'AREA 2' | 'AREA 3'>('AREA 1');

  React.useEffect(() => {
    if (isOpen && defaultArea) {
      setActiveArea(defaultArea);
    }
  }, [isOpen, defaultArea]);

  if (!isOpen) return null;

  // Process Title / Name
  const processLabel = (() => {
    if (processType === 'picking') return 'PICKING';
    if (processType === 'putaway') return 'PUTAWAY';
    if (processType === 'movePressing') return 'MOVE/PRESSING';
    return 'AKUMULASI SEMUA PROSES (ACCUMULATED)';
  })();

  const countLabel = (() => {
    if (processType === 'movePressing') return 'TOTAL ARTIKEL';
    if (processType === 'all') return 'TOTAL TRANSAKSI';
    return 'TOTAL LOKASI';
  })();

  // Normalizer helper (exact duplicate to align with parent)
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
    s = s.replace(/\b0+(\d+)/g, '$1');
    return s.replace(/\s+/g, ' ');
  };

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

  const getHM1DateString = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length < 3) return '';
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    
    const monthIndices: { [key: string]: number } = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    let monthIdx = -1;
    for (const k of Object.keys(monthIndices)) {
      if (monthStr.startsWith(k)) {
        monthIdx = monthIndices[k];
        break;
      }
    }
    if (monthIdx === -1 || isNaN(day) || isNaN(year)) return '';
    
    const d = new Date(year, monthIdx, day);
    d.setDate(d.getDate() - 1); // Subtract 1 day for H-1
    
    const fullMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${fullMonths[d.getMonth()]} ${d.getFullYear()}`;
  };

  const targetDateString = getTargetDateStr(selectedPeriodName);
  const hm1DateStr = getHM1DateString(targetDateString);
  const normHM1Target = normalizeDate(hm1DateStr);

  // Active sheets
  const activeRows = (() => {
    if (processType === 'picking') return pickingRows;
    if (processType === 'putaway') return putawayRows;
    return movePressingRows;
  })();

  // Filter for H-1 Date
  const dateFiltered = (activeRows || []).filter(
    (r) => r.date && normalizeDate(r.date) === normHM1Target
  );

  const pickingFiltered = (pickingRows || []).filter(
    (r) => r.date && normalizeDate(r.date) === normHM1Target
  );
  const putawayFiltered = (putawayRows || []).filter(
    (r) => r.date && normalizeDate(r.date) === normHM1Target
  );
  const moveFiltered = (movePressingRows || []).filter(
    (r) => r.date && normalizeDate(r.date) === normHM1Target
  );

  // Helper to extract stats for a single lorong
  const getLorongStats = (lor: string) => {
    if (processType === 'all') {
      const pMatch = pickingFiltered.find((r) => r.lorong && r.lorong.trim() === lor);
      const puMatch = putawayFiltered.find((r) => r.lorong && r.lorong.trim() === lor);
      const mMatch = moveFiltered.find((r) => r.lorong && r.lorong.trim() === lor);

      let totalCount = 0;
      let hit = 0;
      let miss = 0;

      [pMatch, puMatch, mMatch].forEach((match) => {
        if (match) {
          const tc = match.totalCount || 0;
          const m = match.miss || 0;
          let h = match.hit !== undefined ? match.hit : (tc - m);
          if (h < 0) h = 0;

          totalCount += tc;
          hit += h;
          miss += m;
        }
      });

      const totalChecks = hit + miss;
      const accuracy = totalChecks > 0 ? (hit / totalChecks) * 100 : 100.00;

      return { totalCount, hit, miss, accuracy };
    } else {
      // Find matching row for lorong
      const match = dateFiltered.find((r) => r.lorong && r.lorong.trim() === lor);
      if (!match) {
        return { totalCount: 0, hit: 0, miss: 0, accuracy: 100.00 };
      }
      const totalCount = match.totalCount || 0;
      const miss = match.miss || 0;
      // Calculate hit as specified: hit = totalCount - miss
      let hit = totalCount - miss;
      if (hit < 0) hit = 0;
      const totalChecks = hit + miss;
      const accuracy = totalChecks > 0 ? (hit / totalChecks) * 100 : 100.00;
      return { totalCount, hit, miss, accuracy };
    }
  };

  // Build grid data for currently active area
  const activeLorongsList = AREA_LORONGS[activeArea];
  const gridRows = activeLorongsList.map((lor) => {
    const pic = AISLE_PIC_MAP[lor] || 'N/A';
    const stats = getLorongStats(lor);
    return {
      pic,
      lorong: lor,
      ...stats,
    };
  });

  // Calculate Area Totals
  const areaTotalCount = gridRows.reduce((acc, r) => acc + r.totalCount, 0);
  const areaTotalHit = gridRows.reduce((acc, r) => acc + r.hit, 0);
  const areaTotalMiss = gridRows.reduce((acc, r) => acc + r.miss, 0);
  const areaTotalChecks = areaTotalHit + areaTotalMiss;
  const areaAccuracy = areaTotalChecks > 0 ? (areaTotalHit / areaTotalChecks) * 100 : 100.00;

  // Calculate Grand Totals (includes Area 1, 2, and 3 altogether for H-1 date!)
  const allLorongs = [
    ...AREA_LORONGS['AREA 1'],
    ...AREA_LORONGS['AREA 2'],
    ...AREA_LORONGS['AREA 3'],
  ];
  const grandTotalCount = allLorongs.reduce((acc, lor) => acc + getLorongStats(lor).totalCount, 0);
  const grandTotalHit = allLorongs.reduce((acc, lor) => acc + getLorongStats(lor).hit, 0);
  const grandTotalMiss = allLorongs.reduce((acc, lor) => acc + getLorongStats(lor).miss, 0);
  const grandTotalChecks = grandTotalHit + grandTotalMiss;
  const grandAccuracy = grandTotalChecks > 0 ? (grandTotalHit / grandTotalChecks) * 100 : 100.00;

  const areaRangeLabel = (() => {
    if (activeArea === 'AREA 1') return '18 - 24';
    if (activeArea === 'AREA 2') return '25 - 29';
    return '30 - 33';
  })();

  return (
    <div
      id="modal-detail-accuracy"
      className="fixed inset-0 bg-[#071325]/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-2xl overflow-hidden font-sans scale-100 transition-all duration-300 max-h-[96vh] sm:max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-white px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex justify-between items-center relative gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse flex-shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-black text-[#0c2d48] uppercase tracking-wide">
                DETAIL ACCURACY: {processLabel}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold tracking-tight">
                Aisle-based Accuracy Breakdown &bull; {hm1DateStr || 'H-1 Data'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Areas Tabs Selection Bar */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-150 flex justify-between items-center bg-slate-50/50 gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {['AREA 1', 'AREA 2', 'AREA 3'].map((areaName) => {
              const active = activeArea === areaName;
              return (
                <button
                  key={areaName}
                  onClick={() => setActiveArea(areaName as any)}
                  className={`px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-black rounded-md transition-all uppercase tracking-wider cursor-pointer ${
                    active
                      ? 'bg-[#0c2d48] text-white shadow-sm'
                      : 'text-slate-500 hover:text-[#0c2d48]'
                  }`}
                >
                  {areaName}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 px-2 sm:px-2.5 py-1 rounded border border-emerald-100/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-700 tracking-wide uppercase">
              Lorong
            </span>
          </div>
        </div>

        {/* Table Body container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-100">
          
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table id="table-accuracy-aisles" className="w-full text-left text-xs border-collapse">
                
                {/* Headers */}
                <thead>
                  <tr className="bg-[#1b55a1] text-white uppercase font-black text-[10.5px] tracking-wider select-none border-b border-slate-200">
                    <th className="px-5 py-3 font-extrabold">AREA / PIC</th>
                    <th className="px-5 py-3 font-extrabold">LORONG</th>
                    <th className="px-5 py-3 font-extrabold text-center">{countLabel}</th>
                    <th className="px-5 py-3 font-extrabold text-center">HIT</th>
                    <th className="px-5 py-3 font-extrabold text-center">MISS</th>
                    <th className="px-5 py-3 font-extrabold text-right">ACCURACY</th>
                  </tr>
                </thead>

                {/* Body rows */}
                <tbody className="divide-y divide-slate-100 font-sans">
                  
                  {/* Category description row */}
                  <tr className="bg-slate-50 border-b border-slate-100 font-extrabold text-slate-500 text-[10px] uppercase tracking-wider">
                    <td colSpan={6} className="px-5 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>{activeArea} DETAIL BREAKDOWN</span>
                      </div>
                    </td>
                  </tr>

                  {/* List of Lorongs */}
                  {gridRows.map((r) => {
                    const accuracyStr = r.accuracy.toFixed(2);
                    return (
                      <tr
                        key={r.lorong}
                        className="hover:bg-slate-50/50 transition-colors font-medium text-slate-700 text-xs"
                      >
                        <td className="px-5 py-3 font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-l-2 border-b-2 border-slate-200 rounded-bl ml-2 block -mt-1" />
                          <span>{r.pic}</span>
                        </td>
                        <td className="px-5 py-3 font-bold text-slate-500">
                          Lorong {r.lorong}
                        </td>
                        <td className="px-5 py-3 text-center font-mono font-bold text-slate-500">
                          {r.totalCount}
                        </td>
                        <td className="px-5 py-3 text-center font-mono font-bold text-slate-800">
                          {r.hit}
                        </td>
                        <td className="px-5 py-3 text-center font-mono font-bold text-red-500">
                          {r.miss}
                        </td>
                        <td className={`px-5 py-3 text-right font-mono font-black ${
                          r.accuracy < 99 ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          {accuracyStr}%
                        </td>
                      </tr>
                    );
                  })}

                  {/* Subtotal Area Row */}
                  <tr className="bg-slate-50 font-black text-[#0c2d48] text-xs uppercase tracking-wide border-t border-slate-200">
                    <td className="px-5 py-3 font-black">
                      {activeArea} Total
                    </td>
                    <td className="px-5 py-3 font-mono font-black text-slate-500">
                      {areaRangeLabel}
                    </td>
                    <td className="px-5 py-3 text-center font-mono font-black bg-slate-100/40">
                      {areaTotalCount}
                    </td>
                    <td className="px-5 py-3 text-center font-mono font-black bg-slate-100/40">
                      {areaTotalHit}
                    </td>
                    <td className="px-5 py-3 text-center font-mono font-black text-red-600 bg-slate-100/40">
                      {areaTotalMiss}
                    </td>
                    <td className={`px-5 py-3 text-right font-mono font-black ${
                      areaAccuracy < 99 ? 'text-red-600 bg-red-50/50' : 'text-emerald-600 bg-emerald-50/40'
                    }`}>
                      {areaAccuracy.toFixed(2)}%
                    </td>
                  </tr>

                  {/* Spacer or empty row */}
                  <tr className="bg-white hover:bg-white h-2 pointer-events-none">
                    <td colSpan={6} className="blank-spacer-cell p-0" />
                  </tr>

                  {/* Grand Total Row */}
                  <tr className="bg-blue-50/45 font-black text-[#0c2d48] text-xs uppercase tracking-wider border-t-2 border-b-2 border-blue-100">
                    <td className="px-5 py-3.5 font-black">
                      GRAND TOTAL
                    </td>
                    <td className="px-5 py-3.5">
                      {/* Blank under Lorong */}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-black text-blue-900 bg-blue-100/15">
                      {grandTotalCount}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-black text-blue-900 bg-blue-100/15">
                      {grandTotalHit}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-black text-red-600 bg-blue-100/15">
                      {grandTotalMiss}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-black text-blue-900 bg-blue-100/20">
                      {grandAccuracy.toFixed(2)}%
                    </td>
                  </tr>

                </tbody>

              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer bar */}
        <div className="bg-slate-50 px-6 py-4.5 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-extrabold tracking-wide uppercase">
            Target: &ge; 99.00% Coverage &bull; NDC SIDOARJO
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0c2d48] hover:bg-[#145daa] text-white text-xs font-extrabold rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
