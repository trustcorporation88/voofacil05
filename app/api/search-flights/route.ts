import { NextRequest, NextResponse } from 'next/server';
import { searchWithSerpAPI, searchWithAmadeus, searchWithKiwi, searchWithSkyscanner } from '@/lib/flight-providers';
import { SearchParams } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const params: SearchParams = body;

    console.log('[API] Flight search request:', params);

    // Validar parâmetros obrigatórios
    if (!params.origin || !params.destination || !params.departureDate) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: origin, destination, departureDate' },
        { status: 400 }
      );
    }

    // Tentar buscar com diferentes providers em cascata
    let flights = [];

    // 1. Tentar Skyscanner (via RapidAPI) - maior cobertura
    console.log('[API] Trying Skyscanner...');
    flights = await searchWithSkyscanner(params);
    
    if (flights.length > 0) {
      console.log(`[API] Skyscanner returned ${flights.length} flights`);
      return NextResponse.json({ 
        flights, 
        provider: 'Skyscanner',
        count: flights.length 
      });
    }

    // 2. Tentar SerpAPI (Google Flights) - preços confiáveis
    console.log('[API] Skyscanner returned no flights, trying SerpAPI...');
    flights = await searchWithSerpAPI(params);
    
    if (flights.length > 0) {
      console.log(`[API] SerpAPI returned ${flights.length} flights`);
      return NextResponse.json({ 
        flights, 
        provider: 'SerpAPI (Google Flights)',
        count: flights.length 
      });
    }

    // 3. Tentar Amadeus
    console.log('[API] SerpAPI returned no flights, trying Amadeus...');
    flights = await searchWithAmadeus(params);
    
    if (flights.length > 0) {
      console.log(`[API] Amadeus returned ${flights.length} flights`);
      return NextResponse.json({ 
        flights, 
        provider: 'Amadeus',
        count: flights.length 
      });
    }

    // 3. Tentar Kiwi (última opção) - OPCIONAL
    if (process.env.KIWI_API_KEY) {
      console.log('[API] Amadeus returned no flights, trying Kiwi...');
      flights = await searchWithKiwi(params);
      
      if (flights.length > 0) {
        console.log(`[API] Kiwi returned ${flights.length} flights`);
        return NextResponse.json({ 
          flights, 
          provider: 'Kiwi',
          count: flights.length 
        });
      }
    } else {
      console.log('[API] Kiwi API key not configured, skipping...');
    }

    // Nenhum provider retornou resultados
    console.log('[API] No flights found from any provider');
    return NextResponse.json({ 
      flights: [], 
      provider: 'none',
      count: 0,
      message: 'Nenhum voo encontrado para esta rota. Tente outras datas ou aeroportos próximos.'
    });

  } catch (error) {
    console.error('[API] Error searching flights:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar voos. Tente novamente.', details: String(error) },
      { status: 500 }
    );
  }
}
