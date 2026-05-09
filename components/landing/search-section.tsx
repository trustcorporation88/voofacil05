'use client';

import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import type { SearchParams } from '@/lib/types';
import { AirportSelect } from '@/components/ui/airport-select';
import { REGIONS, getDefaultPassengersForRegion } from '@/lib/regions-config';

interface SearchSectionProps {
  onSearch: (params: SearchParams) => Promise<void>;
  loading: boolean;
  initialParams?: SearchParams | null;
}

export function LandingSearchSection({ onSearch, loading, initialParams }: SearchSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState(initialParams?.region || 'brasil');
  const [form, setForm] = useState<SearchParams>({
    origin: initialParams?.origin || '',
    destination: initialParams?.destination || '',
    departureDate: initialParams?.departureDate || '',
    returnDate: initialParams?.returnDate || '',
    passengers: initialParams?.passengers || getDefaultPassengersForRegion('brasil'),
    tripType: initialParams?.tripType || 'roundTrip',
    region: initialParams?.region || 'brasil',
  });

  const handleRegionChange = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
    setForm((prev) => ({
      ...prev,
      region: regionId,
      passengers: getDefaultPassengersForRegion(regionId),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.origin || !form.destination || !form.departureDate) return;
    await onSearch({ ...form, tripType: form.returnDate ? 'roundTrip' : 'oneWay' });
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="início" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block text-[10px] sm:text-xs font-bold text-brand-gray-600 uppercase tracking-[0.3em] mb-4">
          ENCONTRE SEU VOO
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-brand-charcoal tracking-tight">
          Para onde vamos?
        </h2>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-brand-gray-300/50 rounded-2xl p-6 md:p-10 shadow-xl"
      >
        {/* Region selector */}
        <div className="mb-6">
          <label className="block text-[10px] font-bold text-brand-gray-600 uppercase tracking-widest mb-2">
            Região
          </label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRegionChange(r.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                  selectedRegion === r.id
                    ? 'bg-brand-charcoal text-white'
                    : 'border border-brand-gray-300 text-brand-gray-600 hover:border-brand-charcoal hover:text-brand-charcoal'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Origin / Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-brand-gray-600 uppercase tracking-widest mb-2">
              Origem
            </label>
            <div className="airport-select-premium">
              <AirportSelect
                value={form.origin}
                onChange={(iata) => setForm({ ...form, origin: iata })}
                placeholder="Cidade ou código IATA"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-brand-gray-600 uppercase tracking-widest mb-2">
              Destino
            </label>
            <div className="airport-select-premium">
              <AirportSelect
                value={form.destination}
                onChange={(iata) => setForm({ ...form, destination: iata })}
                placeholder="Cidade ou código IATA"
              />
            </div>
          </div>
        </div>

        {/* Dates + Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-[10px] font-bold text-brand-gray-600 uppercase tracking-widest mb-2">
              Ida
            </label>
            <input
              type="date"
              value={form.departureDate}
              onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
              required
              className="w-full px-4 py-3 bg-brand-surface border border-brand-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-charcoal transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-brand-gray-600 uppercase tracking-widest mb-2">
              Volta
            </label>
            <input
              type="date"
              value={form.returnDate || ''}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value || undefined })}
              className="w-full px-4 py-3 bg-brand-surface border border-brand-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-charcoal transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-brand-gray-600 uppercase tracking-widest mb-2">
              Passageiros
            </label>
            <select
              value={form.passengers}
              onChange={(e) => setForm({ ...form, passengers: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-brand-surface border border-brand-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-charcoal transition-colors"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'passageiro' : 'passageiros'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          {loading ? 'Buscando voos...' : 'Buscar Voos'}
        </button>
      </motion.form>
    </section>
  );
}
