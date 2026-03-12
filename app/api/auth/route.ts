import { NextRequest, NextResponse } from "next/server";
import { validatePassword, createSession, destroySession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!validatePassword(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  destroySession();
  return NextResponse.json({ ok: true });
}
