import React from "react";

interface AnalyticalTextProps {
  stats: any[];
}

export default function AnalyticalText({ stats }: AnalyticalTextProps) {
  if (!stats || stats.length < 2) return <p className="text-gray-500 text-sm">Falta información para proyectar tendencias.</p>;

  const current = stats[stats.length - 1];
  const previous = stats[stats.length - 2];
  
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const getMonthName = (YYYY_MM: string) => {
    const split = YYYY_MM.split("-");
    const mIndex = parseInt(split[1], 10) - 1;
    return monthNames[mIndex] || split[1];
  };

  const cMonth = getMonthName(current.month);
  const pMonth = getMonthName(previous.month);

  const fmt = (n: number) => `L. ${Math.round(n).toLocaleString("es-HN")}`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-300 text-sm leading-relaxed shadow-lg">
      <h3 className="text-white font-bold mb-4">Análisis Financiero - Tendencias</h3>
      
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-white mb-2">Desempeño {pMonth} (Mes Anterior):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ingresos totales registrados: <strong className="text-white">{fmt(previous.totalNeto)}</strong></li>
            <li>Promedio diario de ingresos: <strong className="text-white">{fmt(previous.promedioDiario)}</strong></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-2">Desempeño {cMonth} (Mes Actual):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ingresos hasta la fecha: <strong className="text-white">{fmt(current.totalNeto)}</strong></li>
            <li>Promedio diario actual: <strong className="text-white">{fmt(current.promedioDiario)}</strong></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-2">Conclusiones:</p>
          <ul className="list-disc pl-5 space-y-1">
            {parseFloat(current.crecimientoPromedioStr) > 0 ? (
              <li>
                El promedio diario de <strong>{cMonth}</strong> es <span className="text-green-400">{current.crecimientoPromedioStr}% superior</span> al de {pMonth}.
              </li>
            ) : (
              <li>
                El promedio diario de <strong>{cMonth}</strong> está <span className="text-red-400">{Math.abs(parseFloat(current.crecimientoPromedioStr))}% por debajo</span> de {pMonth}.
              </li>
            )}
            <li>
              Crecimiento actual del volumen total vs mes anterior: <strong>{current.crecimientoTotalStr}%</strong>.
            </li>
          </ul>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-6 italic">Última actualización: En tiempo real</p>
    </div>
  );
}
