"use client";

import { useEffect } from "react";

export function PwaBootstrap() {
  useEffect(() => {
    async function cleanupPwa() {
      try {
        let changed = false;

        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();

          for (const registration of registrations) {
            const ok = await registration.unregister();
            if (ok) changed = true;
          }
        }

        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
          if (cacheNames.length > 0) changed = true;
        }

        if (changed) {
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
      } catch (error) {
        console.error("Erro ao limpar PWA/Service Worker:", error);
      }
    }

    cleanupPwa();
  }, []);

  return null;
}
