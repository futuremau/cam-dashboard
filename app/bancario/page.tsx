import Link from "next/link";
import BancarioForm from "@/components/BancarioForm";

export default function BancarioPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="bg-blue-600 text-white px-5 pt-12 pb-5 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white transition-colors text-lg">
            ‹
          </Link>
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-widest font-medium">Registro Diario</p>
            <h1 className="text-xl font-bold">🏦 Cierre Bancario</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 p-4">
        <BancarioForm />
      </main>
    </div>
  );
}
