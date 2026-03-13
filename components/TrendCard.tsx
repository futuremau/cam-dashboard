import React from "react";

interface TrendCardProps {
  title: string;
  value: string;
  trend?: string; // e.g. "+15%" or "-5%"
  isPositive?: boolean;
  icon?: string;
  bgColorClass?: string;
  textColorClass?: string;
}

export default function TrendCard({ 
  title, 
  value, 
  trend, 
  isPositive, 
  icon, 
  bgColorClass = "bg-gray-800", 
  textColorClass = "text-white" 
}: TrendCardProps) {
  return (
    <div className={`${bgColorClass} ${textColorClass} rounded-2xl p-5 shadow-sm hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center gap-2 mb-3">
        {icon && <span>{icon}</span>}
        <h3 className="text-sm font-semibold opacity-90">{title}</h3>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {trend && (
        <p className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '↑' : '↓'} {trend} vs anterior
        </p>
      )}
    </div>
  );
}
