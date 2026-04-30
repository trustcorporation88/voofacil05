"use client";

import { useState } from "react";
import type { SearchParams, Flight } from "@/lib/types";
import { SearchForm } from "@/components/search-form";
import { Plane, Loader2 } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setLoading(true);
    setError(null);
    setFlights([]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-3">✈️ Voo Fácil</h1>
          <p className="text-xl text-gray-600">
            Busque os melhores voos em tempo real
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🔍 Busque seu voo ideal
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
            <div className="space-y-4">
              {flights.map((flight, index) => (
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
                            flight.stops === 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {flight.stops === 0 ? 'Direto' : `${flight.stops} parada${flight.stops > 1 ? 's' : ''}`}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || searchParams?.origin} 
                        {' → '}
                        {flight.itineraries?.[0]?.segments?.[flight.itineraries[0].segments.length - 1]?.arrival?.iataCode || searchParams?.destination}
                      </div>
                    </div>
                    {flight.purchaseUrl && (
                      <a
                        href={flight.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Ver Detalhes
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
