"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SESSION_STORAGE_KEY = "vc_session_key";
const LAST_PAGEVIEW_STORAGE_KEY = "vc_last_pageview";

function getOrCreateSessionKey() {
  if (typeof window === "undefined") return "";

  let key = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!key) {
    key =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `vc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_STORAGE_KEY, key);
  }

  return key;
}

async function postJSON(url: string, payload: Record<string, unknown>, keepalive = false) {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    keepalive,
  });
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionKeyRef = useRef<string>("");
  const startedRef = useRef(false);

  const fullPath = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    const sessionKey = getOrCreateSessionKey();
    sessionKeyRef.current = sessionKey;

    if (!startedRef.current && sessionKey) {
      startedRef.current = true;

      postJSON("/api/analytics/session", {
        action: "start",
        sessionKey,
        path: fullPath,
        referrer: document.referrer || null,
      }).catch(() => {});
    }

    const handlePageHide = () => {
      if (!sessionKeyRef.current || !navigator.sendBeacon) return;

      const payload = JSON.stringify({
        action: "end",
        sessionKey: sessionKeyRef.current,
        path: `${window.location.pathname}${window.location.search}`,
      });

      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/session", blob);
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [fullPath]);

  useEffect(() => {
    if (!sessionKeyRef.current) return;

    const now = Date.now();
    const signature = `${fullPath}|${document.title || ""}`;

    try {
      const lastRaw = sessionStorage.getItem(LAST_PAGEVIEW_STORAGE_KEY);
      if (lastRaw) {
        const last = JSON.parse(lastRaw);
        if (last.signature === signature && now - last.ts < 1200) {
          return;
        }
      }
      sessionStorage.setItem(
        LAST_PAGEVIEW_STORAGE_KEY,
        JSON.stringify({ signature, ts: now })
      );
    } catch {}

    postJSON("/api/analytics/pageview", {
      sessionKey: sessionKeyRef.current,
      path: fullPath,
      title: document.title || null,
      referrer: document.referrer || null,
    }).catch(() => {});

    const heartbeat = window.setInterval(() => {
      postJSON(
        "/api/analytics/session",
        {
          action: "heartbeat",
          sessionKey: sessionKeyRef.current,
          path: `${window.location.pathname}${window.location.search}`,
        },
        true
      ).catch(() => {});
    }, 15000);

    return () => {
      window.clearInterval(heartbeat);
    };
  }, [fullPath]);

  return null;
}
