"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Gauge, Download, Upload, Clock, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

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
    // Remove highest and lowest, average the rest
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

    const sizeMB = 25; // Download 25MB
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
    } catch {
      // aborted or network error
    }
  }, []);

  // --- UPLOAD TEST ---
  const testUpload = useCallback(async () => {
    setPhase("upload");
    setProgress(0);
    setCurrentSpeed(0);

    const sizeMB = 10;
    const data = new Uint8Array(sizeMB * 1024 * 1024);
    // Fill with random-ish data
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
    } catch {
      // error
    }
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

  const getArcColor = () => {
    if (phase === "done") return "#00E676";
    if (phase === "ping") return "#FFC107";
    if (phase === "upload") return "#00BFFF";
    return "#FF0080"; // Download / Plus Pink
  };

  const speedAngle = Math.min((currentSpeed / 1000) * 180, 180) - 90; // -90 (left) to 90 (right)

  const getDisplayValue = () => {
    if (phase === "ping") return ping || "...";
    if (phase === "download") return currentSpeed || "...";
    if (phase === "upload") return currentSpeed || "...";
    if (phase === "done") return download;
    return 0;
  };

  const getDisplayUnit = () => {
    if (phase === "ping") return "ms";
    return "Mbps";
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#080b12] pt-[120px] pb-20 flex flex-col items-center">
        <div className="container mx-auto px-6 lg:px-12 py-16 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Teste de Velocidade</h1>
          <p className="text-white/50 text-lg mb-12">Mede a velocidade real da sua conexão contra o servidor da Plus.</p>

          {/* High Fidelity Speedometer Circle */}
          <div className="relative w-[320px] h-[220px] mx-auto mb-6 flex flex-col items-center justify-end overflow-hidden pb-4">
            <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-xl overflow-visible">
              <defs>
                <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00BFFF" />
                  <stop offset="50%" stopColor="#FF0080" />
                  <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#1a1f2e"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Ticks */}
              {Array.from({ length: 11 }).map((_, i) => {
                const angle = (i * 18) - 180;
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + 70 * Math.cos(rad);
                const y1 = 100 + 70 * Math.sin(rad);
                const x2 = 100 + 64 * Math.cos(rad);
                const y2 = 100 + 64 * Math.sin(rad);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" />
                );
              })}

              {/* Animated Foreground Arc (Progress mapped to Speed) */}
              <motion.path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={phase === 'idle' ? '#1a1f2e' : `url(#speedGradient)`}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (Math.min(currentSpeed, 1000) / 1000))}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: phase === 'done' ? 0 : 251.2 - (251.2 * (Math.min(currentSpeed, 1000) / 1000)) }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                filter="url(#glow)"
              />

              {/* Center Pivot */}
              <circle cx="100" cy="100" r="8" fill="#111827" stroke="#ffffff" strokeWidth="3" />

              {/* Animated Needle */}
              <motion.g
                initial={{ rotate: -90 }}
                animate={{ rotate: phase === 'done' ? 90 : speedAngle }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                style={{ originX: "100px", originY: "100px" }}
              >
                <polygon points="97,100 103,100 100,25" fill="#ffffff" filter="url(#glow)" />
              </motion.g>
            </svg>
            
            <div className="absolute bottom-4 flex flex-col items-center justify-center">
              {phase === "idle" ? (
                <div className="flex flex-col items-center opacity-40">
                  <Gauge className="w-8 h-8 text-white mb-1" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Pronto</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-extrabold text-white tabular-nums tracking-tighter" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
                    {getDisplayValue()}
                  </span>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">{getDisplayUnit()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Phase Label */}
          {isRunning && (
            <p className="text-white/40 font-bold text-sm uppercase tracking-widest mb-8 animate-pulse">{getPhaseLabel()}</p>
          )}

          {/* Action Button */}
          {!isRunning && (
            <button
              onClick={runTest}
              className="px-12 py-4 rounded-full bg-primary text-white font-extrabold text-lg hover:bg-[#c5007e] transition-colors mb-12 inline-flex items-center gap-3"
            >
              {phase === "done" ? <><RotateCcw className="w-5 h-5" /> Testar Novamente</> : "Iniciar Teste"}
            </button>
          )}

          {/* Results */}
          {phase === "done" && (
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-4">
              <div className="bg-[#111827] rounded-2xl p-6 border border-white/5">
                <Download className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-extrabold text-white tabular-nums">{download}</p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">Download Mbps</p>
              </div>
              <div className="bg-[#111827] rounded-2xl p-6 border border-white/5">
                <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-extrabold text-white tabular-nums">{upload}</p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">Upload Mbps</p>
              </div>
              <div className="bg-[#111827] rounded-2xl p-6 border border-white/5">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-extrabold text-white tabular-nums">{ping}</p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">Ping ms</p>
              </div>
            </div>
          )}

          <p className="text-white/20 text-xs mt-10 max-w-md mx-auto">
            Este teste mede a velocidade real entre o seu dispositivo e o servidor da Plus Internet.
            Os resultados podem variar conforme conexão Wi-Fi, cabo, horário e quantidade de dispositivos conectados.
          </p>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
