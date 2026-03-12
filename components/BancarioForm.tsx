"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import NumberInput from "./NumberInput";
import { BancarioData } from "@/lib/notion";

function todayISO() {
  return new Date().toLocaleDateString("en-CA");
}

export default function BancarioForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, reset, watch } = useForm<BancarioData>({
    defaultValues: { fecha: todayISO() },
  });

  const values = watch();

  const totalDia =
    (values.bac || 0) +
    (values.atlantida || 0) +
    (values.ficohsa || 0) +
    (values.banpais || 0) +
    (values.occidente || 0) +
    (values.banrural || 0) +
    (values.davivienda || 0) +
    (values.tigoMoney || 0) +
    (values.rTigo || 0) +
    (values.rClaro || 0) +
    (values.dilo || 0) +
    (values.cuentaEfectivo || 0);

  const fmt = (n: number) => `L. ${n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const onSubmit = async (data: BancarioData) => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/bancario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error desconocido");
      }

      setStatus("success");
      reset({ fecha: todayISO() });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al guardar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">
      {/* Fecha */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
        <label className="text-sm font-semibold text-gray-700">📅 Fecha del cierre</label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          {...register("fecha", { required: true })}
        />
      </div>

      {/* Cuentas Bancarias */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">🏦 Cuentas Bancarias</h3>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput label="BAC" name="bac" register={register} />
          <NumberInput label="Atlántida" name="atlantida" register={register} />
          <NumberInput label="Ficohsa" name="ficohsa" register={register} />
          <NumberInput label="BanPaís" name="banpais" register={register} />
          <NumberInput label="Occidente" name="occidente" register={register} />
          <NumberInput label="BanRural" name="banrural" register={register} />
          <NumberInput label="DaVivienda" name="davivienda" register={register} />
        </div>
      </div>

      {/* Servicios Digitales */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">📱 Servicios Digitales</h3>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput label="Tigo Money" name="tigoMoney" register={register} />
          <NumberInput label="R. Tigo" name="rTigo" register={register} />
          <NumberInput label="R. Claro" name="rClaro" register={register} />
          <NumberInput label="Dilo" name="dilo" register={register} />
        </div>
      </div>

      {/* Efectivo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">💵 Efectivo</h3>
        <NumberInput label="Cuenta Efectivo" name="cuentaEfectivo" register={register} />
      </div>

      {/* Total del Día */}
      <div className="bg-blue-600 rounded-2xl p-4 text-white flex items-center justify-between">
        <span className="font-semibold text-lg">Total del Día</span>
        <span className="font-bold text-2xl">{fmt(totalDia)}</span>
      </div>

      {/* Feedback */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-green-700 font-semibold text-sm">✅ Guardado en Notion correctamente</p>
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-red-600 text-sm">{errorMsg}</p>
        </div>
      )}

      {/* Botón submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-md active:scale-95"
      >
        {status === "loading" ? "Guardando..." : "💾 Guardar en Notion"}
      </button>
    </form>
  );
}
