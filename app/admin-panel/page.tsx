"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Shield,
  Users,
  Bell,
  Heart,
  Search,
  CheckCircle,
  Loader2,
  LogOut,
  Clock,
  Activity,
} from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState<any>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("pt-BR");
  };

  const fetchAdminData = async () => {
    setLoadingData(true);
    setError("");

    try {
      const res = await fetch("/api/admin", {
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error || "Não autorizado");
        setData(null);
        return;
      }

      setData(json);
    } catch {
      setError("Erro ao carregar dados do painel");
      setData(null);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAdminData();
    }
  }, [status]);

  const handleLogin = async () => {
    setLoadingLogin(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-mail ou senha inválidos");
        return;
      }

      await fetchAdminData();
    } catch {
      setError("Erro ao fazer login");
    } finally {
      setLoadingLogin(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">Admin Voos Cortex</h1>
              <p className="text-xs text-gray-500">Acesso restrito</p>
            </div>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail admin"
            className="w-full px-4 py-3 border rounded-lg mb-3"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-3 border rounded-lg mb-4"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loadingLogin}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loadingLogin ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Entrar"
            )}
          </button>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <Shield className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Acesso negado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => signOut()}
            className="px-5 py-3 rounded-lg bg-gray-900 text-white font-semibold"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            Painel Admin - Voos Cortex
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>

        {loadingData && (
          <div className="bg-white rounded-lg p-4 mb-6 flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            Carregando dados...
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Stat icon={Users} label="Usuários" value={stats.totalUsers || 0} color="text-blue-600" />
          <Stat icon={Bell} label="Alertas" value={stats.alerts || 0} color="text-yellow-600" />
          <Stat icon={Activity} label="Alertas ativos" value={stats.activeAlerts || 0} color="text-emerald-600" />
          <Stat icon={Heart} label="Favoritos" value={stats.favorites || 0} color="text-red-600" />
          <Stat icon={Search} label="Buscas" value={stats.totalSearches || 0} color="text-green-600" />
          <Stat icon={Clock} label="Buscas 24h" value={stats.searches24h || 0} color="text-purple-600" />
          <Stat icon={Clock} label="Buscas 7d" value={stats.searches7d || 0} color="text-indigo-600" />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <h2 className="text-lg font-bold p-4 border-b flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Usuários cadastrados ({data?.users?.length || 0})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">E-mail</th>
                  <th className="text-left p-3">Cadastro</th>
                  <th className="text-left p-3">Última busca</th>
                  <th className="text-left p-3">Buscas</th>
                  <th className="text-left p-3">Favoritos</th>
                  <th className="text-left p-3">Alertas</th>
                  <th className="text-left p-3">Aceite</th>
                </tr>
              </thead>

              <tbody>
                {data?.users?.map((u: any) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{u.name || "-"}</td>
                    <td className="p-3">{u.email || "-"}</td>
                    <td className="p-3">{formatDate(u.createdAt)}</td>
                    <td className="p-3">
                      {u.lastSearch ? (
                        <div>
                          <div>{formatDate(u.lastSearch.timestamp)}</div>
                          <div className="text-xs text-gray-400">
                            {u.lastSearch.origin} → {u.lastSearch.destination}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">{u._count?.searchHistory || 0}</td>
                    <td className="p-3">{u._count?.savedSearches || 0}</td>
                    <td className="p-3">{u._count?.priceAlerts || 0}</td>
                    <td className="p-3">
                      {u.disclaimerAcceptance
                        ? formatDate(u.disclaimerAcceptance.acceptedAt)
                        : "-"}
                    </td>
                  </tr>
                ))}

                {(!data?.users || data.users.length === 0) && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      Nenhum usuário registrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <h2 className="text-lg font-bold p-4 border-b flex items-center gap-2">
            <Search className="w-5 h-5 text-green-600" />
            Buscas recentes ({data?.recentSearches?.length || 0})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Usuário</th>
                  <th className="text-left p-3">Rota</th>
                  <th className="text-left p-3">Ida</th>
                  <th className="text-left p-3">Volta</th>
                  <th className="text-left p-3">Passageiros</th>
                  <th className="text-left p-3">Data/hora</th>
                </tr>
              </thead>

              <tbody>
                {data?.recentSearches?.map((s: any) => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{s.user?.email || "-"}</td>
                    <td className="p-3 font-semibold">{s.origin} → {s.destination}</td>
                    <td className="p-3">{s.departureDate}</td>
                    <td className="p-3">{s.returnDate || "-"}</td>
                    <td className="p-3">{s.passengers}</td>
                    <td className="p-3">{formatDate(s.timestamp)}</td>
                  </tr>
                ))}

                {(!data?.recentSearches || data.recentSearches.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-400">
                      Nenhuma busca registrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <h2 className="text-lg font-bold p-4 border-b flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Termos aceitos ({data?.acceptances?.length || 0})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Usuário</th>
                  <th className="text-left p-3">E-mail</th>
                  <th className="text-left p-3">Data aceite</th>
                  <th className="text-left p-3">IP</th>
                </tr>
              </thead>

              <tbody>
                {data?.acceptances?.map((a: any) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{a.user?.name || "-"}</td>
                    <td className="p-3">{a.user?.email || "-"}</td>
                    <td className="p-3">{formatDate(a.acceptedAt)}</td>
                    <td className="p-3 font-mono text-xs">{a.ip || "-"}</td>
                  </tr>
                ))}

                {(!data?.acceptances || data.acceptances.length === 0) && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-400">
                      Nenhum aceite registrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <Icon className={`w-6 h-6 ${color} mb-2`} />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
