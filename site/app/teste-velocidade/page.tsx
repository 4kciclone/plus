"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Gauge, Download, Upload, Clock, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Phase = "idle" | "ping" | "download" | "upload" | "done";

export default function TesteVelocidadePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [ping, setPing] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // --- PING TEST ---
  const testPing = useCallback(async () => {
    setPhase("ping");
    setProgress(0);
    const pings: number[] = [];
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      await fetch(`${API}/speedtest/ping?t=${Date.now()}`, { cache: "no-store" });
      const elapsed = performance.now() - start;
      pings.push(elapsed);
      setProgress(((i + 1) / 10) * 100);
    }
    pings.sort((a, b) => a - b);
    const trimmed = pings.slice(1, -1);
    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    setPing(Math.round(avg));
  }, []);

  // --- DOWNLOAD TEST ---
  const testDownload = useCallback(async () => {
    setPhase("download");
    setProgress(0);
    setCurrentSpeed(0);
    const controller = new AbortController();
    abortRef.current = controller;

    const sizeMB = 25;
    const startTime = performance.now();
    let received = 0;
    const totalBytes = sizeMB * 1024 * 1024;

    try {
      const response = await fetch(`${API}/speedtest/download?size=${sizeMB}&t=${Date.now()}`, {
        cache: "no-store",
        signal: controller.signal,
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        const elapsed = (performance.now() - startTime) / 1000;
        const speedMbps = (received * 8) / (elapsed * 1000000);
        setCurrentSpeed(Math.round(speedMbps));
        setProgress(Math.min((received / totalBytes) * 100, 100));
      }

      const totalTime = (performance.now() - startTime) / 1000;
      const finalSpeed = Math.round((received * 8) / (totalTime * 1000000));
      setDownload(finalSpeed);
    } catch { } // network error
  }, []);

  // --- UPLOAD TEST ---
  const testUpload = useCallback(async () => {
    setPhase("upload");
    setProgress(0);
    setCurrentSpeed(0);

    const sizeMB = 10;
    const data = new Uint8Array(sizeMB * 1024 * 1024);
    for (let i = 0; i < data.length; i += 4096) {
      data[i] = Math.random() * 256;
    }

    const startTime = performance.now();

    try {
      await fetch(`${API}/speedtest/upload?t=${Date.now()}`, {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/octet-stream" },
        cache: "no-store",
      });

      const totalTime = (performance.now() - startTime) / 1000;
      const speedMbps = Math.round((data.length * 8) / (totalTime * 1000000));
      setUpload(speedMbps);
      setProgress(100);
    } catch { } // network error
  }, []);

  // --- RUN FULL TEST ---
  const runTest = useCallback(async () => {
    setDownload(0);
    setUpload(0);
    setPing(0);
    setCurrentSpeed(0);

    await testPing();
    await testDownload();
    await testUpload();

    setPhase("done");
    setProgress(100);
  }, [testPing, testDownload, testUpload]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const isRunning = phase !== "idle" && phase !== "done";

  const getPhaseLabel = () => {
    switch (phase) {
      case "ping": return "Medindo latência...";
      case "download": return "Medindo download...";
      case "upload": return "Medindo upload...";
      default: return "";
    }
  };

  const speedAngle = Math.min((currentSpeed / 1000) * 180, 180) - 90;

  const getDisplayValue = () => {
    if (phase === "ping") return ping || "...";
    if (phase === "download" || phase === "upload") return currentSpeed || "...";
    if (phase === "done") return download;
    return 0;
  };

  const getDisplayUnit = () => {
    if (phase === "ping") return "ms";
    return "Mbps";
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Kinetic Light Effects */}
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-heading text-white tracking-tighter mb-4">
            Speed<span className="text-primary italic">Test</span>
          </h1>
          <p className="text-slate-400 text-lg mb-16 max-w-lg mx-auto leading-relaxed">
            Mede a latência e as velocidades de download e upload direto para a infraestrutura core da Plus Internet.
          </p>

          {/* High Fidelity Speedometer */}
          <div className="relative w-full max-w-[400px] h-[260px] mx-auto mb-8 flex flex-col items-center justify-end overflow-hidden pb-6">
            <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-2xl overflow-visible">
              <defs>
                <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00BFFF" />
                  <stop offset="50%" stopColor="#FF0080" />
                  <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Ticks */}
              {Array.from({ length: 21 }).map((_, i) => {
                const angle = (i * 9) - 180;
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + 74 * Math.cos(rad);
                const y1 = 100 + 74 * Math.sin(rad);
                const x2 = 100 + 68 * Math.cos(rad);
                const y2 = 100 + 68 * Math.sin(rad);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                );
              })}

              {/* Animated Foreground Arc */}
              <motion.path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={phase === 'idle' ? '#1e293b' : 'url(#speedGradient)'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (Math.min(currentSpeed, 1000) / 1000))}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: phase === 'done' ? 0 : 251.2 - (251.2 * (Math.min(currentSpeed, 1000) / 1000)) }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                filter="url(#glow)"
              />

              {/* Center Pivot */}
              <circle cx="100" cy="100" r="6" fill="#f8fafc" />

              {/* Animated Needle */}
              <motion.g
                initial={{ rotate: -90 }}
                animate={{ rotate: phase === 'done' ? 90 : speedAngle }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                style={{ originX: "100px", originY: "100px" }}
              >
                <polygon points="98,100 102,100 100,30" fill="#f8fafc" filter="url(#glow)" />
              </motion.g>
            </svg>
            
            <div className="absolute bottom-6 flex flex-col items-center justify-center">
              {phase === "idle" ? (
                <div className="flex flex-col items-center text-slate-500">
                  <Gauge className="w-8 h-8 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pronto</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-6xl font-extrabold text-white tabular-nums tracking-tighter" style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}>
                    {getDisplayValue()}
                  </span>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{getDisplayUnit()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Phase Label */}
          <div className="h-8 mb-8">
            {isRunning && (
              <p className="text-primary font-bold text-sm uppercase tracking-widest animate-pulse">
                {getPhaseLabel()}
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="h-20 flex justify-center mb-12">
            {!isRunning && (
              <button
                onClick={runTest}
                className="px-14 py-5 rounded-full bg-primary text-white font-black text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                {phase === "done" ? <><RotateCcw className="w-5 h-5" /> Testar Novamente</> : "Iniciar Teste"}
              </button>
            )}
          </div>

          {/* Results Grid */}
          <AnimatePresence>
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
              >
                {[
                  { icon: Download, label: "Download", value: download, unit: "Mbps", text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
                  { icon: Upload, label: "Upload", value: upload, unit: "Mbps", text: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
                  { icon: Clock, label: "Ping", value: ping, unit: "ms", text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
                ].map((r, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                     {/* Glow */}
                     <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl transition-all ${r.bg} lg:opacity-50 lg:group-hover:opacity-100`} />
                     <div className="relative z-10">
                        <r.icon className={`w-8 h-8 mb-4 ${r.text}`} />
                        <p className="text-5xl font-black text-white tabular-nums tracking-tighter mb-1">{r.value}</p>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{r.label} <span className="text-slate-600">{r.unit}</span></p>
                     </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
