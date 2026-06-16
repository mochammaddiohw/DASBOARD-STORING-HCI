import React, { useState } from 'react';
import { Warehouse as WarehouseIcon, Calendar, ChevronDown, MapPin, Bell, RefreshCw } from 'lucide-react';
import { Warehouse, Period } from '../types';
import { ALL_WAREHOUSES, ALL_PERIODS } from '../mockData';

interface HeaderProps {
  selectedPeriod: Period;
  onPeriodChange: (p: Period) => void;
  isBackgroundSyncing?: boolean;
  lastRefetchedAt?: Date;
}

export default function Header({
  selectedPeriod,
  onPeriodChange,
  isBackgroundSyncing = false,
  lastRefetchedAt
}: HeaderProps) {
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  return (
    <header id="app-header" className="bg-[#0c2d48] text-white px-6 py-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300">
      {/* Brand Label */}
      <div className="flex items-center gap-4">
        <div className="bg-[#145daa]/30 p-3 rounded-lg border border-[#0096ff]/30 text-sky-400">
          <WarehouseIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-sans tracking-wide text-slate-100 flex items-center gap-2">
            STORING DASHBOARD
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 font-sans mt-0.5">
            <p className="text-xs md:text-sm text-slate-300">
              Monitoring Storing & Storing Performance
            </p>
            {lastRefetchedAt && (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold select-none h-fit">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isBackgroundSyncing ? 'duration-500' : ''}`}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>
                  {isBackgroundSyncing ? 'SINKRONISASI...' : `GSHEET TER-SYNC: ${lastRefetchedAt.toLocaleTimeString('id-ID')}`}
                </span>
              </div>
            )}
          </div>
          {lastRefetchedAt && (
            <div className="sm:hidden flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold select-none w-fit mt-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isBackgroundSyncing ? 'duration-500' : ''}`}></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>
                {isBackgroundSyncing ? 'SINKRONISASI...' : `SYNC: ${lastRefetchedAt.toLocaleTimeString('id-ID')}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Period Dropdown */}
        <div className="relative flex-1 md:flex-initial">
          <button
            id="btn-period-select"
            onClick={() => {
              setShowPeriodDropdown(!showPeriodDropdown);
            }}
            className="w-full flex items-center justify-between gap-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-left cursor-pointer transition-all duration-150"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">PERIODE</div>
                <div className="font-semibold text-slate-100 mt-0.5">{selectedPeriod}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showPeriodDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDropdown(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-20">
                {ALL_PERIODS.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      onPeriodChange(period);
                      setShowPeriodDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-700 transition-colors ${
                      selectedPeriod === period ? 'text-emerald-400 font-bold bg-[#145daa]/30' : 'text-slate-300'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Warehouse (Fixed/Paten) */}
        <div className="flex-1 md:flex-initial">
          <div
            id="static-warehouse-indicator"
            className="w-full flex items-center gap-3 bg-slate-800/50 border border-slate-700/80 rounded-lg px-4 py-2.5 text-xs"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">WAREHOUSE</div>
                <div className="font-semibold text-slate-100 mt-0.5">NDC SIDOARJO</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
