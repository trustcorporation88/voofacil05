"use client";

import { useState, useEffect } from "react";
import { X, Heart, Trash2, Search, Plus, Loader2 } from "lucide-react";

interface SavedSearch {
  id: string;
  name: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  passengers: number;
  createdAt: string;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (params: { origin: string; destination: string; departureDate: string; returnDate?: string; passengers: number }) => void;
  currentSearch?: { origin: string; destination: string; departureDate: string; returnDate?: string; passengers: number } | null;
}

export default function FavoritesModal({ isOpen, onClose, onSearch, currentSearch }: FavoritesModalProps) {
  const [favorites, setFavorites] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  useEffect(() => {
    if (isOpen) fetchFavorites();
  }, [isOpen]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.savedSearches || []);
      }
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentSearch || !saveName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: saveName.trim(),
          origin: currentSearch.origin,
          destination: currentSearch.destination,
          departureDate: currentSearch.departureDate,
          returnDate: currentSearch.returnDate || null,
          passengers: currentSearch.passengers,
        }),
      });
      if (res.ok) {
        setSaveName("");
        setShowSaveInput(false);
        await fetchFavorites();
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/favorites?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error("Erro ao remover:", err);
    }
  };

  const handleRunSearch = (fav: SavedSearch) => {
    onSearch({
      origin: fav.origin,
      destination: fav.destination,
      departureDate: fav.departureDate,
      returnDate: fav.returnDate || undefined,
      passengers: fav.passengers,
    });
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
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
          <Heart className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800">Favoritos</h2>
        </div>

        {currentSearch && (
          <div className="mb-4">
            {!showSaveInput ? (
              <button
                onClick={() => setShowSaveInput(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Salvar busca atual
              </button>
            ) : (
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da busca</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder='Ex: "Viagem Paris"'
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving || !saveName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-500 mt-2">Carregando...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma busca salva ainda</p>
            <p className="text-sm">Salve suas rotas favoritas para acesso rápido</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => (
              <div key={fav.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{fav.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {fav.origin} → {fav.destination}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(fav.departureDate)}
                      {fav.returnDate && ` - ${formatDate(fav.returnDate)}`}
                      {" · "}{fav.passengers} {fav.passengers === 1 ? "passageiro" : "passageiros"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleRunSearch(fav)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Buscar"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(fav.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
