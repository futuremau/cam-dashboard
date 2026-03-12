"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DayStatus from "@/components/DayStatus";
import Link from "next/link";

function todayISO() {
  return new Date().toLocaleDateString("en-CA");
}

export default function HomePage() {
  const [status, setStatus] = useState({ cierre: false, bancario: false });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fecha = todayISO();

  useEffect(() => {
    fetch(`/api/today?fecha=${fecha}`)
      .then((r) => r.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [fecha]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="bg-green-600 text-white px-5 pt-12 pb-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200 text-xs uppercase tracking-widest font-medium">Grupo Comercial CAM</p>
            <h1 className="text-2xl font-bold mt-0.5">🎁 Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-green-200 hover:text-white text-sm transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 space-y-4">
        {/* Estado del día */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse h-32" />
        ) : (
          <DayStatus cierre={status.cierre} bancario={status.bancario} fecha={fecha} />
        )}

        {/* Acciones principales */}
        <div className="grid grid-cols-1 gap-3">
          <Link
            href="/cierre"
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${status.cierre ? "bg-green-100" : "bg-green-600"}`}>
              {status.cierre ? "✅" : "💰"}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-base">Cierre Tienda</p>
              <p className="text-gray-500 text-sm mt-0.5">
                {status.cierre ? "Ya registrado hoy" : "Ventas y comisiones del día"}
              </p>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </Link>

          <Link
            href="/bancario"
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${status.bancario ? "bg-green-100" : "bg-blue-600"}`}>
              {status.bancario ? "✅" : "🏦"}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-base">Cierre Bancario</p>
              <p className="text-gray-500 text-sm mt-0.5">
                {status.bancario ? "Ya registrado hoy" : "Saldos por entidad bancaria"}
              </p>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </Link>

          <Link
            href="/historial"
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
              📋
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-base">Historial</p>
              <p className="text-gray-500 text-sm mt-0.5">Últimos 30 registros</p>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white border text-gray-100 border-gray-700 bg-gray-800 rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98] mt-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-700 flex items-center justify-center text-2xl flex-shrink-0">
              📊
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-base">KPI Dashboard</p>
              <p className="text-gray-300 text-sm mt-0.5">Métricas y estadísticas globales</p>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-400">
        Regalos y Piñatas · Tegucigalpa, Honduras
      </footer>
    </div>
  );
}
