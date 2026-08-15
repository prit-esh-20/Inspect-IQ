import AnimatedNumber from "../common/AnimatedNumber";
import GlassCard from "./GlassCard";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ 
  title, 
  value, 
  decimals = 0, 
  suffix = "", 
  icon: Icon, 
  trend, 
  trendType = "up", 
  description,
  className = "" 
}) {
  const isUp = trendType === "up";

  return (
    <GlassCard className={`relative overflow-hidden group ${className}`} hoverLift={true}>
      <div className="flex items-start justify-between">
        
        {/* Metric Info */}
        <div className="space-y-1">
          <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
            {title}
          </span>
          <div className="font-mono text-2xl md:text-3xl font-extrabold text-white flex items-baseline">
            <AnimatedNumber
              end={parseFloat(value)}
              decimals={decimals}
              duration={1.8}
            />
            <span className="text-accent text-sm md:text-base ml-1 font-semibold">{suffix}</span>
          </div>
        </div>

        {/* Floating Icon Wrapper */}
        {Icon && (
          <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/15 group-hover:border-accent/40 group-hover:bg-accent/10 transition-colors duration-300">
            <Icon className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}

      </div>

      {/* Trend Details */}
      {(trend || description) && (
        <div className="mt-4 pt-3 border-t border-accent/5 flex items-center justify-between text-[11px] font-sans text-[#9ca3af]">
          {trend ? (
            <div className="flex items-center gap-1">
              <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                isUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend}
              </span>
              <span className="text-[10px] text-slate-500">vs yesterday</span>
            </div>
          ) : (
            <div />
          )}

          {description && (
            <span className="font-mono text-[9px] text-accent/70 uppercase tracking-wider">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Futuristic accent corner dot */}
      <span className="absolute bottom-1 right-1 w-1 h-1 bg-accent/20 rounded-full" />
    </GlassCard>
  );
}
