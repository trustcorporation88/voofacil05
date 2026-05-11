"use client";

import { useState, useEffect } from "react";
import { Shield, Plane } from "lucide-react";

export default function DisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/disclaimer-acceptance");
        if (res.ok) {
          const data = await res.json();
          if (!data.accepted) setShow(true);
        }
      } catch {
        setShow(true);
      }
    }
    check();
  }, []);

  const handleAccept = async () => {
    try {
      await fetch("/api/disclaimer-acceptance", { method: "POST" });
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Importante</h2>
        </div>

        <div className="text-sm text-gray-600 space-y-3 mb-6">
          <p>
            Os preços exibidos neste site são <strong>estimativas obtidas em tempo real</strong> de nossos parceiros e podem sofrer alterações sem aviso prévio.
          </p>

          <p>
            O <strong>valor final</strong> da sua passagem será confirmado apenas no momento da compra, diretamente no site do nosso parceiro.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Plane className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800">Aviasales</p>
              <p className="text-blue-700 text-xs mt-0.5">
                Empresa com 17 anos de mercado, mais de 1.000 funcionários e uma das maiores plataformas de busca de voos da Europa.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Ao clicar em &ldquo;Estou ciente&rdquo;, você confirma que compreende que os preços aqui apresentados são estimativas e que o valor final será exibido pelo parceiro no momento da compra.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Estou ciente
        </button>
      </div>
    </div>
  );
}


