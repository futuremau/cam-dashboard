import React from "react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  colorClass: string; // e.g., "text-green-600"
}

export default function KpiCard({ title, value, subtitle, icon, colorClass }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50 ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
