import React from 'react';
import { PickZoneData } from '../types';
import { Users, ClipboardList, TrendingUp } from 'lucide-react';

interface PickZonePanelProps {
  data: PickZoneData;
  onOpenWorkload: () => void;
  onOpenCasesDetail: () => void;
  onOpenDestWorkload: () => void;
}

export default function PickZonePanel({ data, onOpenWorkload, onOpenCasesDetail, onOpenDestWorkload }: PickZonePanelProps) {
  const formatNum = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  const { totalCaseId, manpower, manpowerCapacity, avgPickZone, availability } = data;

  return (
    <div id="panel-pickzone" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between h-full font-sans">
      <div>
        {/* Header line */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[13px] font-extrabold text-[#0c2d48] uppercase tracking-wider">
            2. CASE ID & PICK ZONE
          </h2>
          <button
            id="btn-workload-modal"
            onClick={onOpenWorkload}
            className="bg-[#3498db]/10 hover:bg-[#3498db]/20 text-[#2980b9] text-[10px] font-extrabold px-3 py-1 rounded-full cursor-pointer transition-colors uppercase tracking-wider"
          >
            WORKLOAD
          </button>
        </div>

        {/* Micro KPI Row */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
          <div 
            id="kpi-box-total-cases"
            onClick={onOpenDestWorkload}
            className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/90 hover:border-blue-300 hover:shadow-xs active:scale-95 cursor-pointer transition-all duration-200 group text-center"
            title="Click to view destination workload breakdown"
          >
            <div className="text-[9px] font-bold text-slate-400 group-hover:text-[#1e61c3] uppercase tracking-widest block mb-1 transition-colors">TOTAL CASE ID</div>
            <strong className="text-base font-extrabold text-slate-800 group-hover:text-[#1e61c3] tracking-tight block transition-colors">
              {formatNum(totalCaseId)}
            </strong>
            <span className="text-[8.5px] text-[#1e61c3] opacity-0 group-hover:opacity-100 font-extrabold block transition-all duration-200 mt-0.5">DETAIL &rarr;</span>
            <span className="text-[9px] text-slate-500 font-medium block mt-0.5 group-hover:hidden">Today's Workload</span>
          </div>

          <div className="p-2.5 rounded-lg border border-[#3498db]/20 bg-sky-50/30">
            <div className="text-[9px] font-bold text-sky-600 uppercase tracking-widest block mb-1">MAN POWER (TEAM)</div>
            <strong className="text-base font-extrabold text-sky-700 tracking-tight block">
              {manpower}
            </strong>
            <span className="text-[9px] text-slate-500 font-medium block mt-0.5">Kapasitas: {formatNum(manpowerCapacity)}</span>
          </div>

          <div className="p-2.5 rounded-lg border border-emerald-200/50 bg-emerald-50/30">
            <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">AVG PICK ZONE</div>
            <strong className="text-base font-extrabold text-emerald-700 tracking-tight block">
              {avgPickZone}%
            </strong>
            <span className="text-[9.5px] text-emerald-600 font-bold uppercase block mt-0.5 tracking-tight">OVERALL PICK ZONE TODAY</span>
          </div>
        </div>

        {/* Section divider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-t border-slate-100 pt-3 mb-3">
          <span className="text-[11.5px] font-extrabold text-slate-700 uppercase tracking-wide">
            2. PICK ZONE AVAILABILITY
          </span>
          {/* Legend Items */}
          <div className="flex flex-wrap items-center gap-2.5 text-[9.5px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-600" />
              Biru: Pick zone % (Lvl 1-2)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-slate-300" />
              Abu: Buffer zone % (Lvl 3-9)
            </span>
          </div>
        </div>

        {/* Legend Stacked bars */}
        <div className="space-y-4">
          {/* ACC GROUP */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="font-bold text-slate-800">ACC GROUP</span>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
                THIS MONTH AVG: {availability.accGroup.allTimeAvg}%
              </span>
            </div>
            <div className="relative w-full h-7 rounded bg-slate-200 overflow-hidden flex font-bold text-[10.5px] text-white">
              <div
                style={{ width: `${availability.accGroup.current}%` }}
                className="bg-blue-600 h-full flex items-center justify-center transition-all duration-1000"
              >
                {availability.accGroup.current}%
              </div>
              <div className="flex-1 h-full flex items-center justify-center text-slate-500 font-semibold transition-all duration-1000">
                {100 - availability.accGroup.current}%
              </div>
            </div>
          </div>

          {/* NON ACC */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="font-bold text-slate-800">NON ACC</span>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
                THIS MONTH AVG: {availability.nonAcc.allTimeAvg}%
              </span>
            </div>
            <div className="relative w-full h-7 rounded bg-slate-200 overflow-hidden flex font-bold text-[10.5px] text-white">
              <div
                style={{ width: `${availability.nonAcc.current}%` }}
                className="bg-blue-600 h-full flex items-center justify-center transition-all duration-1000"
              >
                {availability.nonAcc.current}%
              </div>
              <div className="flex-1 h-full flex items-center justify-center text-slate-500 font-semibold transition-all duration-1000">
                {100 - availability.nonAcc.current}%
              </div>
            </div>
          </div>

          {/* AREA 2 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="font-bold text-slate-800">AREA 2</span>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
                THIS MONTH AVG: {availability.area2.allTimeAvg}%
              </span>
            </div>
            <div className="relative w-full h-7 rounded bg-slate-200 overflow-hidden flex font-bold text-[10.5px] text-white">
              <div
                style={{ width: `${availability.area2.current}%` }}
                className="bg-blue-600 h-full flex items-center justify-center transition-all duration-1000"
              >
                {availability.area2.current}%
              </div>
              <div className="flex-1 h-full flex items-center justify-center text-slate-500 font-semibold transition-all duration-1000">
                {100 - availability.area2.current}%
              </div>
            </div>
          </div>

          {/* OVERALL */}
          <div className="space-y-1 pt-2 border-t border-dashed border-slate-200">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="font-extrabold text-[#0c2d48]">OVERALL PZ TODAY</span>
            </div>
            <div className="relative w-full h-7 rounded bg-slate-200 overflow-hidden flex font-bold text-[10px] text-white">
              <div
                style={{ width: `${availability.overall.current}%` }}
                className="bg-[#2980b9] h-full flex items-center justify-center transition-all duration-1000"
              >
                {availability.overall.current}% (Pick Zone)
              </div>
              <div className="flex-1 h-full flex items-center justify-center text-slate-600 font-bold transition-all duration-1000">
                {availability.overall.buffer}% (Buffer)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
        <button
          id="btn-cases-detail-modal"
          onClick={onOpenCasesDetail}
          className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          Lihat Pick Zone Detail &rarr;
        </button>
      </div>
    </div>
  );
}
