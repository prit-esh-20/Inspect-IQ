import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Animations & Canvas Backgrounds
import LoadingScreen from "./components/animations/LoadingScreen";
import PCBBackground from "./components/animations/PCBBackground";

// Page Components
import LandingPage from "./pages/Landing/LandingPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LiveInspectionPage from "./pages/LiveInspection/LiveInspectionPage";
import HistoryPage from "./pages/History/HistoryPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import LoginPage from "./pages/Login/LoginPage";

// Hooks
import useSmoothScroll from "./hooks/useSmoothScroll";

// Inner shell — only mounts once isLoaded=true, so Lenis
// initializes when there is actual scrollable content in the DOM.
function AppShell() {
  const location = useLocation();
  useSmoothScroll();

  return (
    <div className="relative min-h-screen w-full text-slate-100 font-sans select-none antialiased">
      {/* Single persistent electronics background behind every route */}
      <PCBBackground />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inspection" element={<LiveInspectionPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Industrial Boot Scan Preloader */}
      <LoadingScreen onFinish={() => setIsLoaded(true)} />

      {/* Main app shell — mounts once loader signals completion */}
      {isLoaded && <AppShell />}
    </>
  );
}
