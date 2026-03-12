"use client";

interface DayStatusProps {
  cierre: boolean;
  bancario: boolean;
  fecha: string;
}

export default function DayStatus({ cierre, bancario, fecha }: DayStatusProps) {
  const formatDate = (iso: string) => {
    const [year, month, day] = iso.split("-");
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-medium">
        Estado del día · {formatDate(fecha)}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-3 flex items-center gap-3 ${cierre ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <span className="text-2xl">{cierre ? "✅" : "🔴"}</span>
          <div>
            <p className="text-xs font-semibold text-gray-700">Cierre Tienda</p>
            <p className={`text-xs ${cierre ? "text-green-600" : "text-red-500"}`}>
              {cierre ? "Registrado" : "Pendiente"}
            </p>
          </div>
        </div>
        <div className={`rounded-xl p-3 flex items-center gap-3 ${bancario ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <span className="text-2xl">{bancario ? "✅" : "🔴"}</span>
          <div>
            <p className="text-xs font-semibold text-gray-700">Cierre Bancario</p>
            <p className={`text-xs ${bancario ? "text-green-600" : "text-red-500"}`}>
              {bancario ? "Registrado" : "Pendiente"}
            </p>
          </div>
        </div>
      </div>
      {cierre && bancario && (
        <div className="mt-3 text-center bg-green-100 rounded-xl py-2">
          <p className="text-green-700 text-sm font-semibold">🎉 ¡Cierre completo del día!</p>
        </div>
      )}
    </div>
  );
}
