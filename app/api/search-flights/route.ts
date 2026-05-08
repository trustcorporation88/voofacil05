import { NextRequest, NextResponse } from 'next/server';
import { searchWithSerpAPI, searchWithAmadeus, searchWithSkyscanner } from '@/lib/flight-providers';
import { searchTravelpayoutsFlights } from '@/lib/travelpayouts';
import { SearchParams } from '@/lib/types';
import { getRegionAirports } from '@/lib/regions-config';

const isDomesticBR = (origin: string, destination: string) => {
  const brAirports = getRegionAirports('brasil');
  return brAirports.includes(origin.toUpperCase()) && brAirports.includes(destination.toUpperCase());
};

export async function POST(request: NextRequest) {
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
    let flights: any[] = [];

    if (domestic) {
      console.log('[API] Rota nacional Brasil - buscando todos provedores');

      const [serp, skyscan, amadeus, travel] = await Promise.all([
        searchWithSerpAPI(params).catch(() => []),
        searchWithSkyscanner(params).catch(() => []),
        searchWithAmadeus(params).catch(() => []),
        searchTravelpayoutsFlights(params).catch(() => []),
      ]);

      const allFlights = [...serp, ...skyscan, ...amadeus, ...travel];
      
      if (allFlights.length > 0) {
        const unique = allFlights.filter((f, i, arr) => 
          arr.findIndex(x => x.purchaseUrl === f.purchaseUrl && x.price.total === f.price.total) === i
        ).filter((f: any) => {
          const airline = (f.airline || '').toUpperCase();
          return airline !== 'AV' && airline !== 'AVIANCA' && !airline.includes('AVIANCA');
        });

        const prices = unique.map((f: any) => parseFloat(f.price.total) || Infinity);
        const minPrice = Math.min(...prices);
        const realistic = unique.filter((f: any) => {
          const p = parseFloat(f.price.total) || Infinity;
          return p <= minPrice * 2;
        });

        console.log(`[API] Combined ${allFlights.length} flights, ${realistic.length} realistic (min: R${minPrice})`);
        return NextResponse.json({ flights: realistic, provider: 'Multi Provedores', count: realistic.length });
      }
    } else {
      console.log('[API] Rota internacional - buscando todos provedores');

      const [travel, skyscan, serp, amadeus] = await Promise.all([
        searchTravelpayoutsFlights(params).catch(() => []),
        searchWithSkyscanner(params).catch(() => []),
        searchWithSerpAPI(params).catch(() => []),
        searchWithAmadeus(params).catch(() => []),
      ]);

      const allFlights = [...travel, ...skyscan, ...serp, ...amadeus];
      
      if (allFlights.length > 0) {
        const unique = allFlights.filter((f, i, arr) => 
          arr.findIndex(x => x.purchaseUrl === f.purchaseUrl && x.price.total === f.price.total) === i
        ).filter((f: any) => {
          const airline = (f.airline || '').toUpperCase();
          return airline !== 'AV' && airline !== 'AVIANCA' && !airline.includes('AVIANCA');
        });

        const prices = unique.map((f: any) => parseFloat(f.price.total) || Infinity);
        const minPrice = Math.min(...prices);
        const realistic = unique.filter((f: any) => {
          const p = parseFloat(f.price.total) || Infinity;
          return p <= minPrice * 2;
        });

        console.log(`[API] Combined ${allFlights.length} flights, ${realistic.length} realistic (min: R${minPrice})`);
        return NextResponse.json({ flights: realistic, provider: 'Multi Provedores', count: realistic.length });
      }
    }

    console.log('[API] No flights found from any provider');
    return NextResponse.json({
      flights: [], 
      provider: 'none',
      count: 0,
      message: 'Nenhum voo encontrado. Tente outras datas ou aeroportos.'
    });

  } catch (error) {
    console.error('[API] Error searching flights:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar voos. Tente novamente.', details: String(error) },
      { status: 500 }
    );
  }
}
