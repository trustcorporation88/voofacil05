'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

interface HeroProps {
  onDiscover: () => void;
  onBook: () => void;
}

type HeroVariant = 'A' | 'B';

const HERO_VARIANT_STORAGE_KEY = 'landing.hero.variant';

const HERO_COPY: Record<HeroVariant, {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  tags: string[];
  metrics: Array<{ value: string; label: string }>;
}> = {
  A: {
    badge: 'Compare em segundos',
    titleLine1: 'Voe Facil.',
    titleLine2: 'Compare. Decole.',
    description:
      'Encontre tarifas competitivas entre diversas companhias com filtros inteligentes e compra simplificada.',
    primaryCta: 'Buscar Voos',
    secondaryCta: 'Entrar para Salvar Alertas',
    tags: ['Multiplas cias', 'Preco competitivo', 'Suporte dedicado'],
    metrics: [
      { value: '+120', label: 'destinos monitorados' },
      { value: '24/7', label: 'busca automatizada' },
      { value: '1 min', label: 'media para comparar' },
    ],
  },
  B: {
    badge: 'Escolha com clareza',
    titleLine1: 'Seu proximo voo,',
    titleLine2: 'sem complicacao.',
    description:
      'Acompanhe os melhores precos, crie alertas e reserve com confianca no momento certo.',
    primaryCta: 'Encontrar Melhor Tarifa',
    secondaryCta: 'Criar Conta Gratis',
    tags: ['Alerta de preco', 'Reserva rapida', 'Atendimento humano'],
    metrics: [
      { value: '97%', label: 'usuarios satisfeitos' },
      { value: '+300k', label: 'consultas por mes' },
      { value: '0 taxa', label: 'cadastro na plataforma' },
    ],
  },
};

export function LandingHero({ onDiscover, onBook }: HeroProps) {
  const [variant, setVariant] = useState<HeroVariant>('A');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const forcedVariant = params.get('heroVariant')?.toUpperCase();
      if (forcedVariant === 'A' || forcedVariant === 'B') {
        const forced = forcedVariant as HeroVariant;
        setVariant(forced);
        localStorage.setItem(HERO_VARIANT_STORAGE_KEY, forced);
        return;
      }

      const saved = localStorage.getItem(HERO_VARIANT_STORAGE_KEY);
      if (saved === 'A' || saved === 'B') {
        setVariant(saved);
        return;
      }

      const assigned = Math.random() < 0.5 ? 'A' : 'B';
      setVariant(assigned);
      localStorage.setItem(HERO_VARIANT_STORAGE_KEY, assigned);
    } catch {
      // Keep default variant when browser storage is unavailable.
    }
  }, []);

  const copy = useMemo(() => HERO_COPY[variant], [variant]);

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full scale-105 object-cover saturate-[1.75] contrast-[1.15] brightness-[0.82] hue-rotate-[-18deg]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.62),transparent_46%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(14,116,144,0.35),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/58 via-slate-900/30 to-brand-surface/90" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:54px_54px]" />
      </div>

      {/* Decorative atmosphere layers */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.45 }}
          className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl"
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-20 pb-14 md:pt-24 md:pb-18">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-6 inline-flex items-center rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-white/90 backdrop-blur-md"
          >
            {copy.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-[-0.02em] leading-[1.08] drop-shadow-2xl break-words"
          >
            {copy.titleLine1}
            <span className="block text-cyan-100">{copy.titleLine2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.45 }}
            className="mt-4 max-w-xl text-sm sm:text-base md:text-base font-medium leading-relaxed text-slate-100/92"
          >
            {copy.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <button
              onClick={onDiscover}
              className="w-full sm:w-auto px-10 py-4 bg-white text-brand-gray-900 text-xs font-bold uppercase tracking-[0.18em] rounded-full hover:bg-cyan-100 transition-colors duration-300"
            >
              {copy.primaryCta}
            </button>
            <button
              onClick={onBook}
              className="w-full sm:w-auto px-10 py-4 border border-white/60 bg-white/10 text-white text-xs font-bold uppercase tracking-[0.18em] rounded-full hover:bg-white/20 transition-colors duration-300"
            >
              {copy.secondaryCta}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.85 }}
            className="mt-9 flex flex-wrap gap-2"
          >
            {copy.tags.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Metrics moved out of the first fold to avoid cropped strip on smaller viewports */}
      </div>

    </section>
  );
}
