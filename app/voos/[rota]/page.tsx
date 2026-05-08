import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRouteBySlug, POPULAR_ROUTES, getRouteSlug } from "@/lib/popular-routes";

interface Props {
  params: { rota: string };
}

export async function generateStaticParams() {
  return POPULAR_ROUTES.map((route) => ({
    rota: getRouteSlug(route),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = getRouteBySlug(params.rota);
  if (!route) return { title: "Rota não encontrada" };

  const title = `Passagem ${route.originCity} para ${route.destinationCity} (${route.origin}-${route.destination}) | VooFácil`;
  const description = `Compare preços de voos de ${route.originCity} (${route.origin}) para ${route.destinationCity} (${route.destination}). Encontre as passagens mais baratas com LATAM, Azul, Gol e mais. Alerta de preço grátis!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.vooscortex.com.br/voos/${params.rota}`,
      siteName: "VooFácil",
      locale: "pt_BR",
      type: "website",
    },
    alternates: {
      canonical: `https://www.vooscortex.com.br/voos/${params.rota}`,
    },
  };
}

export default function RotaPage({ params }: Props) {
  const route = getRouteBySlug(params.rota);
  if (!route) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Passagem aérea ${route.originCity} → ${route.destinationCity}`,
    description: `Voos baratos de ${route.originCity} para ${route.destinationCity}. Compare preços e receba alertas.`,
    url: `https://www.vooscortex.com.br/voos/${params.rota}`,
    brand: { "@type": "Brand", name: "VooFácil" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "VooFácil" },
    },
  };

  const today = new Date().toISOString().split("T")[0];
  const searchUrl = `/?origem=${route.origin}&destino=${route.destination}&data=${today}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-700 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="text-blue-200 hover:text-white text-sm mb-4 inline-block">
              ← Voltar para busca
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              ✈️ {route.originCity} → {route.destinationCity}
            </h1>
            <p className="text-blue-100 text-lg">
              {route.origin} ({route.originAirport}) → {route.destination} ({route.destinationAirport})
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* CTA */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 text-center">
            <p className="text-gray-600 mb-4 text-lg">
              Compare passagens de <strong>{route.originCity}</strong> para <strong>{route.destinationCity}</strong> em tempo real
            </p>
            <Link
              href={searchUrl}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
            >
              Buscar Passagens Agora
            </Link>
            <p className="text-sm text-gray-400 mt-3">Alerta de preço grátis — receba e-mail quando o preço cair</p>
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Voos {route.originCity} → {route.destinationCity}
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Compare LATAM, Azul, Gol e mais companhias</li>
                <li>✅ Preços atualizados em tempo real</li>
                <li>✅ Passagens com 1 ou mais conexões</li>
                <li>✅ Alerta grátis quando o preço cair</li>
                <li>✅ Calendário com os dias mais baratos</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Dicas para esta rota</h2>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>📅 <strong>Melhor época:</strong> Reserve com 3-6 semanas de antecedência</li>
                <li>🗓️ <strong>Dias mais baratos:</strong> Terça, quarta e sábado</li>
                <li>⏰ <strong>Voos madrugada:</strong> Geralmente 20-30% mais baratos</li>
                <li>🔔 <strong>Alerta de preço:</strong> Economize aguardando a promoção</li>
                <li>💳 <strong>Pagamento:</strong> PIX e cartão aceitos</li>
              </ul>
            </div>
          </div>

          {/* Other Routes */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Outras rotas populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {POPULAR_ROUTES.filter(r => r.origin !== route.origin || r.destination !== route.destination)
                .slice(0, 9)
                .map((r) => (
                  <Link
                    key={getRouteSlug(r)}
                    href={`/voos/${getRouteSlug(r)}`}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg text-sm transition"
                  >
                    {r.originCity} → {r.destinationCity}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
