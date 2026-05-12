"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Shield, AlertTriangle } from "lucide-react";
import {
  DISCLAIMER_ACCEPTANCE_LABEL,
  DISCLAIMER_TEXT,
  DISCLAIMER_TITLE,
} from "@/lib/disclaimer";

export default function DisclaimerModal() {
  const { status } = useSession();

  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function check() {
      if (status !== "authenticated") {
        setShow(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/disclaimer-acceptance", {
          cache: "no-store",
        });

        if (!res.ok) {
          setShow(true);
          return;
        }

        const data = await res.json();
        setShow(!data.accepted);
      } catch {
        setShow(true);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, [status]);

  const handleAccept = async () => {
    if (!checked) {
      setError("É necessário marcar o aceite para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch("/api/disclaimer-acceptance", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Falha ao registrar aceite");
      }

      setShow(false);
    } catch (err: any) {
      setError(err?.message || "Não foi possível registrar o aceite. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status !== "authenticated") return null;
  if (loading) return null;
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
              <Shield className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{DISCLAIMER_TITLE}</h2>
            </div>
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-6">
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
            <p className="text-sm text-amber-900">
              Este aviso precisa ser aceito para liberar o uso da plataforma após o login.
            </p>
          </div>

          <div className="whitespace-pre-line text-sm leading-7 text-slate-700">
            {DISCLAIMER_TEXT}
          </div>

          <label className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                if (e.target.checked) setError("");
              }}
              className="mt-1 h-4 w-4"
            />
            <span className="text-sm text-slate-800">
              {DISCLAIMER_ACCEPTANCE_LABEL}
            </span>
          </label>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
          )}
        </div>

        <div className="border-t border-slate-200 p-6">
          <button
            onClick={handleAccept}
            disabled={!checked || submitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Registrando aceite..." : "Li e estou ciente"}
          </button>
        </div>
      </div>
    </div>
  );
}
