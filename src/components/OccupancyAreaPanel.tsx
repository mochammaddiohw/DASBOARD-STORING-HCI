import React from 'react';
import { AreaOccupancy } from '../types';

interface OccupancyAreaPanelProps {
  capacity: number;
  used: number;
  empty: number;
  convCont40ft: number;
  utilizationRate: number;
  areas: AreaOccupancy[];
  selectedAreaName: string | null;
  onSelectArea: (areaName: string) => void;
}

export default function OccupancyAreaPanel({
  capacity,
  used,
  empty,
  convCont40ft,
  utilizationRate,
  areas,
  selectedAreaName,
  onSelectArea
}: OccupancyAreaPanelProps) {
  // SVG gauge helpers
  const radius = 50;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (utilizationRate / 100) * circumference;

  // Format Helper
  const formatNum = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  return (
    <div id="panel-occupancy" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between h-full font-sans">
      {/* Panel Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[13px] font-extrabold text-[#0c2d48] uppercase tracking-wider flex items-center gap-1.5">
          1. OCCUPANCY AREA - CUBIC
        </h2>
        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          Live Sheet
        </span>
      </div>

      {/* Main Gauge & Big Stats Box */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-3.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
        {/* Semi-circular gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative py-1.5 min-h-[110px]">
          <svg className="w-full max-w-[136px] h-auto drop-shadow-xs" viewBox="0 0 120 70">
            {/* Background Arc */}
            <path
              d="M 10 60 A 50 50 0 0 1 110 60"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Value Arc Accent */}
            <path
              d="M 10 60 A 50 50 0 0 1 110 60"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f0932b" />
                <stop offset="40%" stopColor="#eed042" />
                <stop offset="75%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            {/* Needle */}
            {(() => {
              const angle = (utilizationRate / 100) * 180;
              return (
                <g transform={`translate(60, 53) rotate(${angle})`} className="transition-transform duration-1000 ease-out">
                  <line x1="-16" y1="0" x2="-44" y2="0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="3" fill="#1e293b" />
                </g>
              );
            })()}
          </svg>

          {/* Value Indicator centered at the bottom */}
          <div className="absolute bottom-[-1px] text-center">
            <span className="text-xl font-black text-[#1e293b] tracking-tight block">
              {utilizationRate}%
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[#64748b] font-black block -mt-1 select-none">
              UTILIZATION
            </span>
          </div>
        </div>

        {/* Big Stats breakdown */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-2 text-slate-800">
          <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs flex flex-col justify-center min-h-[62px]">
            <div className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-1">CAPACITY</div>
            <div className="text-sm font-black text-[#0c2d48] tracking-tight">{formatNum(capacity)}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs flex flex-col justify-center min-h-[62px]">
            <div className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-1">USED</div>
            <div className="text-sm font-black text-[#0c2d48] tracking-tight">{formatNum(used)}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs flex flex-col justify-center min-h-[62px]">
            <div className="text-[9.5px] text-orange-500 font-extrabold uppercase tracking-wider leading-none mb-1">EMPTY</div>
            <div className="text-sm font-black text-orange-600 tracking-tight">{formatNum(empty)}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs flex flex-col justify-center min-h-[62px]">
            <div className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-1">CONV CONT 40FT</div>
            <div className="text-sm font-black text-slate-700 tracking-tight">{formatNum(convCont40ft)}</div>
          </div>
        </div>
      </div>

      {/* Main breakdown table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse min-w-0">
          <thead>
            <tr className="bg-[#0c2d48] text-white text-[9.5px] font-bold uppercase tracking-wider select-none border-b border-sky-950">
              <th className="px-3 py-2.5">AREA</th>
              <th className="px-2 py-2.5 text-right">CAPACITY</th>
              <th className="px-2 py-2.5 text-right">USED</th>
              <th className="px-2 py-2.5 text-right leading-tight">
                EMPTY <span className="block text-[8px] text-slate-350 font-normal normal-case">(40ft)</span>
              </th>
              <th className="px-3 py-2.5 text-right">OCCUPANCY</th>
            </tr>
          </thead>
          <tbody className="text-[10.5px] sm:text-xs">
            {areas.map((areaData) => {
              const isSelected = selectedAreaName === areaData.area;
              return (
                <tr
                  key={areaData.area}
                  id={`area-row-${areaData.area.toLowerCase().replace(' ', '-')}`}
                  onClick={() => onSelectArea(areaData.area)}
                  className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all ${
                    isSelected ? 'bg-sky-50/70 border-l-4 border-[#3498db]' : ''
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <span className="font-bold text-slate-800 block text-[11px] sm:text-xs leading-normal">{areaData.area}</span>
                    <button className="text-[8.5px] font-extrabold text-sky-600 pointer-events-none hover:underline uppercase block leading-none -mt-0.5">
                      DETAIL
                    </button>
                  </td>
                  <td className="px-2 py-2.5 text-right font-medium text-slate-700 font-mono">
                    {formatNum(areaData.capacity)}
                  </td>
                  <td className="px-2 py-2.5 text-right font-medium text-slate-700 font-mono">
                    {formatNum(areaData.used)}
                  </td>
                  <td className="px-2 py-2.5 text-right font-mono">
                    <span className="font-extrabold text-orange-600">
                      {formatNum(areaData.emptyCont)} 
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium ml-0.5">cont</span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-800 font-mono">
                    {areaData.occupancyRate.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
            {/* Total Row */}
            <tr className="bg-slate-100/80 font-bold border-t border-slate-300">
              <td className="px-3 py-3 text-slate-800 uppercase tracking-wider text-[10px] sm:text-[11px]">TOTAL</td>
              <td className="px-2 py-3 text-right text-slate-800 font-mono">{formatNum(capacity)}</td>
              <td className="px-2 py-3 text-right text-slate-800 font-mono">{formatNum(used)}</td>
              <td className="px-2 py-3 text-right font-mono">
                <span className="text-orange-600">{formatNum(convCont40ft)}</span>
                <span className="text-[9px] text-slate-500 font-bold ml-0.5">cont</span>
              </td>
              <td className="px-3 py-3 text-right text-[#0c2d48] text-xs sm:text-sm font-bold font-mono">
                {utilizationRate.toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tip Banner */}
      <div className="mt-3 flex items-center gap-1.5 bg-amber-50 rounded-lg p-2.5 border border-amber-100">
        <span className="text-sm">💡</span>
        <span className="text-[10.5px] font-bold text-amber-800">
          Tips: Klik barisan area untuk melihat rincian departemen
        </span>
      </div>
    </div>
  );
}
