"use client";

import { PropsWithChildren } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import {
	AUTH0_AUDIENCE,
	AUTH0_CLIENT_ID,
	AUTH0_DOMAIN,
	AUTH_ENABLED,
} from "@/config/env";
import { store } from "@/store";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#0b3c5d",
		},
		secondary: {
			main: "#ff6f00",
		},
		background: {
			default: "#f3f6fb",
		},
	},
	shape: {
		borderRadius: 14,
	},
	typography: {
		fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
	},
});

function AuthWrapper({ children }: PropsWithChildren) {
	if (!AUTH_ENABLED) {
		return <>{children}</>;
	}

	const redirectUri =
		typeof window !== "undefined" ? window.location.origin : undefined;

	return (
		<Auth0Provider
			domain={AUTH0_DOMAIN}
			clientId={AUTH0_CLIENT_ID}
			authorizationParams={{
				redirect_uri: redirectUri,
				audience: AUTH0_AUDIENCE || undefined,
			}}
			cacheLocation="localstorage"
			useRefreshTokens
		>
			{children}
		</Auth0Provider>
	);
}

export function AppProviders({ children }: PropsWithChildren) {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AuthWrapper>{children}</AuthWrapper>
			</ThemeProvider>
		</Provider>
	);
}

