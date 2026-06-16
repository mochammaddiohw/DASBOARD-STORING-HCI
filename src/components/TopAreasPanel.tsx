import React from 'react';
import { AreaOccupancy } from '../types';
import { Award, Zap, ArrowUpRight, Ban } from 'lucide-react';

interface TopAreasPanelProps {
  areas: AreaOccupancy[];
  onSelectArea: (areaName: string) => void;
  onClose: () => void;
}

export default function TopAreasPanel({ areas, onSelectArea, onClose }: TopAreasPanelProps) {
  // Sort areas by occupancy rate to get the highest
  const sortedOnes = [...areas].sort((a, b) => b.occupancyRate - a.occupancyRate);

  return (
    <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl p-5 font-sans animate-scaleIn">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">SUPERVISOR ANALYSIS</span>
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-4 h-4 text-emerald-400" />
            Top Storage Hotspots
          </h3>
        </div>
        <button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 p-1 rounded-full cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Ban className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[10.5px] text-slate-400 mb-4">
        Rekomendasi area penyimpanan padat dan rute optimalisasi berdasarkan rasio cubic storage:
      </p>

      <div className="space-y-3">
        {sortedOnes.map((areaPlan, idx) => (
          <div
            key={areaPlan.area}
            onClick={() => onSelectArea(areaPlan.area)}
            className="group flex justify-between items-center p-3 bg-slate-800/40 hover:bg-[#3498db]/15 rounded-lg border border-slate-800/80 hover:border-[#3498db]/30 cursor-pointer transition-all duration-150"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-500 bg-slate-800/80 w-6 h-6 rounded-full flex items-center justify-center border border-slate-700">
                #{idx + 1}
              </span>
              <div>
                <span className="text-xs font-extrabold text-slate-200 block group-hover:text-sky-300">
                  {areaPlan.area}
                </span>
                <span className="text-[9.5px] text-slate-400 block mt-0.5">
                  Occupancy: <strong className="text-slate-300">{areaPlan.occupancyRate.toFixed(1)}%</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-500 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-emerald-400" />
                OPTIMAL
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#3498db] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
