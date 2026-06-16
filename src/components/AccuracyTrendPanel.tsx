import React, { useState } from 'react';
import { AccuracyProcess, AccuracyTrend } from '../types';
import { Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export interface AreaAccuracyCombined {
  areaName: string;
  hit: number;
  miss: number;
  total: number;
  accuracy: number;
}

interface AccuracyTrendPanelProps {
  overallAccuracy: number;
  processes: {
    picking: AccuracyProcess;
    putaway: AccuracyProcess;
    movePressing: AccuracyProcess;
  };
  trends: AccuracyTrend[];
  onClickProcess?: (type: 'picking' | 'putaway' | 'movePressing') => void;
  areaAccuracyList?: AreaAccuracyCombined[];
  onClickArea?: (areaName: 'AREA 1' | 'AREA 2' | 'AREA 3') => void;
}

export default function AccuracyTrendPanel({ overallAccuracy, processes, trends, onClickProcess, areaAccuracyList, onClickArea }: AccuracyTrendPanelProps) {
  const [showTrendChart, setShowTrendChart] = useState(true);

  // 7 Days Trend Calculations
  const chartW = 340;
  const chartH = 125;
  const pLeft = 32;
  const pRight = 16;
  const pTop = 15;
  const pBottom = 18;

  const usableWidth = chartW - pLeft - pRight;
  const usableHeight = chartH - pTop - pBottom;

  const accuracies = (trends || []).map(t => t.accuracy);
  const minAcc = Math.max(90, Math.min(...accuracies, 99.0) - 0.2); 
  const maxAcc = 100.0;
  const range = maxAcc - minAcc <= 0 ? 1 : maxAcc - minAcc;

  const pList = (trends || []).map((t, idx) => {
    const x = pLeft + (idx / Math.max(1, trends.length - 1)) * usableWidth;
    const y = pTop + usableHeight - ((t.accuracy - minAcc) / range) * usableHeight;
    return { x, y, accuracy: t.accuracy, label: t.timeLabel };
  });

  const pathD = pList.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const firstX = pList[0]?.x || pLeft;
  const lastX = pList[pList.length - 1]?.x || (chartW - pRight);
  const bottomY = pTop + usableHeight;
  const areaD = pList.length > 0 ? `${pathD} L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} L ${firstX.toFixed(1)} ${bottomY.toFixed(1)} Z` : '';

  const getRefY = (val: number) => {
    return pTop + usableHeight - ((val - minAcc) / range) * usableHeight;
  };

  // SVG parameters for circle
  const size = 94;
  const strokeWidth = 7;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;

  const smallSize = 56;
  const smallStrokeWidth = 4.5;
  const smallR = (smallSize - smallStrokeWidth) / 2;
  const smallCirc = 2 * Math.PI * smallR;

  // Render Single Circle
  const renderCircle = (percent: number, ratingSize: number, ratingStroke: number, ratingR: number, ratingCirc: number, color: string) => {
    const offset = ratingCirc - (percent / 100) * ratingCirc;
    return (
      <svg width={ratingSize} height={ratingSize} className="transform -rotate-90">
        <circle
          cx={ratingSize / 2}
          cy={ratingSize / 2}
          r={ratingR}
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth={ratingStroke}
        />
        <circle
          cx={ratingSize / 2}
          cy={ratingSize / 2}
          r={ratingR}
          fill="transparent"
          stroke={color}
          strokeWidth={ratingStroke}
          strokeDasharray={ratingCirc}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
    );
  };

  return (
    <div id="panel-accuracy" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between h-full font-sans transition-all duration-300">
      <div>
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start md:items-center gap-1.5 mb-3">
          <div>
            <h2 className="text-[13px] font-extrabold text-[#0c2d48] uppercase tracking-wider">
              3. MANAGE ACCURACY
            </h2>
            <p className="text-[9.5px] sm:text-[10px] text-slate-500 font-semibold leading-tight mt-0.5">
              *Perhitungan akurasi berdasarkan hasil audit transaksi pada tanggal sebelumnya.
            </p>
          </div>
          <div className="flex items-center gap-1 self-start sm:self-auto text-[9.5px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded shrink-0">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            TARGET &ge; 99%
          </div>
        </div>

        {/* Row/Grid: Accuracy Ring (Left) & Area Table (Right) */}
        <div id="accuracy-top-metrics-grid" className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4 items-stretch">
          {/* Big Accuracy Ring */}
          <div className="col-span-1 sm:col-span-4 flex flex-col items-center justify-center py-2.5 bg-[#f8fafc]/80 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex items-center justify-center">
              {renderCircle(overallAccuracy, size, strokeWidth, r, circ, '#10b981')}
              <div className="absolute text-center">
                <span className="text-sm font-black text-[#0c2d48] leading-none">
                  {overallAccuracy.toFixed(2)}%
                </span>
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block mt-0.5">
                  ACCURACY
                </span>
              </div>
            </div>
            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full mt-2.5 block shadow-2xs">
              TARGET TERCAPAI
            </span>
          </div>

          {/* Area Combined Table (Right) representing Image 2 */}
          <div className="col-span-1 sm:col-span-8 flex flex-col justify-center bg-[#f8fafc]/80 p-2.5 rounded-xl border border-slate-200 shadow-xs">
            {areaAccuracyList && areaAccuracyList.length > 0 ? (
              <div className="space-y-1.5">
                <div className="overflow-hidden rounded-lg border border-slate-200/90 shadow-sm">
                  <table className="w-full text-center border-collapse text-[9px]">
                    <thead>
                      <tr className="bg-[#0c2d48] text-white font-extrabold uppercase text-[8px] tracking-wider border-b border-sky-950 select-none">
                        <th className="py-2 px-1.5 text-left pl-2.5 font-black">AREA</th>
                        <th className="py-2 px-1 font-black">HIT</th>
                        <th className="py-2 px-1 font-black">MISS</th>
                        <th className="py-2 px-2 font-black text-right pr-2.5">% ACCURACY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areaAccuracyList.map((item) => {
                        const isTargetMet = item.accuracy >= 99;
                        return (
                          <tr
                            key={item.areaName}
                            onClick={() => onClickArea?.(item.areaName as any)}
                            className="hover:bg-sky-50 cursor-pointer active:scale-[0.995] border-b border-slate-100 font-sans font-bold text-[#0c2d48] bg-white transition-all duration-150 last:border-0 select-none"
                            title={`Klik untuk rincian lorong ${item.areaName}`}
                          >
                            <td className="py-2 px-1.5 text-left pl-2.5 font-extrabold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                              <div className="flex items-center gap-1.5 flex-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: item.areaName.includes('1') ? '#3b82f6' : item.areaName.includes('2') ? '#8b5cf6' : '#10b981' }} />
                                <span className="hover:underline hover:text-sky-700 transition-colors">{item.areaName}</span>
                              </div>
                            </td>
                            <td className="py-2 px-1">
                              <span className="font-mono text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-black">
                                {item.hit}
                              </span>
                            </td>
                            <td className="py-2 px-1">
                              <span className={`font-mono px-1 py-0.5 rounded ${
                                item.miss > 0 
                                  ? 'text-rose-600 bg-rose-50 font-black' 
                                  : 'text-slate-400 font-medium bg-slate-50'
                              }`}>
                                {item.miss}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-right pr-2.5">
                              <span className={`inline-block font-mono font-black text-[9px] px-1.5 py-0.5 rounded ${
                                isTargetMet 
                                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/50' 
                                  : 'text-rose-700 bg-rose-50 border border-rose-200/55'
                              }`}>
                                {item.accuracy.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="text-[8px] font-bold text-slate-400 flex items-center gap-1 pl-1 bg-[#f1f5f9]/40 p-1.5 rounded-md border border-slate-100 select-none">
                  <span>💡</span>
                  <span>Klik baris area di atas untuk rincian akurasi lorong (akumulasi)</span>
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 font-medium text-center py-4">
                No area data available
              </div>
            )}
          </div>
        </div>

        {/* Header Segment 2 */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-3 mb-3">
          <span className="text-[11.5px] font-extrabold text-slate-700 uppercase tracking-wide">
            3. ACCURACY PER PROCESS
          </span>

          <div className="flex items-center gap-1">
            <button
              id="btn-accuracy-trend-toggle"
              onClick={() => setShowTrendChart(!showTrendChart)}
              className="text-[10.5px] font-extrabold text-[#3498db] hover:text-[#2980b9] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Detail
              {showTrendChart ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[9.5px] text-slate-400 font-medium">
              &bull; Click to expansion
            </span>
          </div>
        </div>

        {/* 3 Circular Gauges */}
        <div className="grid grid-cols-3 gap-1.5 text-center mt-3">
          {/* Picking */}
          <div
            onClick={() => onClickProcess?.('picking')}
            className="flex flex-col items-center p-1.5 bg-slate-50/20 rounded border border-slate-100 cursor-pointer hover:bg-slate-50 hover:border-blue-400 active:scale-95 transition-all duration-200 group"
          >
            <span className="text-[10px] font-bold text-slate-700 block mb-1 group-hover:text-blue-600 transition-colors">Picking</span>
            <div className="relative flex items-center justify-center my-1.5">
              {renderCircle(processes.picking.accuracyRate, smallSize, smallStrokeWidth, smallR, smallCirc, '#2ecc71')}
              <div className="absolute text-[8px] font-extrabold text-slate-800">
                {processes.picking.accuracyRate.toFixed(1)}%
              </div>
            </div>
            <div className="text-[9px] font-semibold text-slate-500 mt-1">
              <span className="text-emerald-600 font-bold">Hit {processes.picking.hit}</span> | <span className="text-rose-500 font-bold">Miss {processes.picking.miss}</span>
            </div>
          </div>

          {/* Putaway */}
          <div
            onClick={() => onClickProcess?.('putaway')}
            className="flex flex-col items-center p-1.5 bg-slate-50/20 rounded border border-slate-100 cursor-pointer hover:bg-slate-50 hover:border-blue-400 active:scale-95 transition-all duration-200 group"
          >
            <span className="text-[10px] font-bold text-slate-700 block mb-0.5 group-hover:text-blue-600 transition-colors" title="Putaway (FLR -> Rack)">Putaway</span>
            <span className="text-[8px] text-slate-400 font-medium leading-tight block">(FLR &rarr; Rack)</span>
            <div className="relative flex items-center justify-center my-1">
              {renderCircle(processes.putaway.accuracyRate, smallSize, smallStrokeWidth, smallR, smallCirc, '#2ecc71')}
              <div className="absolute text-[8px] font-extrabold text-slate-800">
                {processes.putaway.accuracyRate.toFixed(1)}%
              </div>
            </div>
            <div className="text-[9px] font-semibold text-slate-500 mt-1">
              <span className="text-emerald-600 font-bold">Hit {processes.putaway.hit}</span> | <span className="text-rose-500 font-bold">Miss {processes.putaway.miss}</span>
            </div>
          </div>

          {/* Move Pressing */}
          <div
            onClick={() => onClickProcess?.('movePressing')}
            className="flex flex-col items-center p-1.5 bg-slate-50/20 rounded border border-slate-100 cursor-pointer hover:bg-slate-50 hover:border-blue-400 active:scale-95 transition-all duration-200 group"
          >
            <span className="text-[10px] font-bold text-slate-700 block mb-0.5 group-hover:text-blue-600 transition-colors" title="Move / Pressing (Rack -> Rack)">Move/Pressing</span>
            <span className="text-[8px] text-slate-400 font-medium leading-tight block">(Rack &rarr; Rack)</span>
            <div className="relative flex items-center justify-center my-1">
              {renderCircle(processes.movePressing.accuracyRate, smallSize, smallStrokeWidth, smallR, smallCirc, '#2ecc71')}
              <div className="absolute text-[8px] font-extrabold text-slate-800">
                {processes.movePressing.accuracyRate.toFixed(1)}%
              </div>
            </div>
            <div className="text-[9px] font-semibold text-slate-500 mt-1">
              <span className="text-emerald-600 font-bold">Hit {processes.movePressing.hit}</span> | <span className="text-rose-500 font-bold">Miss {processes.movePressing.miss}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Expansion: Daily Trend Line Chart */}
      {showTrendChart && (
        <div id="section-accuracy-trend-7d" className="mt-4 pt-4 border-t border-slate-200 animate-fadeIn font-sans">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Accuracy Trend 7 Hari Terakhir
            </div>
            <span className="text-[9px] font-extrabold text-[#2ecc71] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase">
              Target &gt;= 99%
            </span>
          </div>

          <div className="relative w-full h-[140px] bg-[#fafbfb] rounded-xl border border-slate-100 p-2 overflow-visible">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartW} ${chartH}`}>
              {/* Grid Lines with Axis Labels */}
              {[100.0, 99.5, 99.0].map((val) => {
                const yVal = getRefY(val);
                return (
                  <g key={val}>
                    <line
                      x1={pLeft}
                      y1={yVal}
                      x2={chartW - pRight}
                      y2={yVal}
                      stroke="#e2e8f0"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={pLeft - 6}
                      y={yVal + 3}
                      className="text-[8px] font-mono font-bold fill-slate-400 text-right"
                      textAnchor="end"
                    >
                      {val.toFixed(1)}%
                    </text>
                  </g>
                );
              })}

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="accuracyTrendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#2ecc71" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Area Under Path */}
              {pList.length > 0 && (
                <path
                  d={areaD}
                  fill="url(#accuracyTrendAreaGrad)"
                />
              )}

              {/* Connected Line Path */}
              {pList.length > 0 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#2ecc71"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-1000"
                />
              )}

              {/* Node Circles & Text Value Labels */}
              {pList.map((p, idx) => (
                <g key={idx} className="group/node select-none">
                  {/* Accurate Float Value above node */}
                  <text
                    x={p.x}
                    y={p.y - 7}
                    className="text-[8px] font-mono font-bold fill-indigo-950 font-sans"
                    textAnchor="middle"
                  >
                    {p.accuracy.toFixed(2)}%
                  </text>

                  {/* Interactive Dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.2"
                    className="fill-white stroke-emerald-500 stroke-[2] cursor-pointer hover:r-[6] transition-all"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="2"
                    className="fill-emerald-500"
                  />

                  {/* X Axis Time Labels */}
                  <text
                    x={p.x}
                    y={chartH - 2}
                    className="text-[8.5px] font-bold fill-slate-500"
                    textAnchor="middle"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
