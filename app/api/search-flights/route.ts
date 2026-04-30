import { NextRequest, NextResponse } from 'next/server';
import { searchWithSerpAPI, searchWithAmadeus, searchWithSkyscanner } from '@/lib/flight-providers';
import { searchTravelpayoutsFlights } from '@/lib/travelpayouts';
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

    // 1. Tentar Travelpayouts PRIMEIRO (você recebe cashback direto!)
    console.log('[API] Trying Travelpayouts...');
    flights = await searchTravelpayoutsFlights(params);
    
    if (flights.length > 0) {
      console.log(`[API] Travelpayouts returned ${flights.length} flights`);
      return NextResponse.json({ 
        flights, 
        provider: 'Travelpayouts (Aviasales)',
        count: flights.length,
        affiliate: true // Indica que são links de afiliado
      });
    }

    // 2. Tentar Skyscanner (via RapidAPI) - TODOS os links redirecionam para Travelpayouts
    console.log('[API] Travelpayouts returned no flights, trying Skyscanner...');
    flights = await searchWithSkyscanner(params);
    
    if (flights.length > 0) {
      console.log(`[API] Skyscanner returned ${flights.length} flights (links com afiliado)`);
      return NextResponse.json({ 
        flights, 
        provider: 'Skyscanner',
        count: flights.length,
        affiliate: true
      });
    }

    // 3. Tentar SerpAPI (Google Flights) - links com afiliado
    console.log('[API] Skyscanner returned no flights, trying SerpAPI...');
    flights = await searchWithSerpAPI(params);
    
    if (flights.length > 0) {
      console.log(`[API] SerpAPI returned ${flights.length} flights (links com afiliado)`);
      return NextResponse.json({ 
        flights, 
        provider: 'SerpAPI (Google Flights)',
        count: flights.length,
        affiliate: true
      });
    }

    // 4. Tentar Amadeus - links com afiliado
    console.log('[API] SerpAPI returned no flights, trying Amadeus...');
    flights = await searchWithAmadeus(params);
    
    if (flights.length > 0) {
      console.log(`[API] Amadeus returned ${flights.length} flights (links com afiliado)`);
      return NextResponse.json({ 
        flights, 
        provider: 'Amadeus',
        count: flights.length,
        affiliate: true
      });
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
