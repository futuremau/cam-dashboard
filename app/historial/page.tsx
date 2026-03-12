"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Registro {
  fecha: string;
  totalNeto: number | null;
  sumaDia: number | null;
}

interface Historial {
  cierre: Registro[];
  bancario: Registro[];
}

export default function HistorialPage() {
  const [data, setData] = useState<Historial>({ cierre: [], bancario: [] });
  const [tab, setTab] = useState<"cierre" | "bancario">("cierre");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/historial")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fmt = (n: number | null) =>
    n != null
      ? `L. ${n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "—";

  const formatDate = (iso: string) => {
    if (!iso || iso === "—") return iso;
    const [year, month, day] = iso.split("-");
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  };

  const records = tab === "cierre" ? data.cierre : data.bancario;

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="bg-gray-800 text-white px-5 pt-12 pb-5 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-lg">
            ‹
          </Link>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">Últimos 30 registros</p>
            <h1 className="text-xl font-bold">📋 Historial</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 flex">
        <button
          onClick={() => setTab("cierre")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
            tab === "cierre"
              ? "border-green-500 text-green-700"
              : "border-transparent text-gray-500"
          }`}
        >
          💰 Tienda
        </button>
        <button
          onClick={() => setTab("bancario")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
            tab === "bancario"
              ? "border-blue-500 text-blue-700"
              : "border-transparent text-gray-500"
          }`}
        >
          🏦 Bancario
        </button>
      </div>

      {/* Contenido */}
      <main className="flex-1 p-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-14 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">No hay registros aún</p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((r, i) => {
              const total = tab === "cierre" ? r.totalNeto : r.sumaDia;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{formatDate(r.fecha)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tab === "cierre" ? "Total Neto" : "Total Día"}
                    </p>
                  </div>
                  <p className={`font-bold text-base ${tab === "cierre" ? "text-green-600" : "text-blue-600"}`}>
                    {fmt(total)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
