import { AuthGate } from "@/components/auth/AuthGate";
import { TradingDashboard } from "@/components/dashboard/TradingDashboard";

export default function Home() {
  return (
    // <AuthGate>
      <TradingDashboard />
    // </AuthGate>
  );
}
