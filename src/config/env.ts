export const FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY?.trim() ?? "";

export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN?.trim() ?? "";

export const AUTH0_CLIENT_ID =
  process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID?.trim() ?? "";

export const AUTH0_AUDIENCE =
  process.env.NEXT_PUBLIC_AUTH0_AUDIENCE?.trim() ?? "";

export const AUTH_ENABLED = Boolean(AUTH0_DOMAIN && AUTH0_CLIENT_ID);
