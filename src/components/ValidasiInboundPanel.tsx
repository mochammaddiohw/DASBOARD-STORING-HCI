import React from 'react';
import { ValidationMetric } from '../types';
import { Layers, FileCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface ValidasiInboundPanelProps {
  data: ValidationMetric;
  onOpenDetailTrend: () => void;
  onIncrementMetric?: (type: 'sku' | 'lpn' | 'hit' | 'miss') => void;
}

export default function ValidasiInboundPanel({
  data,
  onOpenDetailTrend,
  onIncrementMetric
}: ValidasiInboundPanelProps) {
  const { totalSKU, totalLPNDivalidasi, lpnHit, lpnMiss, successRate } = data;

  return (
    <div id="panel-validation" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full font-sans transition-all duration-300">
      {/* Header Container */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[13px] font-extrabold text-[#0c2d48] uppercase tracking-wider flex items-center gap-1 cursor-pointer">
          4. VALIDASI INBOUND
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </h2>
        <button
          id="btn-validation-detail"
          onClick={onOpenDetailTrend}
          className="bg-sky-50 hover:bg-sky-100 text-[#2980b9] text-[10px] font-extrabold px-3 py-1.5 rounded-lg border border-sky-200 cursor-pointer uppercase transition-colors"
        >
          DETAIL AREA & TREND
        </button>
      </div>

      {/* Grid Content wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Metric Blocks Left (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-2 gap-2.5">
          {/* TOTAL SKU */}
          <div
            id="metric-sku"
            className="p-3 rounded-xl border border-violet-100 bg-violet-50/50 flex items-center gap-3 transition-all duration-150 hover:shadow-xs"
          >
            <div className="p-2 bg-violet-100 text-violet-700 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-extrabold text-violet-500 uppercase tracking-wider">TOTAL SKU</div>
              <div className="text-lg font-black text-[#0c2d48]">{totalSKU}</div>
            </div>
          </div>

          {/* TOTAL LPN DIVALIDASI */}
          <div
            id="metric-lpn"
            className="p-3 rounded-xl border border-sky-100 bg-sky-50/50 flex items-center gap-3 transition-all duration-150 hover:shadow-xs"
          >
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-extrabold text-sky-500 uppercase tracking-wider">TOTAL LPN</div>
              <div className="text-lg font-black text-[#0c2d48]">{totalLPNDivalidasi}</div>
            </div>
          </div>

          {/* LPN HIT */}
          <div
            id="metric-hit"
            className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center gap-3 transition-all duration-150 hover:shadow-xs"
          >
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider">LPN HIT</div>
              <div className="text-lg font-black text-emerald-700">{lpnHit}</div>
            </div>
          </div>

          {/* LPN MISS */}
          <div
            id="metric-miss"
            className="p-3 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center gap-3 transition-all duration-150 hover:shadow-xs"
          >
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-extrabold text-rose-500 uppercase tracking-wider">LPN MISS</div>
              <div className="text-lg font-black text-rose-700">{lpnMiss}</div>
            </div>
          </div>
        </div>

        {/* Success Rate Card Right (4 cols) */}
        <div className="md:col-span-4 bg-emerald-50/40 border border-emerald-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
            VALIDASI
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
            SUCCESS RATE
          </span>
          <span className="text-3xl font-extrabold text-emerald-600 leading-tight">
            {successRate.toFixed(1)}%
          </span>
          <div className="mt-2 text-[10px] font-extrabold px-3 py-1 bg-emerald-600 text-white rounded-full tracking-wide shadow-xs">
            TARGET TERCAPAI
          </div>
        </div>
      </div>
    </div>
  );
}
