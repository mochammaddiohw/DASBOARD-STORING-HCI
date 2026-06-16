import React from 'react';
import { RincianAreaData } from '../types';
import { X, Users, Briefcase, Zap, ClipboardList, CheckCircle } from 'lucide-react';

interface BebanKerjaModalProps {
  isOpen: boolean;
  onClose: () => void;
  rincianAreas: RincianAreaData[];
}

export default function BebanKerjaModal({ isOpen, onClose, rincianAreas }: BebanKerjaModalProps) {
  if (!isOpen) return null;

  const totalKPIWorkload = rincianAreas.reduce((sum, item) => sum + item.workload, 0);
  const totalKPIManpower = rincianAreas.reduce((sum, item) => sum + item.manpower, 0);
  const totalKPIPicked = rincianAreas.reduce((sum, item) => sum + item.picked, 0);
  const overallUtilization = totalKPIWorkload > 0 ? ((totalKPIPicked / totalKPIWorkload) * 100).toFixed(1) : '0';

  return (
    <div id="modal-beban-kerja" className="fixed inset-0 bg-[#0c2d48]/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      {/* Container Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden font-sans max-h-[96vh] sm:max-h-[90vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-[#0c2d48] text-white px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">MODAL ANALISIS BEBAN KERJA</h3>
              <p className="text-[9px] sm:text-[10px] text-slate-300">Statistik Alokasi Personil dan Beban Penyimpanan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-slate-800 p-1 font-bold text-xs rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 bg-slate-100">
          {/* Top Quick Overview KPIs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-2 sm:p-3 text-center shadow-xs">
              <span className="text-[8px] sm:text-[9px] text-sky-600 font-extrabold uppercase tracking-wider block">Workload</span>
              <span className="text-base sm:text-xl font-black text-[#0c2d48] mt-0.5 block">{totalKPIWorkload}</span>
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold block">Case ID</span>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-2 sm:p-3 text-center shadow-xs">
              <span className="text-[8px] sm:text-[9px] text-violet-600 font-extrabold uppercase tracking-wider block">Personil</span>
              <span className="text-base sm:text-xl font-black text-violet-800 mt-0.5 block">{totalKPIManpower}</span>
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold block">Anggota</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 sm:p-3 text-center shadow-xs">
              <span className="text-[8px] sm:text-[9px] text-emerald-600 font-extrabold uppercase tracking-wider block">Avg Progress</span>
              <span className="text-base sm:text-xl font-black text-emerald-800 mt-0.5 block">{overallUtilization}%</span>
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold block">Picked</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-bold">
            Berikut adalah performa kalkulasi tim per area:
          </p>

          {/* Area allocations bars details */}
          <div className="space-y-4">
            {rincianAreas.map((item) => {
              const pickedPerPerson = item.manpower > 0 ? (item.picked / item.manpower).toFixed(0) : '0';
              const isHigh = item.utilization > 75;
              return (
                <div key={item.areaName} className="p-4 bg-white rounded-xl border-y border-r border-slate-200 border-l-4 border-l-[#0c2d48] space-y-3 shadow-md hover:shadow-lg transition-shadow duration-150">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-[#0c2d48] uppercase tracking-wide">{item.areaName}</span>
                    <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isHigh ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                      {item.utilization}% PROGRESS
                    </span>
                  </div>

                  {/* Allocation parameters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Cases Assigned</span>
                      <span className="font-extrabold text-slate-800">{item.workload} Cases</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Team Assignee</span>
                      <span className="font-extrabold text-slate-800">{item.manpower} Personil</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Picked</span>
                      <span className="font-extrabold text-slate-800">{item.picked} Cases</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Outstanding</span>
                      <span className="font-bold text-orange-600">{item.outstanding} Cases</span>
                    </div>
                  </div>

                  {/* Progress ratio */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.utilization}%` }}
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isHigh ? 'bg-orange-500' : 'bg-[#3498db]'
                      }`}
                    />
                  </div>

                  <span className="text-[10px] text-slate-500 font-bold block mt-1">
                    &bull; Rata-rata pengambilan per personil: {pickedPerPerson} Case ID.
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recommendations checklist banner */}
          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-[11px] uppercase tracking-wide block">Rekomendasi Penjadwalan Storing NDC</span>
              <p className="text-[10.5px] text-emerald-700 font-medium leading-relaxed mt-0.5">
                Semua area saat ini berada di bawah batas kritis kapasitas beban kerja. Manpower 8 orang termanajemen dengan sangat ideal tanpa ada lembur tambahan (Overtime).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
