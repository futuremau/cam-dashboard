import { NextRequest, NextResponse } from "next/server";
import { validatePassword, createSession, destroySession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!validatePassword(password)) {
    const isConfigured = !!process.env.APP_PASSWORD;
    const msg = isConfigured 
      ? "Contraseña incorrecta" 
      : "Error de Vercel: Variable APP_PASSWORD no encontrada";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  destroySession();
  return NextResponse.json({ ok: true });
}
