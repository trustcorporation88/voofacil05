'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

interface HeroProps {
  onDiscover: () => void;
  onBook: () => void;
}

export function LandingHero({ onDiscover, onBook }: HeroProps) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-brand-surface/90" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center max-w-4xl px-6 pt-32">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-7xl md:text-[120px] font-bold text-white tracking-tighter leading-none drop-shadow-2xl"
        >
          Voe Fácil,
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold text-white/70 tracking-tighter leading-none mt-2 drop-shadow-xl"
        >
          Voe Conosco.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-sm md:text-base font-semibold text-white/60 mt-6 mb-12 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest"
        >
          Todas as cias em um só lugar com toda facilidade e preço competitivo
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onDiscover}
            className="w-full sm:w-auto px-12 py-4 bg-brand-gray-300 text-brand-gray-900 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-gray-500 hover:text-white transition-all duration-300"
          >
            Reservar
          </button>
        </motion.div>
      </div>

    </section>
  );
}
