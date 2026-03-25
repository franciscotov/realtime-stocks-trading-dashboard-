import { NextResponse } from "next/server";
import { getFirebaseAdminMessaging } from "@/lib/firebaseAdmin";
import { getPushTokens, removePushToken } from "@/lib/pushTokenStore";

interface StockDropPayload {
  symbol?: string;
  currentPrice?: number;
  alertPrice?: number;
}

export async function POST(request: Request) {
  let body: StockDropPayload;

  try {
    body = (await request.json()) as StockDropPayload;
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const symbol = body.symbol?.trim();
  const currentPrice = body.currentPrice;
  const alertPrice = body.alertPrice;

  if (
    !symbol ||
    typeof currentPrice !== "number" ||
    typeof alertPrice !== "number"
  ) {
    return NextResponse.json(
      { error: "symbol, currentPrice and alertPrice are required" },
      { status: 400 },
    );
  }

  const tokens = getPushTokens();
  if (tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const message = `${symbol} dropped to $${currentPrice.toFixed(2)} (alert $${alertPrice.toFixed(2)})`;

  try {
    const messaging = getFirebaseAdminMessaging();
    const result = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: "Stock Alert",
        body: message,
      },
      data: {
        symbol,
        currentPrice: currentPrice.toString(),
        alertPrice: alertPrice.toString(),
      },
      webpush: {
        notification: {
          title: "Stock Alert",
          body: message,
          icon: "/favicon.ico",
        },
      },
    });

    const failed = result.responses
      .map((response, index) => ({ response, token: tokens[index] }))
      .filter((entry) => !entry.response.success)
      .map((entry) => {
        const code = entry.response.error?.code ?? "unknown";
        const message = entry.response.error?.message ?? "unknown error";

        if (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token"
        ) {
          removePushToken(entry.token);
        }

        return {
          token: entry.token,
          code,
          message,
        };
      });

    return NextResponse.json({
      ok: true,
      sent: result.successCount,
      failed: result.failureCount,
      errors: failed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "failed to send push notification",
      },
      { status: 500 },
    );
  }
}
