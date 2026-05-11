"use client";

import { useState, useEffect } from "react";
import { X, Bell, BellOff, Trash2, Loader2, TrendingDown } from "lucide-react";
import { PushNotificationButton } from "@/components/push-notification-button";

interface PriceAlert {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  passengers: number;
  targetPrice: number;
  currency: string;
  isActive: boolean;
  lastPrice?: number | null;
  lastChecked?: string | null;
  createdAt: string;
}

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertsModal({ isOpen, onClose }: AlertsModalProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) fetchAlerts();
  }, [isOpen]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error("Erro ao carregar alertas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (alert: PriceAlert) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: alert.id, isActive: !alert.isActive }),
      });
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === alert.id ? { ...a, isActive: !a.isActive } : a))
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar alerta:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Erro ao remover alerta:", err);
    }
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
          <Bell className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">Alertas de Preço</h2>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <TrendingDown className="w-4 h-4 inline mr-1" />
            Ativamos quando o preço cair abaixo do seu alvo. Verificamos a cada 30 minutos.
          </p>
        </div>

        <div className="mb-4">
          <PushNotificationButton />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-500 mt-2">Carregando...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum alerta configurado</p>
            <p className="text-sm">Crie alertas nos resultados de busca para ser notificado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-3 transition-colors ${
                alert.isActive ? "border-gray-200" : "border-gray-100 bg-gray-50 opacity-60"
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${alert.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                      <p className="font-semibold text-gray-800">
                        {alert.origin} → {alert.destination}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(alert.departureDate)}
                      {alert.returnDate && ` - ${formatDate(alert.returnDate)}`}
                      {" · "}{alert.passengers} {alert.passengers === 1 ? "pass" : "pass"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-medium text-gray-700">
                        Alvo: R${alert.targetPrice}
                      </span>
                      {alert.lastPrice && (
                        <span className={`text-sm ${alert.lastPrice <= alert.targetPrice ? "text-green-600 font-bold" : "text-gray-500"}`}>
                          Último: R${alert.lastPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleToggle(alert)}
                      className={`p-2 rounded-lg transition-colors ${
                        alert.isActive
                          ? "text-yellow-600 hover:bg-yellow-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                      title={alert.isActive ? "Desativar" : "Ativar"}
                    >
                      {alert.isActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
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


