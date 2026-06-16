import React from 'react';
import { RincianAreaData } from '../types';
import { Info } from 'lucide-react';

interface RincianAreaPanelProps {
  data: RincianAreaData[];
  onOpenOutstandingDetail: () => void;
}

export default function RincianAreaPanel({ data, onOpenOutstandingDetail }: RincianAreaPanelProps) {
  const formatNum = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  // Calculate totals
  const totalWorkload = data.reduce((sum, item) => sum + item.workload, 0);
  const totalManpower = data.reduce((sum, item) => sum + item.manpower, 0);
  const totalPicked = data.reduce((sum, item) => sum + item.picked, 0);
  const totalOutstanding = data.reduce((sum, item) => sum + item.outstanding, 0);
  const totalUtilization = totalWorkload > 0 ? Math.round((totalPicked / totalWorkload) * 100) : 0;

  return (
    <div id="panel-details" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden font-sans transition-all duration-300 flex flex-col h-full">
      {/* Dark Navy Ribbon Header */}
      <div className="bg-[#0c2d48] text-white px-5 py-3.5 flex justify-between items-center">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider">
          5. RINCIAN PER AREA
        </h2>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[10px] bg-[#145daa] text-slate-100 font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
            Live Monitor
          </span>
          <button
            id="btn-outstanding-detail"
            onClick={onOpenOutstandingDetail}
            className="text-[10px] bg-sky-600 hover:bg-[#145daa] hover:text-white font-extrabold px-2.5 py-1 rounded border border-transparent hover:border-sky-400/30 transition-all text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            Detail Outstanding &rarr;
          </button>
        </div>
      </div>

      {/* Table Body Container */}
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse min-w-0">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-250 text-[10px] md:text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-2 md:px-4 py-3 whitespace-nowrap">AREA</th>
              <th className="px-2 md:px-4 py-3 text-right">WORKLOAD (CASE ID)</th>
              <th className="px-2 md:px-4 py-3 text-right">MANPOWER (TEAM)</th>
              <th className="px-2 md:px-4 py-3 text-right">PICKED (CASE ID)</th>
              <th className="px-2 md:px-4 py-3 text-right">OUTSTANDING (CASE ID)</th>
              <th className="px-2 md:px-4 py-3 text-right text-center md:text-right">UTILIZATION</th>
              <th className="px-2 md:px-4 py-3 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="text-[11px] md:text-xs">
            {data.map((row) => (
              <tr
                key={row.areaName}
                id={`rincian-row-${row.areaName.toLowerCase().replace(' ', '-')}`}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
               >
                {/* Area Name */}
                <td className="px-2 md:px-4 py-3 font-bold text-slate-800 whitespace-nowrap">
                  {row.areaName}
                </td>

                {/* Workload */}
                <td className="px-2 md:px-4 py-3 text-right font-semibold text-slate-600 font-mono">
                  {formatNum(row.workload)}
                </td>

                {/* Manpower */}
                <td className="px-2 md:px-4 py-3 text-right font-semibold text-slate-600 font-mono">
                  {row.manpower}
                </td>

                {/* Picked */}
                <td className="px-2 md:px-4 py-3 text-right font-semibold text-emerald-600 font-mono">
                  {formatNum(row.picked)}
                </td>

                {/* Outstanding */}
                <td className="px-2 md:px-4 py-3 text-right font-bold text-orange-600 font-mono">
                  {formatNum(row.outstanding)}
                </td>

                {/* Utilization */}
                <td className="px-2 md:px-4 py-3 text-right font-bold text-slate-800 font-mono">
                  {row.utilization}%
                </td>

                {/* Status indicator badge */}
                <td className="px-2 md:px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-1.5 justify-center">
                    <span className="relative flex h-2 w-2">
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        row.outstanding === 0 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></span>
                    </span>
                    <span className={`text-[9px] md:text-[10px] font-bold text-center uppercase tracking-wide ${
                      row.outstanding === 0 ? 'text-emerald-600' : 'text-amber-500'
                    }`}>
                      {row.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}

            {/* TOTAL Row */}
            <tr className="bg-slate-100/70 py-4 border-t border-slate-300 font-extrabold text-[11px] md:text-xs">
              {/* TOTAL keyword */}
              <td className="px-2 md:px-4 py-3.5 text-slate-800 uppercase tracking-widest text-[10px] md:text-[11px] whitespace-nowrap">
                TOTAL
              </td>

              {/* Total Workload */}
              <td className="px-2 md:px-4 py-3.5 text-right text-[#0c2d48] font-mono">
                {formatNum(totalWorkload)}
              </td>

              {/* Total Manpower */}
              <td className="px-2 md:px-4 py-3.5 text-right text-slate-700 font-mono">
                {totalManpower}
              </td>

              {/* Total Picked */}
              <td className="px-2 md:px-4 py-3.5 text-right text-emerald-700 font-mono">
                {formatNum(totalPicked)}
              </td>

              {/* Total Outstanding */}
              <td className="px-2 md:px-4 py-3.5 text-right text-orange-700 font-mono">
                {formatNum(totalOutstanding)}
              </td>

              {/* Total Utilization */}
              <td className="px-2 md:px-4 py-3.5 text-right text-slate-800 font-mono">
                {totalUtilization}%
              </td>

              {/* Total status badge */}
              <td className="px-2 md:px-4 py-3.5 text-center">
                <span className={`inline-block text-[9px] md:text-[10px] font-black px-1.5 md:px-3 py-1 rounded uppercase tracking-wider border ${
                  totalOutstanding === 0 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {totalOutstanding === 0 ? 'COMPLETED' : 'ON PROGRESS'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Info Message */}
      <div className="bg-slate-50 px-4 md:px-5 py-3 border-t border-slate-100 text-slate-500 text-[10px] md:text-[10.5px] flex items-start gap-2 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-[#145daa] shrink-0 mt-0.5" />
        <span>
          <strong>Keterangan:</strong> Panel Rincian per Area ini hanya menyajikan data operasional <strong>Hari Ini</strong>. Konten tabel ini tidak berubah mengikuti pilihan filter periode di bagian atas dashboard.
        </span>
      </div>
    </div>
  );
}
