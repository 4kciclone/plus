"use client";
import { motion } from "framer-motion";

export function AnimatedLogo({ className = "", compact = false }: {
  className?: string; compact?: boolean
}) {
  const size = compact ? "w-11 h-12 md:w-14 md:h-16" : "w-24 h-28 md:w-32 md:h-36";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-2 ${className}`}
    >
      <div className={`relative ${size} shrink-0`}>
        <svg 
          viewBox="0 0 529 572" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Gradiente da Borda - Espectro Limpo */}
            <linearGradient id="premiumBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="25%" stopColor="#C8D400" />
              <stop offset="50%" stopColor="#00C853" />
              <stop offset="75%" stopColor="#00BCD4" />
              <stop offset="100%" stopColor="#E10098" />
            </linearGradient>

            {/* Gradiente do Glifo Magenta */}
            <linearGradient id="magentaGlifo" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E10098" />
              <stop offset="100%" stopColor="#AD0075" />
            </linearGradient>

            <filter id="logoDepth" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
               <feOffset dx="0" dy="10" result="offsetblur" />
               <feComponentTransfer>
                 <feFuncA type="linear" slope="0.3" />
               </feComponentTransfer>
               <feMerge>
                 <feMergeNode />
                 <feMergeNode in="SourceGraphic" />
               </feMerge>
            </filter>
          </defs>

          <g filter="url(#logoDepth)">
            {/* 1. CONTORNO TRIÂNGULO (Geometria Limpa) */}
            <motion.path
              d="M100,50 L460,266 Q490,286 460,306 L100,522 Q70,537 70,490 L70,82 Q70,35 100,50 Z"
              fill="white"
              stroke="url(#premiumBorder)"
              strokeWidth="34"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {/* 2. GLIFOS OFICIAIS (+ e J) - Escala reduzida para 75% (mais respiro) */}
            <g transform="translate(68, 75) scale(0.75)">
              <g transform="translate(0, 572) scale(0.1, -0.1)">
                {/* O J deitado (conforme original) */}
                <motion.path 
                  d="M1150 3745 l0 -365 834 0 c521 0 853 -4 887 -10 128 -24 244 -115 302 -237 30 -63 32 -76 32 -173 0 -95 -3 -111 -29 -167 -36 -79 -120 -160 -210 -205 l-66 -32 0 -363 c0 -200 4 -363 8 -363 5 0 51 7 103 16 308 53 578 229 752 490 149 224 215 485 188 744 -48 457 -348 825 -794 975 -163 54 -176 55 -1128 55 l-879 0 0 -365z"
                  fill="url(#magentaGlifo)"
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />

                {/* O sinal de + (conforme original) */}
                <motion.path 
                  d="M1150 2800 l0 -260 -270 0 -270 0 0 -355 0 -355 270 0 270 0 0 -330 0 -330 390 0 390 0 0 330 0 330 305 0 305 0 0 355 0 355 -305 0 -305 0 0 260 0 260 -390 0 -390 0 0 -260z"
                  fill="url(#magentaGlifo)"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Texto PLUS */}
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className={`${compact ? "text-3xl md:text-4xl" : "text-5xl md:text-7xl"} font-black tracking-tighter text-[#E10098]`}
        style={{ 
          lineHeight: 1, 
          fontFamily: 'var(--font-sora)', 
          textTransform: 'uppercase',
          filter: 'drop-shadow(0 2px 4px rgba(225,0,152,0.1))'
        }}
      >
        PLUS
      </motion.span>
    </motion.div>
  );
}