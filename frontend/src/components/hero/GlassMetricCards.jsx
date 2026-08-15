"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Timer, Flame, ShieldCheck } from "lucide-react";
import AnimatedNumber from "../common/AnimatedNumber";

const metrics = [
  {
    icon: Target,
    label: "Detection Accuracy",
    value: 98.6,
    decimals: 1,
    suffix: "%",
  },
  {
    icon: Timer,
    label: "Inspection Time",
    value: 1.62,
    decimals: 2,
    suffix: "s",
  },
  {
    icon: Flame,
    label: "Explainability",
    text: "Grad-CAM",
  },
  {
    icon: ShieldCheck,
    label: "Verification Ready",
    text: "X-MCCV",
  },
];

export default function GlassMetricCards() {
  const [inView, setInView] = useState(false);

  return (
    <motion.div
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, amount: 0.3 }}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4 rounded-2xl border border-accent/10 bg-[rgba(13,27,23,0.72)] p-8 text-center shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/15 bg-accent/5">
            <metric.icon className="h-6 w-6 text-accent" />
          </div>
          <div>
            <div className="font-mono text-4xl font-semibold tracking-tight text-white">
              {metric.text ? (
                metric.text
              ) : (
                <>
                  {inView ? (
                    <AnimatedNumber
                      end={metric.value}
                      decimals={metric.decimals}
                      duration={1.4}
                      delay={0.2 + i * 0.1}
                    />
                  ) : (
                    0
                  )}
                  <span className="ml-1 text-lg text-accent">{metric.suffix}</span>
                </>
              )}
            </div>
            <div className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
              {metric.label}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
