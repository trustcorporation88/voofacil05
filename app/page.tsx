"use client";

import { useState, useMemo } from "react";
import type { SearchParams, Flight } from "@/lib/types";
import { SearchForm } from "@/components/search-form";
import { Plane, Loader2, Filter } from "lucide-react";
import Image from "next/image";
import { FlightDetailsModal } from "@/components/flight-details-modal";

type FilterType = 'all' | 'direct' | '1-stop' | '2-stops' | 'cheapest';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setLoading(true);
    setError(null);
    setFlights([]);
    setActiveFilter('all'); // Reset filter on new search

    try {
      const response = await fetch('/api/search-flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar voos');
      }

      setFlights(data.flights || []);
      
      if (data.flights.length === 0) {
        setError(data.message || 'Nenhum voo encontrado para esta busca.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar voos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar voos baseado no filtro ativo
  const filteredFlights = useMemo(() => {
    if (activeFilter === 'all') return flights;
    
    let filtered = [...flights];
    
    if (activeFilter === 'direct') {
      filtered = filtered.filter(f => (f.stops ?? 0) === 0);
    } else if (activeFilter === '1-stop') {
      filtered = filtered.filter(f => (f.stops ?? 0) === 1);
    } else if (activeFilter === '2-stops') {
      filtered = filtered.filter(f => (f.stops ?? 0) >= 2);
    } else if (activeFilter === 'cheapest') {
      filtered = filtered.sort((a, b) => {
        const priceA = parseFloat(a.price.total) || Infinity;
        const priceB = parseFloat(b.price.total) || Infinity;
        return priceA - priceB;
      });
    }
    
    return filtered;
  }, [flights, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Voo Fácil - Sua Jornada começa aqui"
              width={400}
              height={200}
              priority
              className="max-w-sm w-full h-auto"
            />
          </div>
          <p className="text-xl text-gray-600">
            Encontre os melhores preços em tempo real
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plane className="w-6 h-6" />
            Buscar Voos
          </h2>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {loading && (
          <div className="bg-white rounded-lg p-12 text-center shadow-lg">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-xl text-gray-700 font-medium">
              Buscando voos...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Procurando as melhores ofertas para você
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {flights.length > 0 && !loading && (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              ✈️ Encontramos {flights.length} voo{flights.length !== 1 ? 's' : ''}!
            </h3>
            
            {/* Parceria Aviasales */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                ℹ️ Temos parceria com <strong>AVIASALES</strong>, um dos maiores buscadores de passagem da União Européia
              </p>
            </div>

            {/* Filtros */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-700">Filtrar por:</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Todos ({flights.length})
                </button>
                <button
                  onClick={() => setActiveFilter('direct')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === 'direct'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Diretos ({flights.filter(f => (f.stops ?? 0) === 0).length})
                </button>
                <button
                  onClick={() => setActiveFilter('1-stop')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === '1-stop'
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  1 Parada ({flights.filter(f => (f.stops ?? 0) === 1).length})
                </button>
                <button
                  onClick={() => setActiveFilter('2-stops')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === '2-stops'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  2+ Paradas ({flights.filter(f => (f.stops ?? 0) >= 2).length})
                </button>
                <button
                  onClick={() => setActiveFilter('cheapest')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === 'cheapest'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  💰 Mais Barato
                </button>
              </div>
              {filteredFlights.length === 0 && activeFilter !== 'all' && (
                <p className="text-sm text-gray-500 mt-3">
                  Nenhum voo encontrado com este filtro.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {filteredFlights.map((flight, index) => (
                <div
                  key={flight.id || index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-bold text-blue-600">
                          R$ {flight.price.total}
                        </span>
                        <span className="text-sm text-gray-500">
                          {flight.airline || 'Companhia Aérea'}
                        </span>
                        {flight.stops !== undefined && (
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            (flight.stops ?? 0) === 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {(flight.stops ?? 0) === 0 ? 'Direto' : `${flight.stops} parada${(flight.stops ?? 0) > 1 ? 's' : ''}`}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || searchParams?.origin} 
                        {' → '}
                        {flight.itineraries?.[0]?.segments?.[flight.itineraries[0].segments.length - 1]?.arrival?.iataCode || searchParams?.destination}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFlight(flight)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Detalhes */}
        {selectedFlight && (
          <FlightDetailsModal
            flight={selectedFlight}
            searchParams={searchParams}
            onClose={() => setSelectedFlight(null)}
          />
        )}

        {searchParams && !loading && flights.length === 0 && !error && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Parâmetros de Busca:
            </h3>
            <pre className="bg-white p-4 rounded text-sm overflow-auto">
              {JSON.stringify(searchParams, null, 2)}
            </pre>
          </div>
        )}

        <footer className="text-center mt-16 text-gray-600">
          <p>© 2026 Voo Fácil • Sua jornada começa aqui</p>
        </footer>
      </div>
    </div>
  );
}
