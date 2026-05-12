export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { NextRequest, NextResponse } from 'next/server';
import { searchWithSerpAPI, searchWithAmadeus, searchWithAirScraper } from '@/lib/flight-providers';
import { searchTravelpayoutsFlights } from '@/lib/travelpayouts';
import { SearchParams, Flight, ProviderHealth, SearchResponse } from '@/lib/types';
import { getRegionAirports } from '@/lib/regions-config';
const isDomesticBR = (origin: string, destination: string) => {
  const brAirports = getRegionAirports('brasil');
  return brAirports.includes(origin.toUpperCase()) && brAirports.includes(destination.toUpperCase());
};

type ProviderRun = {
  key: string;
  flights: Flight[];
  status: ProviderHealth['status'];
  message?: string;
  responseMs: number;
};

const runProvider = async (
  key: string,
  runner: () => Promise<Flight[]>,
): Promise<ProviderRun> => {
  const startedAt = Date.now();
  try {
    const flights = await runner();
    return {
      key,
      flights,
      status: flights.length > 0 ? 'ok' : 'empty',
      responseMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      key,
      flights: [],
      status: 'error',
      message: String(error),
      responseMs: Date.now() - startedAt,
    };
  }
};

const buildProviderMap = (runs: ProviderRun[]): Record<string, ProviderHealth> => {
  return runs.reduce<Record<string, ProviderHealth>>((acc, run) => {
    acc[run.key] = {
      status: run.status,
      count: run.flights.length,
      responseMs: run.responseMs,
      message: run.message,
    };
    return acc;
  }, {});
};

const dedupeAndFilterFlights = (flights: Flight[]) => {
  const unique = flights.filter((f, i, arr) =>
    arr.findIndex((x) => x.purchaseUrl === f.purchaseUrl && x.price.total === f.price.total) === i,
  ).filter((f) => {
    const airline = (f.airline || '').toUpperCase();
    return airline !== 'AV' && airline !== 'AVIANCA' && !airline.includes('AVIANCA');
  });

  const prices = unique.map((f) => parseFloat(f.price.total) || Infinity);
  const minPrice = Math.min(...prices);
  const realistic = unique.filter((f) => {
    const p = parseFloat(f.price.total) || Infinity;
    return p <= minPrice * 2;
  });

  return { realistic, minPrice };
};

const buildWarnings = (providers: Record<string, ProviderHealth>, flightsCount: number): string[] => {
  const warnings: string[] = [];
  const hasGoogle = providers.googleFlights?.status === 'ok';
  const hasTravel = providers.travelpayouts?.status === 'ok';

  if (providers.amadeus && providers.amadeus.status !== 'ok' && (hasGoogle || hasTravel)) {
    warnings.push('Amadeus indisponivel nesta busca. Exibindo fallback via Google Flights e Travelpayouts.');
  }

  if (flightsCount === 0 && (hasGoogle || hasTravel)) {
    warnings.push('Provedores responderam, mas sem ofertas para os parametros informados.');
  }

  return warnings;
};

// ============ DEEPSEEK FILTER: Top 10 by Price + Convenience ============
const filterTop10WithDeepSeek = async (flights: Flight[]): Promise<Flight[]> => {
  if (flights.length === 0) return flights;
  const targetCount = Math.min(10, flights.length);
  
  try {
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
      console.log(`[DeepSeek] No API key, returning top ${targetCount} by price`);
      return flights
        .sort((a, b) => (parseFloat(a.price.total) || Infinity) - (parseFloat(b.price.total) || Infinity))
        .slice(0, targetCount);
    }

    // Prepare flight data for DeepSeek analysis
    const flightSummary = flights.slice(0, 50).map((f, idx) => ({
      id: idx,
      price: parseFloat(f.price.total) || Infinity,
      stops: f.stops || 0,
      airline: f.airline || 'Unknown',
      duration: f.itineraries?.[0]?.duration || 'Unknown',
    }));

    const prompt = `Analyze these ${flightSummary.length} flights and select the BEST ${targetCount} based on:
1. Price (most important)
2. Number of stops (fewer is better)
3. Airline reputation
4. Overall convenience

Flights data:
${JSON.stringify(flightSummary, null, 2)}

Return ONLY a JSON array with exactly ${targetCount} flight IDs like: [0, 2, 5, 7, ...]
No explanation, just the JSON array.`;
const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      console.log('[DeepSeek] API error, falling back to price sorting');
      return flights
        .sort((a, b) => (parseFloat(a.price.total) || Infinity) - (parseFloat(b.price.total) || Infinity))
        .slice(0, targetCount);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse DeepSeek response
    const jsonMatch = content.match(/\[\s*[\d,\s]+\]/);
    if (!jsonMatch) {
      console.log('[DeepSeek] Could not parse response, falling back to price sorting');
      return flights
        .sort((a, b) => (parseFloat(a.price.total) || Infinity) - (parseFloat(b.price.total) || Infinity))
        .slice(0, targetCount);
    }

    const selectedIds = JSON.parse(jsonMatch[0]) as number[];
    const topFlights = selectedIds
      .filter(id => id < flights.length)
      .map(id => flights[id])
      .slice(0, targetCount);

    console.log(`[DeepSeek] Selected top ${targetCount} flights: ${selectedIds.join(', ')}`);
    return topFlights.length > 0 ? topFlights : flights.slice(0, targetCount);
  } catch (error) {
    console.error('[DeepSeek] Error:', error);
    // Fallback to price sorting
    return flights
      .sort((a, b) => (parseFloat(a.price.total) || Infinity) - (parseFloat(b.price.total) || Infinity))
      .slice(0, targetCount);
  }
};

export async function POST(request: NextRequest) {
  // LOGIN_REQUIRED_COTACAO_POST
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        error: "Faça login para fazer uma cotação.",
        loginRequired: true,
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const params: SearchParams = body;

    console.log('[API] Flight search request:', params);

    if (!params.origin || !params.destination || !params.departureDate) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: origin, destination, departureDate' },
        { status: 400 }
      );
    }

    const domestic = isDomesticBR(params.origin, params.destination);

    console.log(domestic
      ? '[API] Rota nacional Brasil - buscando todos provedores'
      : '[API] Rota internacional - buscando todos provedores');

    const providers = await Promise.all([
      runProvider('googleFlights', () => searchWithSerpAPI(params)),
      runProvider('travelpayouts', () => searchTravelpayoutsFlights(params)),
      runProvider('amadeus', () => searchWithAmadeus(params)),
      runProvider('airScraper', () => searchWithAirScraper(params)),
    ]);

    const allFlights = providers.flatMap((p) => p.flights);
    const providerMap = buildProviderMap(providers);
    const { realistic, minPrice } = dedupeAndFilterFlights(allFlights);
    const warnings = buildWarnings(providerMap, realistic.length);

    console.log(`[API] Combined ${allFlights.length} flights, ${realistic.length} realistic (min: R${minPrice})`);

    // Filter top 10 using DeepSeek for intelligent comparison
    const topFlights = await filterTop10WithDeepSeek(realistic);

    const payload: SearchResponse = {
      flights: topFlights,
      provider: topFlights.length > 0 ? 'Multi Provedores + DeepSeek' : 'none',
      count: topFlights.length,
      providers: providerMap,
      warnings,
      message:
        topFlights.length > 0
          ? undefined
          : 'Nenhum voo encontrado. Tente outras datas ou aeroportos.',
    };

    return NextResponse.json(payload);

  } catch (error) {
    console.error('[API] Error searching flights:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar voos. Tente novamente.', details: String(error) },
      { status: 500 }
    );
  }
}




