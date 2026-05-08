"use client";

import { useState } from "react";
import { Shield, Users, Bell, Heart, Search, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?key=${encodeURIComponent(key)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setAuthenticated(true);
      } else {
        alert("Chave inválida");
      }
    } catch {
      alert("Erro ao acessar");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">Admin</h1>
          </div>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Chave de acesso"
            className="w-full px-4 py-3 border rounded-lg mb-4"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Acessar"}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (d: string) => new Date(d).toLocaleString("pt-BR");

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-7 h-7 text-blue-600" />
          Painel Admin - Cortex Airlines
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{data?.stats?.totalUsers || 0}</p>
            <p className="text-sm text-gray-500">Usuários</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <Bell className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="text-2xl font-bold">{data?.stats?.alerts || 0}</p>
            <p className="text-sm text-gray-500">Alertas</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <Heart className="w-6 h-6 text-red-600 mb-2" />
            <p className="text-2xl font-bold">{data?.stats?.favorites || 0}</p>
            <p className="text-sm text-gray-500">Favoritos</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <Search className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-2xl font-bold">{data?.stats?.totalSearches || 0}</p>
            <p className="text-sm text-gray-500">Buscas</p>
          </div>
        </div>

        {/* Acceptances Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <h2 className="text-lg font-bold p-4 border-b flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Termos Aceitos ({data?.acceptances?.length || 0})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Usuário</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Data Aceite</th>
                  <th className="text-left p-3">IP</th>
                </tr>
              </thead>
              <tbody>
                {data?.acceptances?.map((a: any) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{a.user?.name || "-"}</td>
                    <td className="p-3">{a.user?.email || "-"}</td>
                    <td className="p-3">{formatDate(a.acceptedAt)}</td>
                    <td className="p-3 font-mono text-xs">{a.ip}</td>
                  </tr>
                ))}
                {(!data?.acceptances || data.acceptances.length === 0) && (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-400">Nenhum aceite registrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
