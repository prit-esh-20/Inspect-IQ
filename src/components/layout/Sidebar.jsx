import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Camera, 
  History, 
  FileText, 
  LineChart, 
  Settings, 
  Cpu, 
  Thermometer, 
  HardDrive,
  Activity,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Live Inspection", path: "/inspection", icon: Camera },
    { name: "History Logs", path: "/history", icon: History },
    { name: "Quality Reports", path: "/reports", icon: FileText },
    { name: "Analytics", path: "/analytics", icon: LineChart },
    { name: "System Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-secondary-bg/80 border-r border-accent/10 flex flex-col h-screen fixed left-0 top-0 z-40 backdrop-blur-md">
      
      {/* User Avatar */}
      {user && (
        <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary-bg shadow-[0_0_14px_rgba(50,213,131,0.25)] ring-2 ring-accent/20">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white leading-tight truncate">{user.name}</span>
              <span className="text-[10px] text-slate-500 leading-tight truncate">{user.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="p-6 border-b border-accent/10">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-accent animate-pulse" />
          <h2 className="font-display font-bold tracking-widest text-sm text-white">PI-AOI CORE</h2>
        </div>
        <div className="bg-[#050816] rounded px-3 py-2 border border-accent/5 flex flex-col gap-1">
          <span className="font-mono text-[9px] uppercase tracking-wider text-accent">YOLO Engine</span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-300">v8.0.3-xai</span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success led-fast" />
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-lg font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-200 border group ${
                  isActive
                    ? "bg-accent/10 border-accent/40 text-accent shadow-[0_0_15px_rgba(0,229,255,0.08)]"
                    : "border-transparent text-slate-400 hover:text-white hover:bg-white/5 hover:border-accent/10"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-accent" : "text-slate-400 group-hover:text-accent"
                  }`} />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Hardware Status Monitoring (Simulating Raspberry Pi 4 specs) */}
      <div className="p-6 border-t border-accent/10 space-y-3 bg-[#050816]/40">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success led-slow" />
          <span className="font-display text-[10px] text-slate-400 uppercase tracking-wider font-bold">Hardware Telemetry</span>
        </div>
        
        <div className="space-y-2">
          {/* CPU Metric */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-accent" /> CPU</span>
              <span>24.5%</span>
            </div>
            <div className="h-1 bg-slate-900 rounded overflow-hidden border border-accent/5">
              <div className="h-full bg-accent" style={{ width: "24.5%" }} />
            </div>
          </div>

          {/* Temperature Metric */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-warning" /> TEMP</span>
              <span>48.2 °C</span>
            </div>
            <div className="h-1 bg-slate-900 rounded overflow-hidden border border-accent/5">
              <div className="h-full bg-warning" style={{ width: "60%" }} />
            </div>
          </div>

          {/* RAM Metric */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-success" /> RAM</span>
              <span>1.8 / 4.0 GB</span>
            </div>
            <div className="h-1 bg-slate-900 rounded overflow-hidden border border-accent/5">
              <div className="h-full bg-success" style={{ width: "45%" }} />
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
