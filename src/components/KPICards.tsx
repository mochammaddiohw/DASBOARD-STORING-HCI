import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  id: string;
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export default function KPICard({
  id,
  title,
  value,
  subValue,
  icon: Icon,
  iconColor,
  bgColor,
  trend,
  onClick
}: KPICardProps) {
  return (
    <div
      id={`kpi-card-${id}`}
      onClick={onClick}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${bgColor} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-lg font-extrabold text-slate-800 tracking-tight mt-0.5 block">
            {value}
          </span>
          {subValue && (
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              {subValue}
            </span>
          )}
        </div>
      </div>
      {trend && (
        <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {trend.value}
        </div>
      )}
    </div>
  );
}
