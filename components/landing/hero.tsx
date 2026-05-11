"use client";

import { motion } from "motion/react";
import { Bell, Plane, Search, ShieldCheck } from "lucide-react";

interface HeroProps {
  onDiscover: () => void;
  onBook: () => void;
}

const trustItems = [
  "Comparação rápida",
  "Alertas de preço",
  "Filtros inteligentes",
];

export function LandingHero({ onDiscover, onBook }: HeroProps) {
  return (
    <section className="relative min-h-[calc(100svh-88px)] w-full flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover saturate-[1.1] contrast-[1.12] brightness-[0.72]"
          style={{ objectPosition: "72% center" }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/50 to-slate-950/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-brand-surface/92" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:54px_54px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-24 md:pt-28 pb-10">
        <div className="max-w-[680px] rounded-[1.4rem] border border-white/16 bg-slate-950/34 p-5 sm:p-6 md:p-7 shadow-2xl backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/35 px-3.5 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md"
          >
            <Search className="w-4 h-4" />
            Compare passagens em segundos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="max-w-[620px] text-[2.45rem] sm:text-5xl md:text-[3.45rem] lg:text-[3.85rem] font-black text-white tracking-[-0.045em] leading-[0.98] drop-shadow-2xl"
          >
            Encontre seu próximo voo com mais clareza.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.2 }}
            className="mt-5 max-w-xl text-sm sm:text-base md:text-[1.05rem] font-semibold leading-relaxed text-white/92"
          >
            Busque passagens aéreas, compare opções, acompanhe alertas de preço e organize suas escolhas em uma plataforma simples e rápida.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.32 }}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <button
              type="button"
              onClick={onDiscover}
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-slate-950 text-[11px] font-black uppercase tracking-[0.16em] rounded-full hover:bg-cyan-100 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Plane className="w-4 h-4" />
              Buscar voos
            </button>

            <button
              type="button"
              onClick={onBook}
              className="w-full sm:w-auto px-7 py-3.5 border border-white/55 bg-slate-950/36 text-white text-[11px] font-black uppercase tracking-[0.16em] rounded-full hover:bg-white/18 transition-colors duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Bell className="w-4 h-4" />
              Criar alerta grátis
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44 }}
            className="mt-5 flex flex-wrap gap-2"
          >
            {trustItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-slate-950/36 px-3.5 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-md"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


