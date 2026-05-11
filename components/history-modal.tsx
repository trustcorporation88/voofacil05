"use client";

import { useState, useEffect } from "react";
import { X, History, Search, Loader2 } from "lucide-react";

interface HistoryEntry {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  passengers: number;
  timestamp: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (params: { origin: string; destination: string; departureDate: string; returnDate?: string; passengers: number }) => void;
}

export default function HistoryModal({ isOpen, onClose, onSearch }: HistoryModalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSearch = (entry: HistoryEntry) => {
    onSearch({
      origin: entry.origin,
      destination: entry.destination,
      departureDate: entry.departureDate,
      returnDate: entry.returnDate || undefined,
      passengers: entry.passengers,
    });
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR");
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Agora";
    if (diffMin < 60) return `Há ${diffMin} min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return d.toLocaleDateString("pt-BR");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <History className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Histórico</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-500 mt-2">Carregando...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma busca realizada ainda</p>
            <p className="text-sm">Suas buscas recentes aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {entry.origin} → {entry.destination}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(entry.departureDate)}
                      {entry.returnDate && ` - ${formatDate(entry.returnDate)}`}
                      {" · "}{entry.passengers} {entry.passengers === 1 ? "passageiro" : "passageiros"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatTimestamp(entry.timestamp)}</p>
                  </div>
                  <button
                    onClick={() => handleRunSearch(entry)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2"
                    title="Buscar novamente"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


