import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Cpu, Lock, Sparkles } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import Button from "../../components/common/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState("operator");

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <PageWrapper className="relative min-h-screen overflow-hidden">

      <main className="relative flex min-h-screen items-center justify-center px-4 py-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[rgba(50,213,131,0.18)] bg-[rgba(13,27,23,0.82)] shadow-[0_25px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden border-b border-[rgba(50,213,131,0.16)] p-8 lg:border-b-0 lg:border-r lg:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(50,213,131,0.16),_transparent_40%)]" />
              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(50,213,131,0.2)] bg-[rgba(50,213,131,0.08)] px-3 py-1.5 text-[10px] uppercase tracking-[0.35em] text-accent">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Industrial Access
                </div>

                <div className="space-y-4">
                  <h1 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
                    Enter the command layer of the AOI platform.
                  </h1>
                  <p className="max-w-xl text-sm leading-7 text-slate-400">
                    Authenticate into the embedded inspection environment to
                    access live defect intelligence, inspection history, and
                    enterprise-grade reporting.
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-[rgba(50,213,131,0.14)] bg-[rgba(7,17,15,0.75)] p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Cpu className="h-4 w-4 text-accent" />
                    Edge compute status: online
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Sparkles className="h-4 w-4 text-accent" />
                    XAI verification pipeline: ready
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                    Access mode
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { id: "operator", label: "Operations" },
                      { id: "engineering", label: "Engineering" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                          selectedMode === mode.id
                            ? "border-[rgba(50,213,131,0.3)] bg-[rgba(50,213,131,0.1)] text-white"
                            : "border-[rgba(50,213,131,0.12)] bg-[rgba(9,19,16,0.7)] text-slate-400"
                        }`}
                      >
                        <div className="font-display text-sm uppercase tracking-[0.25em]">
                          {mode.label}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Secure console access
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-[rgba(50,213,131,0.14)] bg-[rgba(7,17,15,0.7)] p-4">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-slate-500">
                    Operator credentials
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-[rgba(50,213,131,0.12)] bg-[rgba(11,24,20,0.9)] px-4 py-3">
                    <Lock className="h-4 w-4 text-accent" />
                    <input
                      readOnly
                      value="ops@pi-aoi.local"
                      className="w-full bg-transparent text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center gap-2"
                >
                  Access Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </PageWrapper>
  );
}
