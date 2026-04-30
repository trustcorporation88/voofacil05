// lib/travelpayouts.ts
"use server";

const TRAVELPAYOUTS_MARKER = process.env.TRAVELPAYOUTS_MARKER || "720173";
const TRAVELPAYOUTS_TOKEN = process.env.TRAVELPAYOUTS_TOKEN;

/**
 * Gera link de afiliado Travelpayouts para busca de voos
 * Garante que você receba cashback/comissão de todas as vendas
 */
export function getTravelpayoutsLink(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
}): string {
  const { origin, destination, departureDate, returnDate, passengers = 1 } = params;
  
  // Formato da data: DDMMYY
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
  };

  const depDate = formatDate(departureDate);
  const retDate = returnDate ? formatDate(returnDate) : '';
  
  // Link Aviasales (parceiro Travelpayouts)
  // Formato: https://www.aviasales.com/search/ORIGIN_IATA[DDMMYY]DESTINATION_IATA[DDMMYY]?marker=YOUR_MARKER
  const searchString = `${origin}${depDate}${destination}${retDate}`;
  
  return `https://www.aviasales.com/search/${searchString}?adults=${passengers}&marker=${TRAVELPAYOUTS_MARKER}`;
}

/**
 * Busca preços via Travelpayouts API
 * Retorna ofertas com links de afiliado
 */
export async function searchTravelpayoutsFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  currency?: string;
}) {
  if (!TRAVELPAYOUTS_TOKEN) {
    console.log('[Travelpayouts] No API token found');
    return [];
  }

  const { origin, destination, currency = 'BRL' } = params;

  try {
    // API de preços da Travelpayouts
    const url = new URL('https://api.travelpayouts.com/aviasales/v3/prices_for_dates');
    url.searchParams.append('origin', origin);
    url.searchParams.append('destination', destination);
    url.searchParams.append('currency', currency);
    url.searchParams.append('token', TRAVELPAYOUTS_TOKEN);
    url.searchParams.append('limit', '50');
    url.searchParams.append('sorting', 'price');

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.log(`[Travelpayouts] API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.log('[Travelpayouts] No flights found');
      return [];
    }

    return data.data.map((flight: any, idx: number) => {
      const price = flight.value || 0;
      
      return {
        id: `travelpayouts-${idx}-${price}`,
        price: {
          total: price.toString(),
          currency: currency,
          grandTotal: (price * (params.passengers || 1)).toString(),
        },
        itineraries: [{
          duration: `PT${flight.duration || 120}M`,
          segments: [{
            departure: {
              iataCode: origin,
              at: flight.departure_at || new Date().toISOString(),
            },
            arrival: {
              iataCode: destination,
              at: flight.return_at || new Date().toISOString(),
            },
            carrierCode: flight.airline || 'UNKNOWN',
            number: flight.flight_number?.toString() || '0000',
          }],
        }],
        oneWay: !params.returnDate,
        airline: flight.airline || 'UNKNOWN',
        airlineLogo: '',
        flightNumber: flight.flight_number?.toString() || '',
        amenities: [],
        stops: flight.transfers || 0,
        // Link de afiliado com SEU marker!
        purchaseUrl: getTravelpayoutsLink(params),
      };
    });
  } catch (error) {
    console.error('[Travelpayouts] Error:', error);
    return [];
  }
}
