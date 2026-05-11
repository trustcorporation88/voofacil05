'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Compass, ArrowRight } from 'lucide-react';

export function FeaturedSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bento Item 1 */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="md:col-span-7 relative group overflow-hidden rounded-xl h-[500px]"
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj_meOkOrPXghBIRluQ8lbKfpRQA-F2zt4XEWyUwij5i__TsW9oM94IFMCk1oW2jE9JXCQH2LovEy5HbqhGoTlkQV3SGHCQBZqFQBdmWfVCK2FuMNqO2Weh-KQtmQ5TySyAnoHq0vPpqHNXzuRMI6BNbG7siShaCNDXK4Ku_O9cKQCM4tsgi-kv8t8BHcD29G52IiftHegP-gYuF-GoobvIUS6i3baW7j-APaVPwAtbFHNcrWnyiJhQb5EEBuO18PPivIFMqVUYRs"
            alt="Luxury Private Jet"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 to-transparent flex flex-col justify-end p-12">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-3">
              A Experiência
            </span>
            <h3 className="text-4xl font-bold text-white mb-4">Privacidade Inigualável</h3>
            <p className="text-white/80 max-w-md text-base leading-relaxed">
              Nossas cabines são projetadas como centros de comando móveis, com links de satélite
              criptografados e isolamento acústico para total discrição.
            </p>
          </div>
        </motion.div>

        {/* Bento Item 2 */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-5 bg-[#e9edff] p-12 flex flex-col justify-between rounded-xl"
        >
          <div>
            <Compass className="text-brand-charcoal w-12 h-12 mb-8" />
            <h3 className="text-4xl font-bold text-brand-charcoal mb-4">Rotas Diretas</h3>
            <p className="text-brand-gray-600 text-base leading-relaxed">
              Evite conexões. Voamos para mais de 5.000 aeroportos regionais no mundo, deixando
              você mais perto do seu destino final.
            </p>
          </div>
          <div className="mt-12">
            <div className="horizon-line mb-6 opacity-30" />
            <div className="flex justify-between items-center group cursor-pointer">
              <span className="text-[10px] font-bold text-brand-gray-600 uppercase tracking-widest group-hover:text-brand-charcoal transition-colors">
                REDE GLOBAL
              </span>
              <ArrowRight className="w-5 h-5 text-brand-charcoal transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        </motion.div>

        {/* Overlapping Card */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="md:col-span-12 -mt-16 z-20 flex justify-center md:justify-end md:pr-20"
        >
          <div className="bg-white p-8 border border-brand-gray-300 shadow-2xl max-w-md rounded-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-brand-charcoal" />
              <span className="text-[10px] font-bold text-brand-charcoal uppercase tracking-[0.3em]">
                EXCELÊNCIA TÉCNICA
              </span>
            </div>
            <h4 className="text-2xl font-bold text-brand-charcoal mb-4">Eficiência como Padrão</h4>
            <p className="text-brand-gray-600 text-sm leading-relaxed">
              Nossa plataforma mantém 99,8% de confiabilidade de despacho mecânico, garantindo que sua
              agenda nunca seja comprometida.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



