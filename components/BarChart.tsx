import React from "react";

interface DataItem {
  label: string;
  value: number;
  formattedValue: string;
}

interface BarChartProps {
  title: string;
  data: DataItem[];
  colorTheme?: "green" | "blue" | "purple";
}

export default function BarChart({ title, data, colorTheme = "green" }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const colors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500"
  };

  const bgClass = colors[colorTheme];

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-sm text-gray-400 text-center py-4">No hay suficientes datos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-800 mb-5">{title}</h3>
      <div className="space-y-4">
        {data.map((item, i) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={i} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-bold text-gray-900">{item.formattedValue}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full ${bgClass} transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
