"use client";

import { useEffect } from "react";

export function PwaBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    async function clearDevPwaCache() {
      if (process.env.NODE_ENV !== "development") return;

      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }

        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } catch {
        // silencioso em desenvolvimento
      }
    }

    async function registerProductionServiceWorker() {
      if (process.env.NODE_ENV !== "production") return;
      if (!("serviceWorker" in navigator)) return;

      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        // silencioso em produção
      }
    }

    clearDevPwaCache();
    registerProductionServiceWorker();
  }, []);

  return null;
}
