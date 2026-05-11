"use client";

import { useState, useEffect } from "react";
import { X, Bell, CheckCheck, Loader2 } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRead: () => void;
}

export default function NotificationsModal({ isOpen, onClose, onRead }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onRead();
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diffMin < 1) return "Agora";
    if (diffMin < 60) return `Há ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Há ${diffH}h`;
    return d.toLocaleDateString("pt-BR");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como lidas
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-lg border ${n.read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200"}`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="w-2 h-2 mt-2 rounded-full bg-blue-600 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
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


