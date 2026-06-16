import React from 'react';
import { AreaOccupancy } from '../types';
import { Percent, ArrowRight, X } from 'lucide-react';

interface TopDeptsPanelProps {
  selectedArea: AreaOccupancy | null;
  onClose: () => void;
}

export default function TopDeptsPanel({ selectedArea, onClose }: TopDeptsPanelProps) {
  if (!selectedArea) return null;

  const formatNum = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  return (
    <div id="panel-top-depts" className="bg-white rounded-xl border border-sky-200 shadow-md p-5 animate-slideIn font-sans">
      {/* Header bar */}
      <div className="flex justify-between items-center pb-3 border-b border-sky-100 mb-4">
        <div>
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">DEPARTMENT BREAKDOWN</span>
          <h3 className="text-sm font-black text-[#0c2d48] flex items-center gap-1">
            Rincian {selectedArea.area}
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </h3>
        </div>
        <button
          id="btn-close-depts"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
          title="Tutup Breakdown"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats row items */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase block">Kapasitas Maksimal</span>
          <span className="text-sm font-black text-[#0c2d48]">{formatNum(selectedArea.capacity)}</span>
          <span className="text-[9px] text-slate-400 font-medium block">Cubic/Unit</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase block">Kapasitas Terpakai</span>
          <span className="text-sm font-black text-sky-600">{formatNum(selectedArea.used)}</span>
          <span className="text-[9px] text-slate-400 font-medium block">Occupied ({selectedArea.occupancyRate.toFixed(1)}%)</span>
        </div>
      </div>

      {/* Departments list with progress ratios */}
      <div className="space-y-3.5">
        {selectedArea.departments.map((dept) => (
          <div key={dept.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">{dept.name}</span>
              <span className="font-bold text-[#0284c7]">{dept.occupancyRate.toFixed(1)}%</span>
            </div>
            {/* Split Progress bar detail */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
              <div
                style={{ width: `${dept.occupancyRate}%` }}
                className="bg-sky-500 h-full rounded-full transition-all duration-1000 ease-out"
              />
            </div>
            <div className="flex justify-between text-[9.5px] font-semibold text-slate-400">
              <span>Terisi: {formatNum(dept.used)} cu</span>
              <span>Total: {formatNum(dept.capacity)} cu</span>
            </div>
          </div>
        ))}
      </div>

      {/* Helper disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium flex items-center gap-1">
        <Percent className="w-3 h-3 text-sky-500" />
        Data disinkronisasikan dari pemetaan barcode LPN lokasi.
      </div>
    </div>
  );
}
