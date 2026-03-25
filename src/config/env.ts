export const FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY?.trim() ?? "";

export const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? "";

export const FIREBASE_AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? "";

export const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? "";

export const FIREBASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ?? "";

export const FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? "";

export const FIREBASE_APP_ID =
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? "";

export const FIREBASE_VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim() ?? "";

export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN?.trim() ?? "";

export const AUTH0_CLIENT_ID =
  process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID?.trim() ?? "";

export const AUTH0_AUDIENCE =
  process.env.NEXT_PUBLIC_AUTH0_AUDIENCE?.trim() ?? "";

export const AUTH_ENABLED = Boolean(AUTH0_DOMAIN && AUTH0_CLIENT_ID);
