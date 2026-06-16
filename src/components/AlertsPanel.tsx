import React from 'react';
import { AlarmAlert } from '../types';
import { AlertTriangle, CheckCircle2, Info, Bell, X, Check } from 'lucide-react';

interface AlertsPanelProps {
  alerts: AlarmAlert[];
  onDismissAlert: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function AlertsPanel({ alerts, onDismissAlert, onClearAll, onClose }: AlertsPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-4 border-l-amber-500 bg-amber-50/40 border-slate-200';
      case 'critical':
        return 'border-l-4 border-l-red-500 bg-red-50/40 border-slate-200';
      case 'success':
        return 'border-l-4 border-l-emerald-500 bg-emerald-50/40 border-slate-200';
      default:
        return 'border-l-4 border-l-sky-500 bg-sky-50/40 border-slate-200';
    }
  };

  return (
    <div id="panel-alerts" className="bg-white rounded-xl border border-slate-200 shadow-lg p-4 font-sans animate-slideIn">
      {/* Header */}
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-3.5">
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-700" />
            {alerts.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full" />}
          </div>
          <span className="text-xs font-black text-[#0c2d48] uppercase tracking-wide">
            ALARM & NOTIFIKASI ({alerts.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {alerts.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-0.5"
            >
              <Check className="w-3.5 h-3.5" />
              Reset All
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs">
          Tidak ada notifikasi atau alarm aktif saat ini.
        </div>
      ) : (
        <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-0.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border flex items-start justify-between gap-2.5 transition-colors ${getBorderColor(
                alert.type
              )}`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5">{getIcon(alert.type)}</span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-black uppercase text-[#0d2d48] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-250">
                      {alert.area}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 font-medium">{alert.message}</p>
                </div>
              </div>

              <button
                onClick={() => onDismissAlert(alert.id)}
                className="text-slate-400 hover:text-rose-500 rounded p-0.5"
                title="Hapus"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
