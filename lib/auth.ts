import { cookies } from "next/headers";

const SESSION_COOKIE = "cam_session";
const SESSION_TOKEN = "cam_authenticated_2026";

export function validatePassword(input: string): boolean {
  return input === process.env.APP_PASSWORD;
}

export function createSession() {
  cookies().set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 días
    path: "/",
    sameSite: "lax",
  });
}

export function destroySession() {
  cookies().delete(SESSION_COOKIE);
}

export function isAuthenticated(): boolean {
  return cookies().get(SESSION_COOKIE)?.value === SESSION_TOKEN;
}
