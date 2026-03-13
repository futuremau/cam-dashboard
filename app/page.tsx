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
      <main className="flex-1 p-5 space-y-6 pb-12">
        {/* Estado del día */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse h-32" />
        ) : (
          <DayStatus cierre={status.cierre} bancario={status.bancario} fecha={fecha} />
        )}

        {/* Acciones principales - Nuevo Grid Cuadrado */}
        <div className="grid grid-cols-2 gap-4">
          
          <Link
            href="/cierre"
            className="bg-white border border-gray-100 rounded-3xl shadow-sm p-4 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98] aspect-square relative overflow-hidden"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${status.cierre ? "bg-green-50" : "bg-gray-50"}`}>
              {status.cierre ? "✅" : "💰"}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[15px] leading-tight flex flex-col"><span>Cierre</span><span>Tienda</span></p>
              <p className="text-gray-400 text-[11px] mt-1.5 font-medium uppercase tracking-wider">
                {status.cierre ? "Registrado" : "Ingresar"}
              </p>
            </div>
            {status.cierre && <div className="absolute top-0 right-0 w-12 h-12 bg-green-500 rounded-bl-full -translate-y-6 translate-x-6 opacity-20"></div>}
          </Link>

          <Link
            href="/bancario"
            className="bg-white border border-gray-100 rounded-3xl shadow-sm p-4 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98] aspect-square relative overflow-hidden"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${status.bancario ? "bg-blue-50" : "bg-gray-50"}`}>
              {status.bancario ? "✅" : "🏦"}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[15px] leading-tight flex flex-col"><span>Cierre</span><span>Bancario</span></p>
              <p className="text-gray-400 text-[11px] mt-1.5 font-medium uppercase tracking-wider">
                {status.bancario ? "Registrado" : "Ingresar"}
              </p>
            </div>
            {status.bancario && <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500 rounded-bl-full -translate-y-6 translate-x-6 opacity-20"></div>}
          </Link>

          <Link
            href="/historial"
            className="bg-white border border-gray-100 rounded-3xl shadow-sm p-4 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98] aspect-square"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-3xl">
              📋
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[15px] leading-tight flex flex-col"><span>Historial</span><span>Registros</span></p>
              <p className="text-gray-400 text-[11px] mt-1.5 font-medium uppercase tracking-wider">Últimos 30</p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800 rounded-3xl shadow-md p-4 flex flex-col items-center justify-center text-center gap-3 hover:shadow-lg transition-shadow active:scale-[0.98] aspect-square"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">
              📊
            </div>
            <div>
              <p className="font-bold text-white text-[15px] leading-tight flex flex-col"><span>KPI</span><span>Dashboard</span></p>
              <p className="text-gray-400 text-[11px] mt-1.5 font-medium uppercase tracking-wider">Ver Análisis</p>
            </div>
          </Link>

          <Link
            href="/tendencias"
            className="bg-gradient-to-br from-blue-600 to-indigo-700 border border-indigo-500 rounded-3xl shadow-md p-5 flex flex-col items-center justify-center text-center gap-2 hover:shadow-lg transition-shadow active:scale-[0.98] col-span-2"
          >
            <div className="w-16 h-16 mb-1 rounded-full bg-white/20 flex items-center justify-center text-4xl">
              📈
            </div>
            <div>
              <p className="font-bold text-white text-[16px] leading-tight">Tendencia de Mercado</p>
              <p className="text-indigo-200 text-[12px] mt-1.5 font-medium uppercase tracking-widest text-balance">Acontecimientos y Recomendaciones HND</p>
            </div>
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
