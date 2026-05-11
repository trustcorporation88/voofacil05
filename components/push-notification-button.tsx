"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";

const urlB64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array(rawData.length).map((_, i) => rawData.charCodeAt(i));
};

export function PushNotificationButton() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setSupported(false);
        setLoading(false);
        return;
      }
      setSupported(true);

      const registration = await registerSW();
      const sub = await registration.pushManager.getSubscription();
      setSubscribed(!!sub);

      if (sub) {
        await saveSubscription(sub);
      }
    } catch (err) {
      console.error("Push check error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const registerSW = async () => {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) return reg;
      return navigator.serviceWorker.register("/sw.js", { scope: "/" });
    } catch {
      throw new Error("SW registration failed");
    }
  };

  const saveSubscription = async (sub: PushSubscription) => {
    try {
      await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
    } catch (err) {
      console.error("Save sub error:", err);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const registration = await registerSW();

      const vapidPublicKey = "BAHUmIWgS-novgCeiFFqU3RZfCDrDEkwkhIqt57oBpk2aS2GR7lNkPU1Rb3m_6LyaIBv9FK6aiq_MPs9WN8idPM";
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapidPublicKey),
      });

      await saveSubscription(sub);
      setSubscribed(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        alert("Permissão de notificação negada. Habilite nas configurações do navegador.");
      }
      console.error("Subscribe error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const registration = await registerSW();
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
      }
      await fetch("/api/push-subscribe", { method: "DELETE" });
      setSubscribed(false);
    } catch (err) {
      console.error("Unsubscribe error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!supported) return null;

  if (loading) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        Verificando...
      </button>
    );
  }

  return subscribed ? (
    <button
      onClick={handleUnsubscribe}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Desativar notificações push"
    >
      <BellOff className="w-4 h-4" />
      Notificações ativas
    </button>
  ) : (
    <button
      onClick={handleSubscribe}
      className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      title="Receber notificações no navegador"
    >
      <Bell className="w-4 h-4" />
      Ativar notificações
    </button>
  );
}


