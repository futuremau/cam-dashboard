import { NextResponse } from "next/server";
import { getRecentRecords } from "@/lib/notion";

export async function GET() {
  try {
    const data = await getRecentRecords(60); // Últimos 60 días para el dashboard
    
    // --- 1. Promedios Generales ---
    const cierresValidos = data.cierre.filter(c => c.totalNeto != null);
    const promTienda = cierresValidos.length ? 
      cierresValidos.reduce((acc, curr) => acc + (curr.totalNeto || 0), 0) / cierresValidos.length : 0;

    const bancosValidos = data.bancario.filter(b => b.sumaDia != null);
    const promBancos = bancosValidos.length ? 
      bancosValidos.reduce((acc, curr) => acc + (curr.sumaDia || 0), 0) / bancosValidos.length : 0;

    // --- 2. Análisis por Día de la Semana ---
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const ventasPorDia: Record<string, { total: number, count: number }> = {};
    
    cierresValidos.forEach(c => {
      if (c.fecha !== "—") {
        const date = new Date(c.fecha);
        // Ajuste zona horaria manual básico para evitar shift de días
        const diaStr = diasSemana[date.getUTCDay()]; 
        if (!ventasPorDia[diaStr]) ventasPorDia[diaStr] = { total: 0, count: 0 };
        ventasPorDia[diaStr].total += c.totalNeto || 0;
        ventasPorDia[diaStr].count += 1;
      }
    });

    const promediosPorDia = Object.keys(ventasPorDia).map(dia => ({
      dia,
      promedio: ventasPorDia[dia].total / ventasPorDia[dia].count
    })).sort((a, b) => b.promedio - a.promedio);

    // --- 3. Top Entidades Bancarias (Últimos 30 registros bancarios) ---
    const entidades = {
      BAC: 0,
      Atlántida: 0,
      Ficohsa: 0,
      BanPaís: 0,
      Occidente: 0,
      BanRural: 0,
      "Tigo Money": 0
    };

    data.bancario.slice(0, 30).forEach(b => {
      entidades.BAC += b.bac || 0;
      entidades.Atlántida += b.atlantida || 0;
      entidades.Ficohsa += b.ficohsa || 0;
      entidades.BanPaís += b.banpais || 0;
      entidades.Occidente += b.occidente || 0;
      entidades.BanRural += b.banrural || 0;
      entidades["Tigo Money"] += b.tigoMoney || 0;
    });

    const topEntidades = Object.entries(entidades)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .filter(e => e.total > 0)
      .slice(0, 5); // Top 5

    return NextResponse.json({
      promTienda,
      promBancos,
      topDias: promediosPorDia,
      topEntidades
    });

  } catch (error) {
    console.error("Error al calcular KPIs:", error);
    return NextResponse.json({ error: "No se pudieron cargar los KPIs" }, { status: 500 });
  }
}
