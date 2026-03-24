"use client";

import { PropsWithChildren } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AUTH_ENABLED } from "@/config/env";

export function AuthGate({ children }: PropsWithChildren) {
//   if (!AUTH_ENABLED) {
//     return (
//       <Container maxWidth="xl" sx={{ py: 3 }}>
//         <Alert severity="warning" sx={{ mb: 2 }}>
//           Auth0 is not configured. Set NEXT_PUBLIC_AUTH0_DOMAIN and
//           NEXT_PUBLIC_AUTH0_CLIENT_ID in .env.local to enable authentication.
//         </Alert>
//         {children}
//       </Container>
//     );
//   }

  return <>{children}</>;
}

// function AuthEnabledGate({ children }: PropsWithChildren) {
//   const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();

//   if (isLoading) {
//     return (
//       <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
//         <Paper elevation={0} sx={{ p: 4, border: "1px solid #dce3ec", maxWidth: 420 }}>
//           <Stack spacing={2}>
//             <Typography variant="h5" fontWeight={700}>
//               Real-time Stock Dashboard
//             </Typography>
//             <Typography color="text.secondary">
//               Please sign in with Auth0 to open your watchlist workspace.
//             </Typography>
//             <Button variant="contained" onClick={() => loginWithRedirect()}>
//               Login with Auth0
//             </Button>
//           </Stack>
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ py: 3 }}>
//       <Paper elevation={0} sx={{ p: 2, mb: 2, border: "1px solid #dce3ec" }}>
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Box>
//             <Typography variant="subtitle2" color="text.secondary">
//               Authenticated as
//             </Typography>
//             <Typography variant="h6">{user?.name ?? user?.email ?? "Trader"}</Typography>
//           </Box>
//           <Button
//             variant="outlined"
//             onClick={() =>
//               logout({ logoutParams: { returnTo: window.location.origin } })
//             }
//           >
//             Logout
//           </Button>
//         </Stack>
//       </Paper>
//       {children}
//     </Container>
//   );
// }
