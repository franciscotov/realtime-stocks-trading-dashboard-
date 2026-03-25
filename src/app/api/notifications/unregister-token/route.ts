import { NextResponse } from "next/server";
import { removePushToken } from "@/lib/pushTokenStore";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string };
    const token = body.token?.trim();

    if (!token) {
      return NextResponse.json({ error: "token is required" }, { status: 400 });
    }

    removePushToken(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
}
