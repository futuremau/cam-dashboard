"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BarChart from "@/components/BarChart";
import TrendCard from "@/components/TrendCard";
import AnalyticalText from "@/components/AnalyticalText";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("year"); // year, lastMonth, thisMonth

  useEffect(() => {
    setLoading(true);
    let start = "";
    let end = "";
    
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; 
    // basic local date handling
    const localNow = new Date(now.getTime() - tzOffset);

    if (filter === "year") {
      start = `${localNow.getFullYear()}-01-01`;
      end = `${localNow.getFullYear()}-12-31`;
    } else if (filter === "thisMonth") {
      start = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(localNow.getFullYear(), localNow.getMonth() + 1, 0);
      end = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
    } else if (filter === "lastMonth") {
      const prevMonth = new Date(localNow.getFullYear(), localNow.getMonth() - 1, 1);
      const lastDayPrevMonth = new Date(localNow.getFullYear(), localNow.getMonth(), 0);
      start = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`;
      end = `${lastDayPrevMonth.getFullYear()}-${String(lastDayPrevMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayPrevMonth.getDate()).padStart(2, '0')}`;
    }

    fetch(`/api/kpis?start=${start}&end=${end}`)
      .then((r) => {
        if (!r.ok) throw new Error("Fallo al cargar");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
        setLoading(false);
      });
  }, [filter]);

  const fmt = (n: number) => `L. ${Math.round(n).toLocaleString("es-HN")}`;

  if (error) {
    return (
      <div className="flex flex-col min-h-dvh bg-gray-950 items-center justify-center p-6 text-center">
        <p className="text-3xl mb-4">⚠️</p>
        <p className="text-gray-400 font-medium">No se pudieron cargar los datos de Notion.</p>
        <Link href="/" className="mt-6 text-green-400 font-bold bg-green-900/20 px-6 py-2 rounded-full border border-green-500/30">Volver al inicio</Link>
      </div>
    );
  }

  // Determine top components properties
  const monthlyStats = data?.monthlyStats || [];
  const currentMonthData = monthlyStats.length > 0 ? monthlyStats[monthlyStats.length - 1] : null;

  const chartTopDias = (data?.topDias || []).map((d: any) => ({
    label: d.dia,
    value: d.promedio,
    formattedValue: fmt(d.promedio)
  }));

  const chartTopBancos = (data?.topEntidades || []).map((e: any) => ({
    label: e.name,
    value: e.total,
    formattedValue: fmt(e.total)
  }));

  const chartMonthly = monthlyStats.map((m: any) => {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthIndex = parseInt(m.month.split("-")[1], 10) - 1;
    return {
      label: monthNames[monthIndex],
      value: m.totalNeto,
      formattedValue: fmt(m.totalNeto)
    };
  });

  return (
    <div className="flex flex-col min-h-dvh bg-gray-950 text-gray-200 font-sans">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-5 pt-12 pb-5 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors text-xl">
              ‹
            </Link>
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">Inteligencia de Negocios</p>
              <h1 className="text-lg font-bold text-white mt-0.5">Dashboard Analítico</h1>
            </div>
          </div>
          
          <select 
            className="bg-gray-800 border-none text-white text-sm rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="year">Este Año</option>
            <option value="thisMonth">Este Mes</option>
            <option value="lastMonth">Mes Pasado</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 pb-12">
        
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-28 bg-gray-900 rounded-2xl w-full"></div>
            <div className="h-28 bg-gray-900 rounded-2xl w-full"></div>
            <div className="h-64 bg-gray-900 rounded-2xl w-full"></div>
          </div>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <TrendCard 
                title="Ingreso Total"
                value={currentMonthData ? fmt(currentMonthData.totalNeto) : "L. 0"}
                trend={currentMonthData ? `${currentMonthData.crecimientoTotalStr}%` : undefined}
                isPositive={currentMonthData && parseFloat(currentMonthData.crecimientoTotalStr) >= 0}
                bgColorClass="bg-gradient-to-br from-gray-800 to-gray-900"
                icon="💰"
              />
              <TrendCard 
                title="Promedio Día"
                value={currentMonthData ? fmt(currentMonthData.promedioDiario) : "L. 0"}
                trend={currentMonthData ? `${currentMonthData.crecimientoPromedioStr}%` : undefined}
                isPositive={currentMonthData && parseFloat(currentMonthData.crecimientoPromedioStr) >= 0}
                bgColorClass="bg-gradient-to-br from-blue-900/40 to-gray-900"
                icon="⏱️"
              />
            </div>

            {/* Analysis Text */}
            <AnalyticalText stats={monthlyStats} />

            {/* Monthly Trend Chart */}
            <div className="pt-2">
              <BarChart 
                title="Tendencia Mensual de Ingresos" 
                data={chartMonthly} 
                colorTheme="green"
              />
            </div>

            {/* Bank Behavior Matrix */}
            <div>
               <h3 className="font-bold text-white mb-3 px-1 text-sm uppercase tracking-wide">Comportamiento Bancario</h3>
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
                   <p className="text-gray-400 text-xs font-semibold mb-2">MAYOR DEPOSITANTE ↓</p>
                   {Object.entries(data?.bankBehavior || {}).length > 0 ? (
                     (() => {
                        const topDeposito = Object.entries(data.bankBehavior as Record<string, any>).sort((a,b) => b[1].depositos - a[1].depositos)[0];
                        return (
                          <div>
                            <p className="text-lg font-bold text-blue-400">{topDeposito[0]}</p>
                            <p className="text-sm">{fmt(topDeposito[1]?.depositos || 0)}</p>
                          </div>
                        )
                     })()
                   ) : <p className="text-sm text-gray-600">No hay datos</p>}
                 </div>
                 
                 <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
                   <p className="text-gray-400 text-xs font-semibold mb-2">MAYOR RETIRO ↑</p>
                   {Object.entries(data?.bankBehavior || {}).length > 0 ? (
                     (() => {
                        const topRetiro = Object.entries(data.bankBehavior as Record<string, any>).sort((a,b) => b[1].retiros - a[1].retiros)[0];
                        return (
                          <div>
                            <p className="text-lg font-bold text-red-400">{topRetiro[0]}</p>
                            <p className="text-sm">{fmt(topRetiro[1]?.retiros || 0)}</p>
                          </div>
                        )
                     })()
                   ) : <p className="text-sm text-gray-600">No hay datos</p>}
                 </div>
               </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              <BarChart 
                title="Días de Mayores Ventas" 
                data={chartTopDias} 
                colorTheme="purple"
              />
              <BarChart 
                title="Volumen Acumulado en Cuentas" 
                data={chartTopBancos} 
                colorTheme="blue"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
