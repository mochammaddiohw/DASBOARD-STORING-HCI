import React from 'react';
import { X } from 'lucide-react';

interface WorkloadByDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onsite: number;
  customerDk: number;
  grwDk: number;
  luarKota: number;
  totalCaseId: number;
}

export default function WorkloadByDestinationModal({
  isOpen,
  onClose,
  onsite,
  customerDk,
  grwDk,
  luarKota,
  totalCaseId
}: WorkloadByDestinationModalProps) {
  if (!isOpen) return null;

  const total = totalCaseId > 0 ? totalCaseId : (onsite + customerDk + grwDk + luarKota) || 1;

  // Percentage calculations
  const onsitePercent = ((onsite / total) * 100).toFixed(1);
  const customerDkPercent = ((customerDk / total) * 100).toFixed(1);
  const grwDkPercent = ((grwDk / total) * 100).toFixed(1);
  const luarKotaPercent = ((luarKota / total) * 100).toFixed(1);

  // Formatting values (e.g. 1.236 for Indonesian style)
  const formatNum = (val: number) => {
    return val.toLocaleString('id-ID');
  };

  // We define the max scale for the bars (e.g. 2,000 is standard from screenshot)
  // If a value is larger, we can dynamically scale to the max of values or 2000
  const maxValInDest = Math.max(onsite, customerDk, grwDk, luarKota);
  const chartMax = maxValInDest > 1800 ? Math.ceil(maxValInDest / 500) * 500 : 2000;

  // Horizontal bar width proportion
  const getWidthPercent = (val: number) => {
    return `${Math.min((val / chartMax) * 100, 100)}%`;
  };

  return (
    <div
      id="modal-workload-destination"
      className="fixed inset-0 bg-[#0c2d48]/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn"
    >
      <div 
        id="modal-destination-card"
        className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-2xl overflow-hidden font-sans max-h-[96vh] flex flex-col"
      >
        {/* Title Header */}
        <div className="bg-[#042444] text-white px-4 sm:px-6 py-3.5 sm:py-[18px] flex justify-between items-center flex-shrink-0">
          <h3 className="font-extrabold text-sm sm:text-[15px] tracking-wide text-slate-100 flex items-center gap-2">
            Today's workload by destination
          </h3>
          <button
            id="btn-close-dest-header"
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Payload Area */}
        <div className="p-4 sm:p-8 pb-5 sm:pb-6 overflow-y-auto flex-1">
          <div className="space-y-4 sm:space-y-6 relative">
            {/* ONSITE Bar Block */}
            <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] items-start sm:items-center gap-1.5">
              <span className="text-[11px] sm:text-[11.5px] font-extrabold text-slate-500 uppercase tracking-widest text-left sm:text-right sm:pr-4">
                ONSITE
              </span>
              <div className="flex items-center gap-4">
                {/* Bar Container */}
                <div className="flex-1 bg-slate-50 border border-slate-100 h-6 rounded-md overflow-hidden relative">
                  <div
                    style={{ width: getWidthPercent(onsite) }}
                    className="bg-[#1e61c3] h-full rounded-r-sm transition-all duration-1000 ease-out"
                  />
                </div>
                {/* Value statistics */}
                <div className="w-[90px] sm:w-[110px] text-left text-xs flex-shrink-0">
                  <strong className="font-black text-slate-800 text-[12px] sm:text-[13px]">{formatNum(onsite)}</strong>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold ml-1 sm:ml-1.5">({onsitePercent}%)</span>
                </div>
              </div>
            </div>

            {/* CUSTOMER DK Bar Block */}
            <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] items-start sm:items-center gap-1.5">
              <span className="text-[11px] sm:text-[11.5px] font-extrabold text-slate-500 uppercase tracking-widest text-left sm:text-right sm:pr-4">
                CUSTOMER DK
              </span>
              <div className="flex items-center gap-4">
                {/* Bar Container */}
                <div className="flex-1 bg-slate-50 border border-slate-100 h-6 rounded-md overflow-hidden relative">
                  <div
                    style={{ width: getWidthPercent(customerDk) }}
                    className="bg-[#1e61c3] h-full rounded-r-sm transition-all duration-1000 ease-out"
                  />
                </div>
                <div className="w-[90px] sm:w-[110px] text-left text-xs flex-shrink-0">
                  <strong className="font-black text-slate-800 text-[12px] sm:text-[13px]">{formatNum(customerDk)}</strong>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold ml-1 sm:ml-1.5">({customerDkPercent}%)</span>
                </div>
              </div>
            </div>

            {/* GRW DK Bar Block */}
            <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] items-start sm:items-center gap-1.5">
              <span className="text-[11px] sm:text-[11.5px] font-extrabold text-slate-500 uppercase tracking-widest text-left sm:text-right sm:pr-4">
                GRW DK
              </span>
              <div className="flex items-center gap-4">
                {/* Bar Container */}
                <div className="flex-1 bg-slate-50 border border-slate-100 h-6 rounded-md overflow-hidden relative">
                  <div
                    style={{ width: getWidthPercent(grwDk) }}
                    className="bg-[#1e61c3] h-full rounded-r-sm transition-all duration-1000 ease-out"
                  />
                </div>
                <div className="w-[90px] sm:w-[110px] text-left text-xs flex-shrink-0">
                  <strong className="font-black text-slate-800 text-[12px] sm:text-[13px]">{formatNum(grwDk)}</strong>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold ml-1 sm:ml-1.5">({grwDkPercent}%)</span>
                </div>
              </div>
            </div>

            {/* LUAR KOTA H+1 Bar Block */}
            <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] items-start sm:items-center gap-1.5">
              <span className="text-[11px] sm:text-[11.5px] font-extrabold text-slate-500 uppercase tracking-widest text-left sm:text-right sm:pr-4">
                LUAR KOTA H+1
              </span>
              <div className="flex items-center gap-4">
                {/* Bar Container */}
                <div className="flex-1 bg-slate-50 border border-slate-100 h-6 rounded-md overflow-hidden relative">
                  <div
                    style={{ width: getWidthPercent(luarKota) }}
                    className="bg-[#1e61c3] h-full rounded-r-sm transition-all duration-1000 ease-out"
                  />
                </div>
                <div className="w-[90px] sm:w-[110px] text-left text-xs flex-shrink-0">
                  <strong className="font-black text-slate-800 text-[12px] sm:text-[13px]">{formatNum(luarKota)}</strong>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold ml-1 sm:ml-1.5">({luarKotaPercent}%)</span>
                </div>
              </div>
            </div>

            {/* Coordinate ticks ruler & vertical lines */}
            <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-1.5 pt-2 hidden xs:grid">
              <div />
              <div className="relative">
                {/* Grid markings */}
                <div className="absolute inset-y-0 left-0 right-[100px] sm:right-[126px] -top-[160px] sm:-top-[190px] pointer-events-none flex justify-between">
                  <div className="w-px h-[190px] border-l border-dashed border-slate-100" />
                  <div className="w-px h-[190px] border-l border-dashed border-slate-10 border-slate-200/40" />
                  <div className="w-px h-[190px] border-l border-dashed border-slate-20 border-slate-200/40" />
                  <div className="w-px h-[190px] border-l border-dashed border-slate-20 border-slate-200/40" />
                  <div className="w-px h-[190px] border-l border-dashed border-slate-20 border-slate-200/50" />
                </div>

                {/* X-axis ruler label and ticks row */}
                <div className="border-t border-slate-200/80 pt-1.5 flex justify-between text-[11px] font-extrabold text-slate-400/90 tracking-tighter mr-[126px]">
                  <span>0</span>
                  <span>{formatNum(Math.round(chartMax * 0.25))}</span>
                  <span>{formatNum(Math.round(chartMax * 0.5))}</span>
                  <span>{formatNum(Math.round(chartMax * 0.75))}</span>
                  <span>{formatNum(chartMax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action ribbon footer */}
        <div className="bg-slate-50 border-t border-slate-200/60 px-6 py-[14px] flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-extrabold tracking-wide uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-4 ring-emerald-100" />
            Sinkron Berhasil &bull; Beban Kerja H+1
          </div>
          <button
            id="btn-close-dialog-action"
            onClick={onClose}
            className="px-5 py-2.5 bg-transparent text-[#042444] hover:bg-slate-100 text-xs font-black tracking-widest rounded-lg cursor-pointer transition-all uppercase"
          >
            CLOSE DIALOG
          </button>
        </div>
      </div>
    </div>
  );
}
