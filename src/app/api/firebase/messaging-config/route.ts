import { NextResponse } from "next/server";

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export async function GET() {
  return NextResponse.json(
    {
      apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
      authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
      projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
      storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
      appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}