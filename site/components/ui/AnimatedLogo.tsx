"use client";

import { motion } from "framer-motion";

export function AnimatedLogo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const triangleGradient = {
    id: "triangleGradient",
    colors: [
      { offset: "0%", color: "#FF8C00" }, // Orange
      { offset: "33%", color: "#FF1493" }, // Pink
      { offset: "66%", color: "#00BFFF" }, // Blue
      { offset: "100%", color: "#32CD32" }, // Green
    ],
  };

  const textGradient = {
    id: "textGradient",
    colors: [
      { offset: "0%", color: "#FF007F" }, // Bright Pink
      { offset: "100%", color: "#8B004B" }, // Dark Pink
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex items-center gap-2 ${className}`}
    >
      {/* Logo Icon Container */}
      <div className={compact ? "relative w-8 h-8 md:w-10 md:h-10 shrink-0" : "relative w-16 h-16 md:w-24 md:h-24 shrink-0"}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <linearGradient id={triangleGradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
              {triangleGradient.colors.map((c, i) => (
                <stop key={i} offset={c.offset} stopColor={c.color} />
              ))}
            </linearGradient>

            <linearGradient id={textGradient.id} x1="0%" y1="0%" x2="0%" y2="100%">
              {textGradient.colors.map((c, i) => (
                <stop key={i} offset={c.offset} stopColor={c.color} />
              ))}
            </linearGradient>
            
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
              <feOffset dx="2" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Rounded Triangle (Play Button) */}
          <motion.path
            d="M170,100 L50,170 Q30,180 30,160 L30,40 Q30,20 50,30 L170,100 Z"
            stroke={`url(#${triangleGradient.id})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* The "P" inside */}
          <motion.path
            d="M65,70 L90,70 Q110,70 110,90 Q110,110 90,110 L65,110 L65,130 M65,90 L90,90"
            stroke="#FF007F"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />

          {/* The "+" sign */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
          >
            <path
              d="M125,85 L125,105 M115,95 L135,95"
              stroke="#FF007F"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </div>

      {/* "PLUS" Text */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="flex items-center"
      >
        <span
          className={`${compact ? "text-2xl md:text-3xl" : "text-5xl md:text-6xl"} font-black tracking-tighter italic`}
          style={{
            background: `linear-gradient(to bottom, #FF007F, #8B004B)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            paddingBottom: compact ? '2px' : '6px',
            paddingRight: '0.1em', // Fixes the italic 'S' being cut off
          }}
        >
          PLUS
        </span>
      </motion.div>
    </motion.div>
  );
}
