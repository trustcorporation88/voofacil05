"use client";

import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  currentPrice?: string;
}

export function CreateAlertModal({
  isOpen,
  onClose,
  origin,
  destination,
  departureDate,
  returnDate,
  passengers,
  currentPrice,
}: CreateAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(
    currentPrice ? String(Math.round(parseFloat(currentPrice) * 0.9)) : ""
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      setError("Informe um preço alvo válido");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          departureDate,
          returnDate: returnDate || null,
          passengers,
          targetPrice: parseFloat(targetPrice),
          currency: "BRL",
          tripType: returnDate ? "roundTrip" : "oneWay",
        }),
      });

      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao criar alerta");
      }
    } catch {
      setError("Erro ao criar alerta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        {done ? (
          <div className="text-center py-6">
            <Bell className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Alerta criado!</h3>
            <p className="text-gray-600">
              Você será notificado quando o preço de {origin} → {destination} cair abaixo de R${targetPrice}.
            </p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              OK
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-800">Criar Alerta de Preço</h2>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium text-gray-800">{origin} → {destination}</p>
              <p className="text-gray-500">{departureDate}{returnDate ? ` - ${returnDate}` : ""} · {passengers} pass</p>
              {currentPrice && <p className="text-gray-500">Preço atual: R${currentPrice}</p>}
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço alvo (R$) - Avise quando ficar abaixo de:
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Ex: 500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                autoFocus
                step="0.01"
              />

              {currentPrice && (
                <div className="flex gap-2 mb-4">
                  {[0.95, 0.90, 0.80, 0.70].map((pct) => {
                    const price = Math.round(parseFloat(currentPrice) * pct);
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTargetPrice(String(price))}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-100 rounded-full"
                      >
                        -{Math.round((1 - pct) * 100)}% = R${price}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                {loading ? "Criando..." : "Criar Alerta"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
