# Real-time Stock Trading Dashboard

TypeScript Next.js app with Material UI, Redux Toolkit, Finnhub real-time stream, Auth0 authentication, drag-and-drop watchlist, and multi-stock charting.

## Features

- Watchlist sidebar
- Add/remove stock symbols
- Per-symbol alert threshold
- Drag-and-drop sort
- Top live cards
- Price and live margin percentage change
- Red border when below alert, green when above
- Multi-stock chart
- Time-series line chart for all watched symbols
- 5m and 15m interval toggle
- Real-time updates
- Finnhub WebSocket subscriptions managed dynamically
- Browser notifications
- Stock drop alerts throttled to one notification per symbol every 60 seconds
- Auth0 login/logout flow

## Stack

- Next.js (App Router)
- TypeScript
- Material UI
- Redux Toolkit + React Redux
- dnd-kit (sortable watchlist)
- Recharts
- Auth0 React SDK

## Run Locally

1. Install dependencies

	npm install

2. Create environment file

	Copy `.env.example` to `.env.local` and fill keys.

3. Start app

	npm run dev

4. Open

	http://localhost:3000

## Environment Variables

Use these in `.env.local`:

- `NEXT_PUBLIC_FINNHUB_API_KEY`
- `NEXT_PUBLIC_AUTH0_DOMAIN`
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`
- `NEXT_PUBLIC_AUTH0_AUDIENCE` (optional depending on API setup)

## Finnhub Setup

1. Create a Finnhub account and API key.
2. Add key to `NEXT_PUBLIC_FINNHUB_API_KEY`.
3. The app uses:
- WebSocket: `wss://ws.finnhub.io`
- Candle REST endpoint for 5m/15m chart history

## Auth0 Setup

1. Create a Single Page Application in Auth0.
2. Configure Allowed Callback URLs:
- `http://localhost:3000`
3. Configure Allowed Logout URLs:
- `http://localhost:3000`
4. Configure Allowed Web Origins:
- `http://localhost:3000`
5. Set in `.env.local`:
- `NEXT_PUBLIC_AUTH0_DOMAIN`
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`
- `NEXT_PUBLIC_AUTH0_AUDIENCE` (if you protect an API)

If Auth0 vars are missing, app runs in a fallback mode and shows a warning banner.

## Push Notification Layer (Important)

Current implementation:

- Uses browser Notification API from the client
- Triggers when live price goes below alert
- Throttled by localStorage per symbol (60 seconds)

For full Web Push (service worker + server-side pushes):

1. Generate VAPID key pair (server-side) using `web-push`
2. Store private key on backend only
3. Expose public VAPID key to frontend
4. Register service worker and subscribe users via Push API
5. Save user subscriptions on backend
6. When an alert condition is met server-side, send push payload to saved subscriptions

Included in this repo:

- `public/sw.js` basic service worker push handler scaffold

Not included yet:

- Backend subscription endpoints
- Server-side alert processor
- VAPID key generation scripts

## Project Structure

- `src/components/auth` Auth gate and login flow
- `src/components/dashboard` watchlist, cards, chart, dashboard composition
- `src/components/providers` Redux + MUI + Auth0 providers
- `src/lib` Finnhub API/WebSocket and notification service
- `src/store` Redux slices and typed hooks
- `src/config` env and stock list config
- `src/types` shared domain types

## Notes

- Finnhub free tier has rate and websocket limitations.
- Notification delivery depends on browser permission.
- For production-grade push, implement server-side VAPID flow.
