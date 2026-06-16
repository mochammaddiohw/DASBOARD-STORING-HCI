import React, { useState, useEffect } from 'react';
import { X, TrendingUp, AlertTriangle, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { DailyPickZoneRow, FALLBACK_PICK_ZONE_ROWS } from './fallback_pickzone';
import { ALL_PERIODS } from '../mockData';

interface CasesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseName: string;
  selectedPeriodName?: string;
}


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

export default function CasesDetailModal({ 
  isOpen, 
  onClose, 
  warehouseName,
  selectedPeriodName = ALL_PERIODS[0]
}: CasesDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'ACC GROUP' | 'NON ACC' | 'AREA 2'>('ACC GROUP');
  const [records, setRecords] = useState<DailyPickZoneRow[]>(FALLBACK_PICK_ZONE_ROWS);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchLiveSheetData = async (manual = false) => {
    if (manual) setIsRefreshing(true);
    else setLoading(true);

    try {
      // Fetching specifically from MASTER DASHBOARD using gviz csv output
      const url = `https://docs.google.com/spreadsheets/d/1mklcpbndaiHpLRArmG2CgGqnRgFK9iZ4XGygirFlWWk/gviz/tq?tqx=out:csv&sheet=MASTER%20DASHBOARD`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load sheet');
      
      const csvText = await response.text();
      const lines = csvText.replace(/\r/g, '').split('\n');
      if (lines.length <= 2) throw new Error('Insufficient sheet lines');

      const parsedRecords: DailyPickZoneRow[] = [];
      
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cells = splitCSVLine(line);
        if (cells.length < 34) continue;

        const dateStr = cells[7];
        // Ensure date is valid and is not a header row
        if (dateStr && dateStr !== 'Tanggal' && dateStr !== 'TANGGAL' && !dateStr.includes('Target')) {
          const cleanPercent = (s: string) => {
            if (!s) return null;
            const parsed = parseFloat(s.replace(/%/g, '').trim());
            return isNaN(parsed) ? null : parsed;
          };

          const accGroup = cleanPercent(cells[11]);
          const nonAcc = cleanPercent(cells[20]);
          const area2 = cleanPercent(cells[29]);

          if (accGroup !== null || nonAcc !== null || area2 !== null) {
            parsedRecords.push({
              date: dateStr,
              accGroup,
              nonAcc,
              area2,
              accBuffer: cleanPercent(cells[13]),
              nonAccBuffer: cleanPercent(cells[22]),
              area2Buffer: cleanPercent(cells[31]),
              accTarget: cleanPercent(cells[14]) || 70,
              nonAccTarget: cleanPercent(cells[23]) || 70,
              area2Target: cleanPercent(cells[32]) || 70,
              accStatus: cells[15] || 'Tidak Target',
              nonAccStatus: cells[24] || 'Tidak Target',
              area2Status: cells[33] || 'Tidak Target'
            });
          }
        }
      }

      if (parsedRecords.length > 0) {
        setRecords(parsedRecords);
      } else {
        setRecords(FALLBACK_PICK_ZONE_ROWS);
      }
    } catch (error) {
      console.warn('Error fetching live pickzone data, using premium fallback', error);
      setRecords(FALLBACK_PICK_ZONE_ROWS);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveSheetData();
    }
  }, [isOpen]);

  // Extract selected period target date
  const getTargetDateStr = (periodName: any): string => {
    if (!periodName || typeof periodName !== 'string') {
      return '6 Jun 2026';
    }
    const parenthesizedDate = periodName.match(/\(([^)]+)\)/);
    const cleanName = parenthesizedDate ? parenthesizedDate[1] : periodName;
    if (!cleanName || typeof cleanName !== 'string') {
      return '6 Jun 2026';
    }
    
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

  // Filter is limited to maximum 1 month back from selected date
  const filteredRecords = React.useMemo(() => {
    const parseToDate = (str: any): Date => {
      if (!str || typeof str !== 'string') {
        return new Date('1970-01-01');
      }
      const clean = str
        .replace(/Juni/gi, 'June')
        .replace(/Jun/gi, 'June')
        .replace(/Mei/gi, 'May')
        .replace(/May/gi, 'May');
      return new Date(clean);
    };

    const targetDate = parseToDate(targetDateString);
    const oneMonthAgo = new Date(targetDate);
    // Move back by exactly 1 month
    oneMonthAgo.setMonth(targetDate.getMonth() - 1);

    return records.filter((r) => {
      const rDate = parseToDate(r?.date);
      return rDate >= oneMonthAgo && rDate <= targetDate;
    });
  }, [records, targetDateString]);

  // Calculate dynamic average for active tab using filtered records windows
  const activeAvg = (() => {
    const validVals = filteredRecords.map(r => {
      return activeTab === 'ACC GROUP' ? r.accGroup : activeTab === 'NON ACC' ? r.nonAcc : r.area2;
    }).filter((v): v is number => v !== null);

    if (validVals.length === 0) return 0;
    const sum = validVals.reduce((acc, curr) => acc + curr, 0);
    return Math.floor(sum / validVals.length);
  })();

  // Prepare custom line chart points
  const drawWidth = 840;
  const drawHeight = 250;
  const padLeft = 45;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 35;
  const cWidth = drawWidth - padLeft - padRight;
  const cHeight = drawHeight - padTop - padBottom;

  const points = filteredRecords.map((r, idx) => {
    const val = activeTab === 'ACC GROUP' ? r.accGroup : activeTab === 'NON ACC' ? r.nonAcc : r.area2;
    const numVal = val !== null ? val : 0;
    const x = padLeft + (idx / Math.max(1, filteredRecords.length - 1)) * cWidth;
    const y = padTop + cHeight - (numVal / 100) * cHeight;
    return { x, y, val: numVal, date: r.date };
  });

  // Target line is at 70% always
  const targetY = padTop + cHeight - (70 / 100) * cHeight;

  // Blue picking line path
  const linePathD = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const formatShortDate = (dateStr: string): string => {
    return dateStr.replace(/\s*2026\s*$/, '').trim(); // "2 May 2026" => "2 May"
  };

  const showXLabel = (dateStr: string): boolean => {
    const lower = dateStr.toLowerCase();
    const match = lower.match(/^(\d+)/);
    if (match) {
      const dayNum = parseInt(match[1], 10);
      // Clean uncluttered dynamic date labels for even numbers or start/end/middle bounds
      return dayNum % 2 === 0 || dayNum === 1 || dayNum === 15 || dayNum === 31;
    }
    return false;
  };

  // Helper to calculate daily trend using filtered records list
  const getTrendData = (idx: number) => {
    if (idx === 0) return { text: '--', type: 'none', raw: 0 };
    
    const currVal = activeTab === 'ACC GROUP' ? filteredRecords[idx].accGroup : activeTab === 'NON ACC' ? filteredRecords[idx].nonAcc : filteredRecords[idx].area2;
    const prevVal = activeTab === 'ACC GROUP' ? filteredRecords[idx - 1].accGroup : activeTab === 'NON ACC' ? filteredRecords[idx - 1].nonAcc : filteredRecords[idx - 1].area2;
    
    if (currVal === null || prevVal === null) return { text: '--', type: 'none', raw: 0 };
    
    const diff = currVal - prevVal;
    if (diff > 0) return { text: `+${diff}%`, type: 'up', raw: diff };
    if (diff < 0) return { text: `${diff}%`, type: 'down', raw: diff };
    return { text: '0%', type: 'neutral', raw: 0 };
  };

  if (!isOpen) return null;

  return (
    <div id="modal-pickzone-detail" className="fixed inset-0 bg-[#0c2d48]/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      {/* Outer Card block */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-2xl w-full max-w-5xl overflow-hidden font-sans max-h-[96vh] sm:max-h-[94vh] flex flex-col">
        
        {/* Header bar layout */}
        <div className="bg-[#0b2447] text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0 border-b border-sky-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-400/20 hidden xs:block">
              <TrendingUp className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wider font-sans">ZONA PICKING & BUFFER AREA</span>
                <span className="bg-royal-blue text-[8px] sm:text-[9px] font-extrabold text-sky-200 uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded bg-sky-500/20 border border-sky-400/30">
                  DAILY
                </span>
                {isRefreshing && (
                  <RefreshCw className="w-3 h-3 text-sky-400 animate-spin" />
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">Pencapaian % zona picking vs buffer zone per hari berdasarkan target 70%.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <button
              onClick={() => fetchLiveSheetData(true)}
              title="Refresh Data"
              className="p-1 sm:p-1.5 text-slate-400 hover:text-white border border-slate-700/60 rounded bg-transparent hover:bg-slate-800 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded bg-transparent px-2.5 py-1.5 cursor-pointer transition-colors text-[10px] sm:text-xs flex items-center gap-1 font-bold"
            >
              <X className="w-3.5 h-3.5" /> Tutup
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 min-h-[300px] sm:min-h-[400px] flex flex-col justify-center items-center gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider">Mengunduh Data Live Picking Zone...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 bg-slate-100">
            
            {/* Tab controls & KPI stats layout */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/85 shadow-sm">
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
                {(['ACC GROUP', 'NON ACC', 'AREA 2'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#0c2d48] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* KPI Boxes */}
              <div className="flex gap-4 self-stretch md:self-auto">
                <div className="flex-1 md:flex-initial bg-slate-50 rounded-lg border border-slate-200 px-4 py-1.5 text-center md:text-right min-w-[120px]">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">TARGET AVAILABILITY</span>
                  <div className="text-sm font-black text-slate-800 mt-0.5">70%</div>
                </div>
                <div className="flex-1 md:flex-initial bg-sky-50/50 rounded-lg border border-sky-100 px-4 py-1.5 text-center md:text-right min-w-[140px]">
                  <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider">AVERAGE {activeTab}</span>
                  <div className="text-sm font-black text-sky-700 mt-0.5">{activeAvg}%</div>
                </div>
              </div>
            </div>

            {/* SVG Line Chart Viewport Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  PICK ZONE AREA {activeTab === 'AREA 2' ? '2' : '1'} ({activeTab === 'NON ACC' ? 'NON GROUP' : activeTab})
                </h4>
                {/* Legends */}
                <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    <span>Pick Zone</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] font-black text-red-500">✕</span>
                    <span>TARGET</span>
                  </div>
                </div>
              </div>

              {/* SVG wrapper for proportion scale */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                  <svg viewBox={`0 0 ${drawWidth} ${drawHeight}`} className="w-full h-auto select-none overflow-visible">
                    
                    {/* Gridlines of Y values */}
                    {[0, 25, 50, 75, 100].map((g, idx) => {
                      const y = padTop + cHeight - (g / 100) * cHeight;
                      return (
                        <g key={`ygrid-${idx}`}>
                          <line
                            x1={padLeft}
                            y1={y}
                            x2={drawWidth - padRight}
                            y2={y}
                            stroke="#f1f5f9"
                            strokeWidth={1.5}
                            strokeDasharray={g === 0 ? "0" : "5 5"}
                          />
                          <text
                            x={padLeft - 10}
                            y={y + 3.5}
                            className="text-[9.5px] font-bold fill-slate-400 font-mono text-right"
                            textAnchor="end"
                          >
                            {g}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Red Target line at 70% */}
                    <line
                      x1={padLeft}
                      y1={targetY}
                      x2={drawWidth - padRight}
                      y2={targetY}
                      stroke="#f87171"
                      strokeWidth={1.5}
                      strokeDasharray="1 1"
                    />
                    
                    {/* Red "X" target markers */}
                    {points.map((p, idx) => (
                      <g key={`targ-x-${idx}`} transform={`translate(${p.x}, ${targetY})`}>
                        <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#f87171" strokeWidth={1.5} />
                        <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="#f87171" strokeWidth={1.5} />
                      </g>
                    ))}

                    {/* Blue line path */}
                    <path
                      d={linePathD}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />

                    {/* Data circle points & text values */}
                    {points.map((p, idx) => {
                      return (
                        <g key={`p-${idx}`}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={3.5}
                            fill="#3b82f6"
                            stroke="#ffffff"
                            strokeWidth={1.5}
                          />
                          {/* Value text above dot */}
                          <text
                            x={p.x}
                            y={p.y - 8}
                            className="text-[9px] font-extrabold fill-slate-700 font-sans"
                            textAnchor="middle"
                          >
                            {p.val}%
                          </text>
                        </g>
                      );
                    })}

                    {/* X-axis line & ShortDate Ticks */}
                    <line
                      x1={padLeft}
                      y1={drawHeight - padBottom}
                      x2={drawWidth - padRight}
                      y2={drawHeight - padBottom}
                      stroke="#e2e8f0"
                      strokeWidth={1.5}
                    />

                    {points.map((p, idx) => {
                      if (showXLabel(p.date)) {
                        return (
                          <g key={`x-tick-${idx}`}>
                            <line
                              x1={p.x}
                              y1={drawHeight - padBottom}
                              x2={p.x}
                              y2={drawHeight - padBottom + 4}
                              stroke="#cbd5e1"
                              strokeWidth={1.5}
                            />
                            <text
                              x={p.x}
                              y={drawHeight - padBottom + 15}
                              className="text-[9px] font-bold fill-slate-500 font-sans"
                              textAnchor="middle"
                            >
                              {formatShortDate(p.date)}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Daily stats table list summary */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-[#0c2d48] text-white text-[10px] font-bold uppercase tracking-wider sticky top-0 z-25">
                      <th className="px-5 py-3">TANGGAL</th>
                      <th className="px-5 py-3 text-center">PICK ZONE LOC</th>
                      <th className="px-5 py-3 text-center">TREND DAILY</th>
                      <th className="px-5 py-3 text-center">BUFFER ZONE</th>
                      <th className="px-5 py-3 text-center">TARGET</th>
                      <th className="px-5 py-3 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-100 font-sans font-medium text-slate-700">
                    {filteredRecords.map((r, idx) => {
                      const val = activeTab === 'ACC GROUP' ? r.accGroup : activeTab === 'NON ACC' ? r.nonAcc : r.area2;
                      const bufferVal = activeTab === 'ACC GROUP' ? r.accBuffer : activeTab === 'NON ACC' ? r.nonAccBuffer : r.area2Buffer;
                      const statusVal = activeTab === 'ACC GROUP' ? r.accStatus : activeTab === 'NON ACC' ? r.nonAccStatus : r.area2Status;
                      
                      const trend = getTrendData(idx);
                      const isTargetMet = val !== null && val >= 70;

                      return (
                        <tr key={idx} className="hover:bg-slate-50/75 transition-all">
                          {/* Date */}
                          <td className="px-5 py-2.5 font-bold text-slate-800">
                            {r.date}
                          </td>
                          {/* Pick Zone loc */}
                          <td className="px-5 py-2.5 text-center">
                            {val !== null ? (
                              <span className="inline-block bg-[#f39c12] text-white font-extrabold text-[11px] px-3 py-1 rounded w-16 text-center">
                                {val}%
                              </span>
                            ) : (
                              <span className="text-slate-400 font-bold">-</span>
                            )}
                          </td>
                          {/* Trend Daily */}
                          <td className="px-5 py-2.5 text-center">
                            {trend.type === 'up' && (
                              <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                <span className="text-xs">↑</span> {trend.text}
                              </span>
                            )}
                            {trend.type === 'down' && (
                              <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                <span className="text-xs">↓</span> {trend.text}
                              </span>
                            )}
                            {trend.type === 'neutral' && (
                              <span className="inline-flex items-center gap-0.5 bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                {trend.text}
                              </span>
                            )}
                            {trend.type === 'none' && (
                              <span className="text-slate-400 font-extrabold">- -</span>
                            )}
                          </td>
                          {/* Buffer Zone */}
                          <td className="px-5 py-2.5 text-center text-slate-600 font-bold">
                            {bufferVal !== null ? `${bufferVal}%` : '-'}
                          </td>
                          {/* Target */}
                          <td className="px-5 py-2.5 text-center text-sky-600 font-bold font-mono">
                            70%
                          </td>
                          {/* Status */}
                          <td className="px-5 py-2.5 text-center block sm:table-cell">
                            {val !== null ? (
                              isTargetMet ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> TARGET
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> TIDAK TARGET
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 font-bold">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hint text footer info block */}
            <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl flex items-start gap-2.5 text-[10.5px] text-slate-500 leading-normal">
              <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <span>Kalkulasi Trend membandingkan pencapaian persentase pick zone dengan hari operasional sebelumnya. Sidoarjo NDC | All Rights Reserved</span>
            </div>

          </div>
        )}
        
      </div>
    </div>
  );
}
