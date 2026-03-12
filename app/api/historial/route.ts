import { NextResponse } from "next/server";
import { getRecentRecords } from "@/lib/notion";

export async function GET() {
  try {
    const records = await getRecentRecords(30);
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json({ cierre: [], bancario: [] });
  }
}
