"use client";

import { PropsWithChildren } from "react";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AUTH_ENABLED } from "@/config/env";
import { store } from "@/store";
import {
  COLOR_ACCENT,
  COLOR_BORDER,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_BACKGROUND,
  COLOR_FOREGROUND,
  COLOR_FOREGROUND_MUTED,
  COLOR_SURFACE,
  COLOR_SURFACE_ELEVATED,
} from "@/config/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: COLOR_PRIMARY,
    },
    secondary: {
      main: COLOR_SECONDARY,
    },
    background: {
      default: COLOR_BACKGROUND,
      paper: COLOR_SURFACE,
    },
    text: {
      primary: COLOR_FOREGROUND,
      secondary: COLOR_FOREGROUND_MUTED,
    },
    divider: COLOR_BORDER,
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.04em",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${COLOR_BORDER} transparent`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: COLOR_SURFACE,
          border: `1px solid ${COLOR_BORDER}`,
          boxShadow: "0 18px 44px rgba(2, 6, 23, 0.28)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 999,
          paddingInline: 18,
        },
        contained: {
          background: `linear-gradient(135deg, ${COLOR_SECONDARY}, ${COLOR_ACCENT})`,
          boxShadow: "0 14px 30px rgba(44, 140, 255, 0.28)",
        },
        outlined: {
          borderColor: COLOR_BORDER,
          backgroundColor: alpha(COLOR_SURFACE_ELEVATED, 0.58),
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(COLOR_SURFACE_ELEVATED, 0.76),
          borderRadius: 14,
          "& fieldset": {
            borderColor: COLOR_BORDER,
          },
          "&:hover fieldset": {
            borderColor: COLOR_ACCENT,
          },
          "&.Mui-focused fieldset": {
            borderColor: COLOR_SECONDARY,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: COLOR_FOREGROUND_MUTED,
          borderColor: COLOR_BORDER,
          backgroundColor: alpha(COLOR_SURFACE_ELEVATED, 0.45),
          "&.Mui-selected": {
            color: COLOR_FOREGROUND,
            backgroundColor: alpha(COLOR_SECONDARY, 0.24),
          },
        },
      },
    },
  },
});

function AuthWrapper({ children }: PropsWithChildren) {
  if (!AUTH_ENABLED) {
    return <>{children}</>;
  }

  return <Auth0Provider>{children}</Auth0Provider>;
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
