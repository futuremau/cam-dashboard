import { NextRequest, NextResponse } from "next/server";
import { getTodayStatus } from "@/lib/notion";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get("fecha");

  if (!fecha) {
    return NextResponse.json({ error: "Se requiere el parámetro fecha" }, { status: 400 });
  }

  try {
    const status = await getTodayStatus(fecha);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error al verificar estado del día:", error);
    return NextResponse.json({ cierre: false, bancario: false });
  }
}
