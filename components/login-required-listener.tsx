"use client";

import { useEffect, useState } from "react";
import { Lock, X } from "lucide-react";

declare global {
  interface Window {
    __vcLoginFetchPatched?: boolean;
  }
}

type LoginRequiredPayload = {
  message?: string;
};

export function LoginRequiredListener() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(
    "Faça login para fazer uma cotação."
  );

  useEffect(() => {
    function onLoginRequired(event: Event) {
      const custom = event as CustomEvent<LoginRequiredPayload>;
      setMessage(
        custom.detail?.message ||
          "Entre ou cadastre-se gratuitamente para ver as cotações."
      );
      setVisible(true);
    }

    window.addEventListener("vooscortex:login-required", onLoginRequired);

    if (!window.__vcLoginFetchPatched) {
      window.__vcLoginFetchPatched = true;

      const originalFetch = window.fetch.bind(window);

      window.fetch = async (...args) => {
        const response = await originalFetch(...args);

        try {
          const url =
            typeof args[0] === "string"
              ? args[0]
              : args[0] instanceof Request
                ? args[0].url
                : "";

          const isQuotationApi =
            url.includes("/api/search-flights") ||
            url.includes("/api/price-calendar");

          if (isQuotationApi && response.status === 401) {
            const cloned = response.clone();
            const data = await cloned.json().catch(() => null);

            if (data?.loginRequired) {
              window.dispatchEvent(
                new CustomEvent("vooscortex:login-required", {
                  detail: {
                    message:
                      data?.error ||
                      "Entre ou cadastre-se gratuitamente para fazer sua cotação.",
                  },
                })
              );
            }
          }
        } catch {
          // não interfere na busca
        }

        return response;
      };
    }

    return () => {
      window.removeEventListener("vooscortex:login-required", onLoginRequired);
    };
  }, []);

  function openLogin() {
    setVisible(false);

    const buttons = Array.from(document.querySelectorAll("button"));
    const loginButton = buttons.find((button) =>
      (button.textContent || "").toLowerCase().includes("entrar")
    );

    if (loginButton instanceof HTMLButtonElement) {
      loginButton.click();
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[9999] px-4">
      <div className="mx-auto max-w-lg rounded-2xl border border-blue-200 bg-white shadow-2xl">
        <div className="flex items-start gap-3 p-4">
          <div className="mt-1 rounded-full bg-blue-50 p-2">
            <Lock className="h-5 w-5 text-blue-700" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-slate-900">
              Login obrigatório para cotação
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {message} O acesso ao site continua livre, mas as cotações de
              passagens são liberadas apenas para usuários logados.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openLogin}
                className="rounded-full bg-blue-700 px-5 py-2 text-sm font-bold text-white hover:bg-blue-800"
              >
                Entrar ou cadastrar
              </button>

              <button
                type="button"
                onClick={() => setVisible(false)}
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Agora não
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar aviso"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
