"use client";

import { useState } from "react";
import type { SearchParams } from "@/lib/types";
import { SearchForm } from "@/components/search-form";

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setHasSearched(true);
    console.log("Search params:", params);
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
          <SearchForm onSearch={handleSearch} loading={false} />
        </div>

        {hasSearched && searchParams && (
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
