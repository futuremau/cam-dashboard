"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import NumberInput from "./NumberInput";
import { CierreData } from "@/lib/notion";

function todayISO() {
  return new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD"
}

export default function CierreForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, reset, watch } = useForm<CierreData>({
    defaultValues: { fecha: todayISO() },
  });

  const values = watch();

  const totalVentas =
    (values.efectivo || 0) +
    (values.papeleria || 0) +
    (values.posBac || 0) +
    (values.posBanrural || 0) +
    (values.transferencias || 0);

  const totalComisiones =
    (values.comAgentes || 0) +
    (values.comBac || 0) +
    (values.comBanpais || 0) +
    (values.comFicohsa || 0) +
    (values.comTigoMoney || 0) +
    (values.comBanrural || 0) +
    (values.comAtlantida || 0) +
    (values.comOccidente || 0) +
    (values.comInteres || 0);

  const totalNeto = totalVentas + totalComisiones;

  const fmt = (n: number) => `L. ${n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const onSubmit = async (data: CierreData) => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/cierre", {
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
          {...register("fecha", { required: true })}
        />
      </div>

      {/* Ventas Tienda */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          💵 Ventas Tienda
          <span className="ml-auto text-green-600 font-bold text-base">{fmt(totalVentas)}</span>
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput label="Efectivo" name="efectivo" register={register} />
          <NumberInput label="Papelería" name="papeleria" register={register} />
          <NumberInput label="POS BAC" name="posBac" register={register} />
          <NumberInput label="POS Banrural" name="posBanrural" register={register} />
          <NumberInput label="Transferencias" name="transferencias" register={register} />
        </div>
      </div>

      {/* Comisiones Bancarias */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          🏦 Comisiones Bancarias
          <span className="ml-auto text-green-600 font-bold text-base">{fmt(totalComisiones)}</span>
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput label="Com. Agentes Diario" name="comAgentes" register={register} />
          <NumberInput label="Com. BAC" name="comBac" register={register} />
          <NumberInput label="Com. BanPaís" name="comBanpais" register={register} />
          <NumberInput label="Com. Ficohsa" name="comFicohsa" register={register} />
          <NumberInput label="Com. Tigo Money" name="comTigoMoney" register={register} />
          <NumberInput label="Com. BanRural" name="comBanrural" register={register} />
          <NumberInput label="Com. Atlántida" name="comAtlantida" register={register} />
          <NumberInput label="Com. Occidente" name="comOccidente" register={register} />
          <NumberInput label="Com. Interés Cuenta" name="comInteres" register={register} />
        </div>
      </div>

      {/* Total Neto */}
      <div className="bg-green-600 rounded-2xl p-4 text-white flex items-center justify-between">
        <span className="font-semibold text-lg">Total Neto</span>
        <span className="font-bold text-2xl">{fmt(totalNeto)}</span>
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
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-md active:scale-95"
      >
        {status === "loading" ? "Guardando..." : "💾 Guardar en Notion"}
      </button>
    </form>
  );
}
