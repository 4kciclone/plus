"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Smartphone, Zap, ShieldCheck, QrCode, Lock, Gauge, MessageCircle } from "lucide-react";

const SLIDE_COUNT = 3;
const AUTOPLAY_INTERVAL = 8000;

export function HeroCarousel() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setPage((prev) => (prev + newDirection + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      paginate(1);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, paginate]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section 
      className="relative w-full h-[700px] md:h-[800px] overflow-hidden bg-[#0A0A0B]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Absolute Dark Noise Background */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 200, damping: 30 }, opacity: { duration: 0.5 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
          className="absolute inset-0 w-full h-full"
        >
          {page === 0 && <Slide1 />}
          {page === 1 && <Slide2 />}
          {page === 2 && <Slide3 />}
        </motion.div>
      </AnimatePresence>

      {/* Modern Slide Tracking Indicator (Bottom Left) */}
      <div className="absolute bottom-12 left-6 md:left-24 z-30 flex items-center gap-4">
        <span className="text-white/80 font-bold text-sm">
          {page === 0 ? "01" : page === 1 ? "02" : "03"}
        </span>
        <div className="flex items-center gap-2">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > page ? 1 : -1);
                setPage(i);
              }}
              className="relative h-1 overflow-hidden transition-all duration-500 rounded-full"
              style={{ width: page === i ? '48px' : '24px', backgroundColor: 'rgba(255,255,255,0.1)' }}
              aria-label={`Slide ${i + 1}`}
            >
              {page === i && (
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary to-[#ff66b2]"
                />
              )}
            </button>
          ))}
        </div>
      </div>


      {/* Background Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }} />
    </section>
  );
}

// ==========================================
//                 SLIDES
// ==========================================

function Slide1() {
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-between relative z-10 px-6 md:px-24">
      {/* Background Deep Glows */}
      <div className="absolute -top-[20%] right-0 w-[800px] h-[800px] bg-[#FF0080]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-[20%] left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Left Content */}
      <div className="w-full md:w-1/2 flex flex-col items-start justify-center h-full pt-20 md:pt-0 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#15151A]/50 backdrop-blur-md mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Tecnologia 100% Fibra Óptica</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-[90px] font-black text-white leading-[0.95] tracking-tight mb-8">
          A internet<br />
          que<br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #FF0080, #E10098)" }}>redefine o</span><br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #FF0080, #E10098)" }}>impossível.</span>
        </h1>

        <p className="text-lg text-white/50 font-medium max-w-[450px] leading-relaxed mb-10">
          Conexão ultraestável para quem não pode parar. Trabalhe, jogue e assista em 4K sem interrupções.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/cadastro"
            className="h-14 px-10 rounded-xl bg-white text-black font-extrabold text-[15px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Assinar Agora <ChevronRight className="w-5 h-5" strokeWidth={3} />
          </Link>
          <Link
            href="#planos"
            className="h-14 px-10 rounded-xl bg-[#15151A] border border-white/5 text-white font-extrabold text-[15px] hover:bg-[#1A1A20] transition-colors flex items-center justify-center w-full sm:w-auto"
          >
            Ver Planos
          </Link>
        </div>
      </div>

      {/* Right Content: The GIGA Badge Graphic */}
      <div className="w-full md:w-1/2 h-full hidden md:flex items-center justify-center relative z-10">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
           className="relative w-[450px] h-[450px] bg-[#111115]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] shadow-2xl flex flex-col items-center justify-center"
         >
            {/* Concentric subtle rings */}
            <div className="absolute inset-0 border border-white/5 rounded-[40px] m-6 pointer-events-none" />
            <div className="absolute inset-0 border border-white/5 rounded-[40px] m-12 border-dashed pointer-events-none opacity-30" />
            
            {/* Glowing Main Circle */}
            <div className="relative w-48 h-48 bg-gradient-to-br from-[#FF0080] to-[#8B004B] rounded-full shadow-[0_0_80px_rgba(255,0,128,0.4)] flex items-center justify-center mb-8">
               <Zap className="w-20 h-20 text-white drop-shadow-lg" fill="currentColor" />
               {/* Orbital dots */}
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                 className="absolute inset-[-30px] border border-white/10 rounded-full"
               >
                 <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full blur-[1px]"></div>
               </motion.div>
            </div>

            <div className="text-center">
              <h2 className="text-6xl font-black text-white italic tracking-tighter leading-none mb-1">
                1<span className="text-white">GIGA</span>
              </h2>
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">
                Velocidade Real
              </p>
            </div>
         </motion.div>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-between relative z-10 px-6 md:px-24 bg-[#0A0A0B]">
      
      {/* Left Content */}
      <div className="w-full md:w-5/12 flex flex-col items-start justify-center h-full pt-20 md:pt-0 z-10">
        
        <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black text-white leading-[0.95] tracking-tight mb-8">
          Sua rede sob<br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #9D00FF, #FF0080)" }}>controle</span><br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #9D00FF, #FF0080)" }}>total.</span>
        </h1>

        <p className="text-[17px] text-white/50 font-medium max-w-[450px] leading-relaxed mb-12">
          Gerencie seu Wi-Fi, altere senhas e pague via PIX em segundos com o novo App Plus.
        </p>

        {/* Feature List */}
        <div className="flex flex-col gap-8 mb-12 w-full">
          {[
            { icon: QrCode, text: "PIX Instantâneo" },
            { icon: Lock, text: "Bloqueio de Intrusos" },
            { icon: Gauge, text: "Teste de Velocidade" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#15151A] border border-white/5 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-white font-bold text-[15px]">{item.text}</span>
            </motion.div>
          ))}
        </div>

        <Link
          href="/area-do-assinante"
          className="h-14 px-8 rounded-xl bg-white text-black font-extrabold text-[15px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 w-full sm:w-auto"
        >
          Baixar Aplicativo <ChevronRight className="w-5 h-5" strokeWidth={3} />
        </Link>
      </div>

      {/* Right Content: The Floating App Interface */}
      <div className="w-full md:w-7/12 h-full hidden md:flex items-center justify-end relative z-10">
         
         <div className="relative w-[500px] h-[750px] mt-24">
            {/* The Huge iPhone Silhouette */}
            <div className="absolute inset-0 bg-[#0F0F13] rounded-[60px] border-[14px] border-[#18181D] shadow-[0_0_100px_rgba(157,0,255,0.15)] flex flex-col items-center">
              {/* Dynamic Island */}
              <div className="w-[120px] h-[35px] bg-[#0A0A0B] rounded-full mt-4" />
              
              <div className="w-full px-8 mt-16 space-y-6">
                 {/* Fake UI Content inside phone */}
                 <div className="w-full h-12 bg-[#1A1A22] rounded-2xl" />
                 <div className="w-3/4 h-12 bg-[#1A1A22] rounded-2xl" />
                 
                 <div className="w-full h-[200px] bg-gradient-to-br from-[#1A1A22] to-[#15151A] rounded-[30px] border border-white/5 mt-12 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                      <Gauge className="w-8 h-8 text-primary" />
                    </div>
                    <div className="w-24 h-6 bg-[#2A2A35] rounded-full" />
                 </div>
              </div>

              {/* LUNA IA Assistant Button inside app */}
              <button 
                onClick={() => window.dispatchEvent(new Event('open-luna-chat'))}
                className="absolute bottom-12 left-8 right-8 h-[100px] rounded-[30px] bg-gradient-to-r from-[#FF0080] to-[#9D00FF] p-[2px] transition-transform hover:scale-105 active:scale-95"
              >
                 <div className="w-full h-full bg-gradient-to-r from-[#FF0080] to-[#9D00FF] rounded-[28px] flex flex-col items-center justify-center">
                    <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Assistente</span>
                    <span className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                       <MessageCircle className="w-5 h-5" /> Luna IA
                    </span>
                 </div>
              </button>
            </div>

            {/* Floating Glass Widget 1: PIX */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-32 -left-16 w-[240px] h-[80px] bg-[#1A1A20]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center gap-4 shadow-2xl"
            >
               <div className="w-12 h-12 rounded-xl bg-[#00E676]/20 flex items-center justify-center">
                 <QrCode className="w-6 h-6 text-[#00E676]" />
               </div>
               <div>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Pagamento</p>
                  <p className="text-white font-black text-[15px]">PIX Gerado</p>
               </div>
            </motion.div>

            {/* Floating Glass Widget 2: Security */}
            <motion.div 
               animate={{ y: [0, 15, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-48 -right-12 w-[220px] h-[80px] bg-[#1A1A20]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center gap-4 shadow-2xl"
            >
               <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                 <Lock className="w-6 h-6 text-red-500" />
               </div>
               <div>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Segurança</p>
                  <p className="text-white font-black text-[15px]">Bloqueado</p>
               </div>
            </motion.div>

         </div>

      </div>
    </div>
  );
}

function Slide3() {
  const combos = [
    { title: "100 MEGA", features: "PARAMOUNT + 3 MESES DEEZER", price: "99" },
    { title: "500 MEGA", features: "DEEZER + PARAMOUNT", price: "129" },
    { title: "500 MEGA", features: "MAX", price: "129" },
    { title: "800 MEGA", features: "PARAMOUNT + DEEZER", price: "159" },
    { title: "800 MEGA", features: "MAX", price: "159" },
    { title: "1 GIGA", features: "DEEZER + PARAMOUNT + MAX", price: "199" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative z-10 text-center px-6 border-t border-white/5 bg-[#0A0A0B]">
      
      {/* Light glow behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Centered Titles */}
      <div className="mb-12 flex flex-col items-center z-10">
        <h3 className="text-xl md:text-2xl text-white/50 font-medium tracking-[0.2em] uppercase mb-1">
          Conheça nossos
        </h3>
        <h2 className="text-[70px] md:text-[110px] font-black text-transparent bg-clip-text leading-none italic tracking-tighter" style={{
          backgroundImage: "linear-gradient(to bottom, #FF0080, #E10098, #ff66b2)",
          filter: "drop-shadow(0px 4px 20px rgba(255,0,128,0.3))",
          WebkitTextStroke: "1px rgba(255,255,255,0.1)",
          paddingBottom: '10px',
          paddingRight: '0.1em'
        }}>
          PLANOS
        </h2>
        <h3 className="text-2xl md:text-4xl text-white font-black uppercase mt-1">
          Com canais de streaming
        </h3>
      </div>

      {/* Centered Combo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full z-10">
         {combos.map((combo, i) => (
            <Link href="/cadastro" key={i}>
              <div className="group border-2 border-primary/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-[#15151A]/80 backdrop-blur-xl hover:border-primary/80 transition-all cursor-pointer shadow-[0_0_30px_rgba(255,0,128,0.05)] hover:shadow-[0_0_40px_rgba(255,0,128,0.2)] hover:-translate-y-1 duration-300">
                <h4 className="text-white font-black text-2xl uppercase">{combo.title}</h4>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-2 mb-4 h-8 flex items-center justify-center">
                  + {combo.features}
                </p>
                <div className="flex items-baseline text-white group-hover:text-primary transition-colors">
                  <span className="text-lg font-bold mr-1">R$</span>
                  <span className="text-5xl font-extrabold tracking-tighter leading-none">{combo.price}</span>
                  <span className="text-lg font-bold">,90</span>
                </div>
              </div>
            </Link>
         ))}
      </div>

    </div>
  );
}
