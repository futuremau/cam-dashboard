import { NextResponse } from "next/server";
import { getRecordsByDateRange } from "@/lib/notion";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Default to current year if no dates provided
    const currentYear = new Date().getFullYear();
    const start = searchParams.get("start") || `${currentYear}-01-01`;
    const end = searchParams.get("end") || `${currentYear}-12-31`;

    const data = await getRecordsByDateRange(start, end);
    
    // --- 1. Monthly Summaries (Tienda & Comisiones) ---
    const monthlyMap = new Map<string, any>();
    
    data.cierre.forEach(c => {
      if (c.fecha !== "—") {
        const month = c.fecha.substring(0, 7); // YYYY-MM
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { month, ventas: 0, comisiones: 0, totalNeto: 0, daysCount: 0 });
        }
        const m = monthlyMap.get(month);
        m.totalNeto += c.totalNeto || 0;
        m.daysCount += 1;
        
        // Sumar todas las comisiones para extraer "ventas tienda"
        // NOTA: Si `totalNeto` incluye comisiones, ventas=totalNeto-comisiones.
        // Currently we don't have all exact commission fields individually extracted from getRecordsByDateRange
        // We can just use the totalNeto for now, but user screenshot shows separated 'Tienda' and 'Comisiones'.
        // We will approximate or use totalNeto as total income.
      }
    });

    const monthlyStats = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));

    // Calculate growth and averages
    for (let i = 0; i < monthlyStats.length; i++) {
      const curr = monthlyStats[i];
      curr.promedioDiario = curr.daysCount > 0 ? curr.totalNeto / curr.daysCount : 0;
      
      if (i > 0) {
        const prev = monthlyStats[i - 1];
        curr.crecimientoTotalStr = prev.totalNeto > 0 
          ? (((curr.totalNeto - prev.totalNeto) / prev.totalNeto) * 100).toFixed(2)
          : "0.00";
        curr.crecimientoPromedioStr = prev.promedioDiario > 0
          ? (((curr.promedioDiario - prev.promedioDiario) / prev.promedioDiario) * 100).toFixed(2)
          : "0.00";
      } else {
        curr.crecimientoTotalStr = "0.00";
        curr.crecimientoPromedioStr = "0.00";
      }
    }

    // --- 2. Bank Behavior (Depósitos vs Retiros) ---
    const bankBehavior: Record<string, { depositos: number; retiros: number }> = {
      BAC: { depositos: 0, retiros: 0 },
      Atlántida: { depositos: 0, retiros: 0 },
      Ficohsa: { depositos: 0, retiros: 0 },
      BanPaís: { depositos: 0, retiros: 0 },
      Occidente: { depositos: 0, retiros: 0 },
      BanRural: { depositos: 0, retiros: 0 },
      "Tigo Money": { depositos: 0, retiros: 0 }
    };

    const bancarioSorted = [...data.bancario].filter(b => b.fecha !== "—")
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    let prevDay: any = null;
    const banksMap = {
      bac: "BAC", atlantida: "Atlántida", ficohsa: "Ficohsa", banpais: "BanPaís",
      occidente: "Occidente", banrural: "BanRural", tigoMoney: "Tigo Money"
    };

    for (const day of bancarioSorted) {
      if (prevDay) {
        for (const [key, label] of Object.entries(banksMap)) {
          const todayVal = day[key as keyof typeof day] as number || 0;
          const prevVal = prevDay[key as keyof typeof prevDay] as number || 0;
          
          if (todayVal !== prevVal && prevVal > 0) { // Only calculate if prev day had a balance
            const diff = todayVal - prevVal;
            // "si baja es que hay mas depositos y esi subeuna cuenta es que hay mas retiros"
            if (diff < 0) {
              bankBehavior[label].depositos += Math.abs(diff); // They deposited money OUT of the account to somewhere else? 
              // Wait, user said: "si baja es que hay mas depositos y esi subeuna cuenta es que hay mas retiros"
              // In everyday language: if balance drops = deposit to the main safe/owner (money left the account)? 
              // We'll use the user's exact terminology.
            } else if (diff > 0) {
              bankBehavior[label].retiros += diff; 
            }
          }
        }
      }
      prevDay = day;
    }

    // --- 3. Top Dias ---
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const ventasPorDia: Record<string, { total: number, count: number }> = {};
    
    data.cierre.filter(c => c.totalNeto != null).forEach(c => {
      if (c.fecha !== "—") {
        const date = new Date(c.fecha);
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

    // --- 4. Top Entidades Totales (Mes o Rango Actual) ---
    const entidades = {
      BAC: 0, Atlántida: 0, Ficohsa: 0, BanPaís: 0, Occidente: 0, BanRural: 0, "Tigo Money": 0
    };

    data.bancario.forEach(b => {
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
      .slice(0, 5);

    return NextResponse.json({
      monthlyStats,
      bankBehavior,
      topDias: promediosPorDia,
      topEntidades
    });

  } catch (error) {
    console.error("Error al calcular KPIs avanzados:", error);
    return NextResponse.json({ error: "No se pudieron cargar los KPIs" }, { status: 500 });
  }
}
