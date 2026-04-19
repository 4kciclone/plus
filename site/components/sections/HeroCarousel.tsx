"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SLIDE_COUNT = 3;
const AUTOPLAY_INTERVAL = 8000;

interface SlideData {
  badge: string;
  headline: React.ReactNode;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  bgImage: string;
}

const slides: SlideData[] = [
  {
    badge: "Conexão Real",
    headline: "Internet para toda a família.",
    subtitle: "Ultra velocidade para todos os dispositivos ao mesmo tempo, sem interrupções ou lentidão.",
    ctaText: "Ver Planos",
    ctaHref: "/planos",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuChfsM5sxAr7rF_UfBPdwrn_uauNfihZAYVRGB4lfBH31WGmbd13IaVd7I8vsI4eiQ6JM8OerHQvQ4inqXXhqUIilhJa6IMXZ2TJ8Lw348yVuQ77llbr82BzxJCTS-kk_1qWRMqwVM4ix_P7TSqJ1pCW4yL7eSOvTCXa6dhhuXaGr0O7PXQEOjP_LTlEJFCsRShJe3-LADZ3onvNCZ8QKTfFxEvgsuOPP40R7g7mizSeDVgwfcLJOebsoNAs4_9TdWqELKbmVI5xC0R",
  },
  {
    badge: "Home Office",
    headline: "Trabalhe sem limites.",
    subtitle: "Estabilidade garantida para suas reuniões e downloads de arquivos pesados.",
    ctaText: "Conhecer Plus Business",
    ctaHref: "/planos",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA97nnaxo4TQ9pHGvci-CNt2tbNtcYSQU_Z28AzZHoDPlvjaph2nYQtaOHP7skDlZrn6RUNkr6U9ECQ6MTM15lDskPzO3ABD1AMjuCTQ41n3TDHgv12e2lcsVG_M5LXf2BTPL_XOkNZxrF8h_qcIuOCLu2OHGDTmryOWSZUauNwY1QoIfK_voreJA5eP108uyQOQudJdpO680GDjoi_hPczak66jQOEhkksziy3Rgq9FVzW4CbYVKRYFnk3dVrhzkLnkAyeT7XzWxUy",
  },
  {
    badge: "Entretenimento",
    headline: "Diversão em alta definição.",
    subtitle: "Streaming em 4K sem travamentos para toda a galera aproveitar junta.",
    ctaText: "Ver Planos de Lazer",
    ctaHref: "/planos",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPLIi6z8vXmAXD9iEEXfuBArVzV6wCYnc-zLd0m0loHmgN802xtV-xVJrx3e4Q1i6da7ErPNwiV1GSR54-3VeTIE0TaELRvjpOggIPWeSehT9mZN_mLcdvDbcunuAgFQcZbirMSEN0qIHWSTVmJDxZHpcRUtRzYOLYtYNEc4gjME_xeikDDH6Ygk02vzjyMTrH3b5JlstWvGAauI8LhzVu-OjNa1rd-cGw1Xf_aYEbJKLWGRosKNCh5HxLdDdxaTi3QUASIDNEgMN_",
  },
];

export function HeroCarousel() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setPage((prev) => (prev + newDirection + SLIDE_COUNT) % SLIDE_COUNT);
    },
    []
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => paginate(1), AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, paginate]);

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 80 : -80, opacity: 0 }),
  };

  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;
  const currentSlide = slides[page];

  return (
    <header
      className="relative mt-[72px] h-[550px] w-full overflow-hidden group"
      id="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 200, damping: 30 }, opacity: { duration: 0.4 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -10000) paginate(1);
              else if (swipe > 10000) paginate(-1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing z-20"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentSlide.bgImage}
                alt="Slide background"
                className="w-full h-full object-cover object-center pointer-events-none"
              />
            </div>

            {/* Panoramic Gradient Overlay */}
            <div className="absolute inset-0 hero-gradient z-10 pointer-events-none" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center px-8 md:px-24 z-20">
              <div className="max-w-2xl text-white">
                <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                  {currentSlide.badge}
                </span>
                
                <h1 className="text-5xl md:text-7xl font-headline font-extrabold leading-[1.1] mb-6 drop-shadow-xl text-white">
                  {currentSlide.headline}
                </h1>

                <p className="text-xl opacity-90 mb-10 max-w-lg text-white">
                  {currentSlide.subtitle}
                </p>

                <Link
                  href={currentSlide.ctaHref}
                  className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-surface transition-colors shadow-lg inline-block"
                >
                  {currentSlide.ctaText}
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators as required by code.html */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30" id="carousel-indicators">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setDirection(i > page ? 1 : -1);
                setPage(i);
              }}
              className={`h-3 rounded-full cursor-pointer transition-all duration-300 ${
                page === i ? "bg-white w-8 active" : "bg-white/40 w-3 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
