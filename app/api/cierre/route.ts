import { NextRequest, NextResponse } from "next/server";
import { createCierreRecord } from "@/lib/notion";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.fecha) {
      return NextResponse.json({ error: "La fecha es requerida" }, { status: 400 });
    }

    const page = await createCierreRecord(data);
    return NextResponse.json({ ok: true, id: page.id });
  } catch (error) {
    console.error("Error al crear registro en BD Cierre:", error);
    return NextResponse.json(
      { error: "Error al guardar en Notion. Verifica la conexión." },
      { status: 500 }
    );
  }
}
