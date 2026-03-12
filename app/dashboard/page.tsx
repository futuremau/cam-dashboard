"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KpiCard from "@/components/KpiCard";
import BarChart from "@/components/BarChart";

interface DayData {
  dia: string;
  promedio: number;
}

interface EntityData {
  name: string;
  total: number;
}

interface KpiData {
  promTienda: number;
  promBancos: number;
  topDias: DayData[];
  topEntidades: EntityData[];
}

export default function DashboardPage() {
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/kpis")
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
  }, []);

  const fmt = (n: number) => `L. ${Math.round(n).toLocaleString("es-HN")}`;

  if (loading) {
    return (
      <div className="flex flex-col min-h-dvh bg-gray-50">
        <header className="bg-gray-800 text-white px-5 pt-12 pb-5 shadow-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 text-lg">‹</Link>
            <h1 className="text-xl font-bold">📊 KPI Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-4 space-y-4">
          <div className="bg-white rounded-xl h-24 animate-pulse border border-gray-100" />
          <div className="bg-white rounded-xl h-24 animate-pulse border border-gray-100" />
          <div className="bg-white rounded-xl h-60 animate-pulse border border-gray-100" />
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-dvh bg-gray-50 items-center justify-center p-6 text-center">
        <p className="text-3xl mb-4">⚠️</p>
        <p className="text-gray-600 font-medium">No se pudieron cargar los datos de Notion.</p>
        <Link href="/" className="mt-6 text-green-600 font-bold bg-green-50 px-6 py-2 rounded-full">Volver al inicio</Link>
      </div>
    );
  }

  const chartTopDias = data.topDias.map(d => ({
    label: d.dia,
    value: d.promedio,
    formattedValue: fmt(d.promedio)
  }));

  const chartTopBancos = data.topEntidades.map(e => ({
    label: e.name,
    value: e.total,
    formattedValue: fmt(e.total)
  }));

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white px-5 pt-12 pb-5 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-lg">
            ‹
          </Link>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">Análisis de Desempeño</p>
            <h1 className="text-xl font-bold">📊 KPI Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        
        {/* Sección 1: Tarjetas Principales */}
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Promedios Diarios</h2>
          <div className="flex flex-col gap-3">
            <KpiCard 
              title="Ventas Tienda (Día)"
              value={fmt(data.promTienda)}
              subtitle="Promedio histórico neto"
              icon="💰"
              colorClass="text-green-600"
            />
            <KpiCard 
              title="Volumen Bancario (Día)"
              value={fmt(data.promBancos)}
              subtitle="Suma transaccionada"
              icon="🏦"
              colorClass="text-blue-600"
            />
          </div>
        </div>

        {/* Sección 2: Mejores Días */}
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Análisis por Día</h2>
          <BarChart 
            title="Días de Mayores Ventas" 
            data={chartTopDias} 
            colorTheme="green"
          />
        </div>

        {/* Sección 3: Top Bancos */}
        <div className="pb-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Bancos Líderes</h2>
          <BarChart 
            title="Mayor Volumen Transaccionado" 
            data={chartTopBancos} 
            colorTheme="blue"
          />
          <p className="text-xs text-gray-400 text-center mt-3">Basado en los últimos 30 registros bancarios</p>
        </div>

      </main>
    </div>
  );
}
