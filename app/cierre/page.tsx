import Link from "next/link";
import CierreForm from "@/components/CierreForm";

export default function CierrePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="bg-green-600 text-white px-5 pt-12 pb-5 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-green-200 hover:text-white transition-colors text-lg">
            ‹
          </Link>
          <div>
            <p className="text-green-200 text-xs uppercase tracking-widest font-medium">Registro Diario</p>
            <h1 className="text-xl font-bold">💰 Cierre Tienda</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 p-4">
        <CierreForm />
      </main>
    </div>
  );
}
