"use client";

import Link from "next/link";

interface TrendEvent {
  date: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  action: string;
}

const HON_EVENTS: TrendEvent[] = [
  {
    date: "14 de Febrero",
    title: "Día del Amor y la Amistad",
    description: "Alta demanda de regalos, arreglos florales, chocolates y peluches.",
    impact: "high",
    action: "Aumentar inventario de peluches y detallitos de Q.50-150. Promocionar en redes 2 semanas antes."
  },
  {
    date: "19 de Marzo",
    title: "Día del Padre",
    description: "Venta moderada-alta de detalles masculinos, lociones, billeteras, tazas personalizadas.",
    impact: "medium",
    action: "Armar combos de regalo 'Para Papá'. Ofrecer envolturas sobrias y elegantes."
  },
  {
    date: "2da Semana de Mayo",
    title: "Día de la Madre",
    description: "Una de las fechas comerciales más fuertes. Arreglos, globos, joyas, cosméticos.",
    impact: "high",
    action: "Preparar stock masivo de globos metálicos y bases para arreglos. Contratar ayuda extra para envolver."
  },
  {
    date: "11 de Junio",
    title: "Día del Estudiante",
    description: "Intercambios de regalos en escuelas y colegios. Demanda de chocolates, útiles bonitos, pines.",
    impact: "medium",
    action: "Crear bolsitas de dulces y pequeños detalles económicos (L.20 - L.50) para compras en volumen."
  },
  {
    date: "10 de Septiembre",
    title: "Día del Niño",
    description: "Alta rotación de piñatas, dulces, juguetes económicos y decoraciones infantiles.",
    impact: "high",
    action: "Surtir piñatas de personajes de temporada, dulces por mayor y juguetes de plástico."
  },
  {
    date: "15 de Septiembre",
    title: "Día de la Independencia",
    description: "Actos cívicos y desfiles. Banderas, trajes típicos, pines, cintas.",
    impact: "medium",
    action: "Exhibir banderas y motivos patrios en vitrina desde el 1 de septiembre."
  },
  {
    date: "17 de Septiembre",
    title: "Día del Maestro",
    description: "Venta de detalles de aprecio: tazas, organizadores, agendas, plumas.",
    impact: "medium",
    action: "Tener listas opciones de regalo empaquetadas de precios medios (L.100 - L.300)."
  },
  {
    date: "31 de Octubre",
    title: "Halloween / Día de Brujas",
    description: "Disfraces, maquillaje de fantasía, dulces, accesorios temáticos.",
    impact: "low",
    action: "Mantener un inventario mediano de accesorios. Decorar la tienda temáticamente a mitad de mes."
  },
  {
    date: "Noviembre",
    title: "Graduaciones",
    description: "Globos de graduación, peluches con birrete, arreglos elegantes, tarjetas.",
    impact: "high",
    action: "Garantizar inventario de globos de estrellas, números y frases de felicidades."
  },
  {
    date: "24 y 25 de Diciembre",
    title: "Navidad",
    description: "Época de mayor flujo de efectivo. Papel de regalo, moños, tarjetas, bolsas, juguetes.",
    impact: "high",
    action: "Empezar exhibición navideña en noviembre. Surtir masivamente papel y bolsas de regalo. Horario extendido."
  }
];

export default function TendenciasPage() {
  const currentMonth = new Date().getMonth(); // 0 = Ene, 11 = Dic
  
  // Approximate mapping of months to events (just for sorting/highlighting).
  // Ene(0), Feb(1), Mar(2), Abr(3), May(4), Jun(5), Jul(6), Ago(7), Sep(8), Oct(9), Nov(10), Dic(11)
  const monthMap: Record<string, number> = {
    "14 de Febrero": 1,
    "19 de Marzo": 2,
    "2da Semana de Mayo": 4,
    "11 de Junio": 5,
    "10 de Septiembre": 8,
    "15 de Septiembre": 8,
    "17 de Septiembre": 8,
    "31 de Octubre": 9,
    "Noviembre": 10,
    "24 y 25 de Diciembre": 11
  };

  // Sort events so upcoming ones based on current month appear first
  const sortedEvents = [...HON_EVENTS].sort((a, b) => {
    let aMonth = monthMap[a.date];
    let bMonth = monthMap[b.date];
    
    // Si el mes ya pasó en este año, conceptualmente lo mandamos al final (próximo año)
    if (aMonth < currentMonth) aMonth += 12;
    if (bMonth < currentMonth) bMonth += 12;

    return aMonth - bMonth;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500/20 text-red-500 border border-red-500/30";
      case "medium": return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high": return "Alta Demanda 🔥";
      case "medium": return "Oportunidad 💡";
      case "low": return "Demanda Moderada";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-gray-950 text-gray-200 font-sans">
      <header className="bg-gray-900 border-b border-gray-800 px-5 pt-12 pb-5 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors text-xl">
            ‹
          </Link>
          <div>
            <p className="text-indigo-400 text-[10px] uppercase tracking-[0.2em] font-bold">Comercial CAM</p>
            <h1 className="text-lg font-bold text-white mt-0.5">Tendencias de Mercado</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-6 pb-12">
        <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-3xl p-6 text-center shadow-lg">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            📅
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Calendario Comercial Honduras</h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Anticipa las compras y prepara tu inventario con semanas de antelación. 
            Aquí están las fechas más importantes ordenadas cronológicamente para maximizar tus ventas.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest ml-2 mb-2">Próximos Eventos</h3>

          {sortedEvents.map((evt, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div>
                  <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">{evt.date}</span>
                  <h4 className="text-white font-bold text-lg mt-1">{evt.title}</h4>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${getImpactColor(evt.impact)}`}>
                  {getImpactLabel(evt.impact)}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 relative z-10">
                {evt.description}
              </p>

              <div className="bg-gray-950 rounded-2xl p-4 border border-gray-800/50 relative z-10">
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span>🎯</span> Estrategia Sugerida
                </p>
                <p className="text-sm text-gray-300">
                  {evt.action}
                </p>
              </div>
              
              {/* Subtle background glow for high impact */}
              {evt.impact === "high" && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
