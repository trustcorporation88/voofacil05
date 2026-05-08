'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, Check, PlaneTakeoff, Users, TrendingUp } from 'lucide-react';

/* ── HISTÓRIA ─────────────────────────────────────────────────────────────── */
const TIMELINE = [
  { year: '2018', title: 'Fundação', desc: 'Cortex Airlines nasce com uma missão: democratizar o acesso à aviação executiva sem abrir mão do padrão de excelência.' },
  { year: '2020', title: 'Expansão Nacional', desc: 'Ampliamos a frota para 12 aeronaves cobrindo todos os estados brasileiros, com base em GRU, GIG e BSB.' },
  { year: '2022', title: 'Plataforma Digital', desc: 'Lançamos o sistema de reservas inteligente com busca em tempo real, alertas de preço e recomendação por IA.' },
  { year: '2024', title: 'Rotas Internacionais', desc: 'Inauguramos operações para Miami, Lisboa, Paris e Buenos Aires, consolidando o corredor premium transatlântico.' },
  { year: '2026', title: 'Referência do Setor', desc: 'Reconhecidos como o melhor operador de aviação executiva da América Latina pela Aviation Business Awards.' },
];

export function HistoriaSection() {
  return (
    <section id="história" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block text-[10px] font-bold text-brand-gray-600 uppercase tracking-[0.3em] mb-4">
          NOSSA TRAJETÓRIA
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-brand-charcoal tracking-tight">
          Uma História de Excelência
        </h2>
      </motion.div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-brand-gray-300 hidden md:block" />
        <div className="space-y-8">
          {TIMELINE.map(({ year, title, desc }, i) => (
            <motion.div
              key={year}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="md:pl-20 relative"
            >
              <div className="hidden md:flex absolute left-0 top-2 w-16 h-8 items-center justify-end pr-4">
                <div className="w-3 h-3 rounded-full bg-brand-charcoal border-2 border-brand-surface ring-2 ring-brand-charcoal/20" />
              </div>
              <div className="bg-white border border-brand-gray-300/50 rounded-2xl p-6 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-brand-gray-600 uppercase tracking-widest">{year}</span>
                <h3 className="text-lg font-bold text-brand-charcoal mt-1 mb-2">{title}</h3>
                <p className="text-sm text-brand-gray-600 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── VALORES ──────────────────────────────────────────────────────────────── */
const VALORES = [
  {
    icon: PlaneTakeoff,
    title: 'Excelência Operacional',
    desc: 'Cada voo é executado com o mais alto padrão técnico. Manutenção preventiva rigorosa e tripulação certificada ANAC/FAA.',
    bg: 'bg-brand-charcoal',
    fg: 'text-white',
  },
  {
    icon: Users,
    title: 'Cliente no Centro',
    desc: 'Você não é um passageiro — é o anfitrião. Cada detalhe é personalizado: rota, horário, catering, temperatura a bordo.',
    bg: 'bg-[#e9edff]',
    fg: 'text-brand-charcoal',
  },
  {
    icon: TrendingUp,
    title: 'Inovação Contínua',
    desc: 'IA para recomendação de voos, alertas de preço em tempo real e booking em menos de 3 minutos pelo nosso app.',
    bg: 'bg-white border border-brand-gray-300/50',
    fg: 'text-brand-charcoal',
  },
];

export function ValoresSection() {
  return (
    <section id="valores" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block text-[10px] font-bold text-brand-gray-600 uppercase tracking-[0.3em] mb-4">
          O QUE NOS MOVE
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-brand-charcoal tracking-tight">
          Nossos Valores
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VALORES.map(({ icon: Icon, title, desc, bg, fg }, i) => (
          <motion.div
            key={title}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-2xl p-10 flex flex-col gap-6 ${bg}`}
          >
            <Icon className={`w-10 h-10 ${fg}`} />
            <div>
              <h3 className={`text-xl font-bold mb-3 ${fg}`}>{title}</h3>
              <p className={`text-sm leading-relaxed ${fg} opacity-80`}>{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── BENEFÍCIOS ───────────────────────────────────────────────────────────── */
const BENEFICIOS = [
  'Acesso a mais de 5.000 aeroportos regionais — sem escalas forçadas',
  'Embarque em 15 minutos, sem filas e sem stress',
  'Privacidade total: sua reunião começa no ar',
  'Frota disponível 24/7, 365 dias por ano',
  'Catering personalizado com chefs parceiros',
  'Conectividade satellite de alta velocidade a bordo',
  'Suporte concierge dedicado antes, durante e após o voo',
  'Preços transparentes — sem taxas ocultas no checkout',
  'Alertas automáticos de melhor preço por rota',
  'IA integrada para análise e recomendação de voos',
];

export function BeneficiosSection() {
  return (
    <section id="benefícios" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <span className="inline-block text-[10px] font-bold text-brand-gray-600 uppercase tracking-[0.3em] mb-4">
          POR QUE VOAR COM A CORTEX
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-brand-charcoal tracking-tight">
          Benefícios Exclusivos{' '}
          <span className="text-2xl md:text-4xl font-medium text-brand-gray-500">(Em Breve)</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BENEFICIOS.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -15 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-4 bg-white border border-brand-gray-300/50 rounded-xl p-5"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-charcoal flex items-center justify-center mt-0.5">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-sm text-brand-gray-600 leading-relaxed">{item}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Quais companhias aéreas estão disponíveis na plataforma?',
    a: 'Buscamos passagens em todas as principais companhias: LATAM, Azul, Gol, American Airlines, Delta, Copa Airlines, TAP, Iberia, Air France e dezenas de outras nacionais e internacionais. Tudo em uma única busca, com comparação de preços em tempo real.',
  },
  {
    q: 'Como funciona a política de bagagem das companhias?',
    a: 'Varia por companhia e tarifa. LATAM: tarifa Basic inclui só item pessoal; tarifas Plus+ incluem 1 mala despachada de 23 kg. Azul: tarifa "Azul" não inclui despachada; "Mais Azul" inclui 1 peça de 23 kg. American Airlines e Copa (voos internacionais): 1ª mala a partir de USD 45–50. Delta: maioria das tarifas internacionais com 2 malas de 23 kg. Exibimos a política completa antes de você finalizar a compra.',
  },
  {
    q: 'Posso cancelar ou remarcar minha passagem?',
    a: 'Pela regra da ANAC, todas as companhias permitem cancelamento gratuito em até 24h após a compra (desde que a viagem seja em mais de 7 dias). Após esse prazo, as regras variam: LATAM e Azul cobram multa de até R$ 550 + diferença tarifária nas tarifas básicas. American Airlines e Delta não cobram taxa de alteração na maioria das tarifas (exceto Basic Economy). Sempre confira as condições da tarifa antes de comprar.',
  },
  {
    q: 'Com quanto tempo de antecedência devo comprar?',
    a: 'Para voos nacionais, os melhores preços costumam aparecer entre 3 e 8 semanas antes da viagem. Para internacionais (ex: voos para EUA com American, Delta ou Copa), recomendamos de 2 a 4 meses de antecedência. Use nosso alerta de preço para ser notificado quando o valor cair.',
  },
  {
    q: 'Como funcionam os alertas de preço?',
    a: 'Após realizar uma busca, clique em "Criar alerta" para monitorar a rota. Você recebe notificação por e-mail ou push quando o preço cair abaixo do valor que você definir — ideal para comprar na hora certa sem precisar ficar verificando manualmente.',
  },
  {
    q: 'O preço exibido inclui todas as taxas?',
    a: 'Sim. Os preços exibidos já incluem taxas aeroportuárias e impostos obrigatórios. Bagagens despachadas podem ter custo adicional conforme a tarifa de cada companhia — informamos isso claramente antes de você concluir a compra.',
  },
  {
    q: 'Posso comprar passagens de companhias diferentes na mesma viagem?',
    a: 'Sim. Combinar voos de companhias diferentes (ex: ida com LATAM e volta com Azul) pode resultar em preços menores. Nossa busca exibe automaticamente as combinações mais econômicas, incluindo opções multi-companhia.',
  },
  {
    q: 'Quais documentos preciso para viajar?',
    a: 'Voos nacionais: RG, CNH ou passaporte. Voos internacionais: passaporte válido e, quando necessário, visto do país de destino. Para os EUA (American Airlines e Delta), é obrigatório o ESTA ou visto americano. Para a América do Sul via Copa, verifique os requisitos do país destino.',
  },
];


function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-brand-gray-300/50 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-6 bg-white hover:bg-brand-surface transition-colors">
        <span className="text-sm font-semibold text-brand-charcoal pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-brand-gray-600 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </div>
      {open && (
        <div className="px-6 pb-6 bg-brand-surface border-t border-brand-gray-300/30">
          <p className="text-sm text-brand-gray-600 leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block text-[10px] font-bold text-brand-gray-600 uppercase tracking-[0.3em] mb-4">
          DÚVIDAS FREQUENTES
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-brand-charcoal tracking-tight">
          FAQ
        </h2>
      </motion.div>

      <div className="space-y-3">
        {FAQS.map((item) => (
          <FaqItem key={item.q} {...item} />
        ))}
      </div>
    </section>
  );
}
