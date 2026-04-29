// lib/flight-providers.ts
"use server";

import { SearchParams, Flight } from "@/lib/types";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com";
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const KIWI_API_KEY = process.env.KIWI_API_KEY;

// Debug: Log environment variables (apenas primeiros/últimos caracteres por segurança)
console.log("[ENV] Variables loaded:", {
  SERPAPI_KEY: SERPAPI_KEY ? `${SERPAPI_KEY.slice(0, 10)}...${SERPAPI_KEY.slice(-10)}` : "NOT SET",
  AMADEUS_API_KEY: AMADEUS_API_KEY ? `${AMADEUS_API_KEY.slice(0, 10)}...` : "NOT SET",
  AMADEUS_API_SECRET: AMADEUS_API_SECRET ? `${AMADEUS_API_SECRET.slice(0, 10)}...` : "NOT SET",
  KIWI_API_KEY: KIWI_API_KEY ? `${KIWI_API_KEY.slice(0, 10)}...${KIWI_API_KEY.slice(-10)}` : "NOT SET",
});

// Token Amadeus
let amadeusToken: string | null = null;
let tokenExpiresAt = 0;

async function getAmadeusToken(): Promise<string> {
  if (amadeusToken && Date.now() < tokenExpiresAt) return amadeusToken;

  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_API_KEY!,
        client_secret: AMADEUS_API_SECRET!,
      }),
    },
  );

  if (!response.ok) throw new Error("Falha na autenticação Amadeus");

  const data = await response.json();
  amadeusToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return amadeusToken!;
}

// ============ SERP API (Google Flights) ============
export async function searchWithSerpAPI(
  params: SearchParams,
): Promise<Flight[]> {
  console.log("[SerpAPI] Starting search...");
  
  if (!SERPAPI_KEY) {
    console.log("[SerpAPI] No API key found");
    return [];
  }

  try {
    const serpApiUrl = new URL("https://serpapi.com/search");
    serpApiUrl.searchParams.append("engine", "google_flights");
    serpApiUrl.searchParams.append("departure_id", params.origin);
    serpApiUrl.searchParams.append("arrival_id", params.destination);
    serpApiUrl.searchParams.append("outbound_date", params.departureDate);
    if (params.returnDate) {
      serpApiUrl.searchParams.append("return_date", params.returnDate);
    }
    serpApiUrl.searchParams.append("adults", params.passengers.toString());
    serpApiUrl.searchParams.append("currency", "BRL");
    serpApiUrl.searchParams.append("api_key", SERPAPI_KEY);

    const res = await fetch(serpApiUrl.toString(), {
      signal: AbortSignal.timeout(10000),
    });

    console.log(`[SerpAPI] Response status: ${res.status}`);
    const data = await res.json();
    
    console.log(`[SerpAPI] Response data:`, {
      best_flights: data.best_flights?.length || 0,
      other_flights: data.other_flights?.length || 0,
      error: data.error,
      search_metadata: data.search_metadata
    });

    if (res.ok) {
      const allFlights = [
        ...(data.best_flights || []),
        ...(data.other_flights || []),
      ];

      console.log(`[SerpAPI] Found ${allFlights.length} flights`);
      console.log(`[SerpAPI] Flight prices:`, allFlights.slice(0, 10).map((f: any, i: number) => 
        `#${i}: R$ ${f.price} (${f.flights?.[0]?.airline || 'N/A'})`
      ));

      return allFlights.map((flight: any, idx: number) => {
        const price = flight.price || 0;
        const firstSegment = flight.flights?.[0] || {};

        return {
          id: `serp-${idx}-${price}`,
          price: {
            total: price.toString(),
            currency: "BRL",
            grandTotal: (price * params.passengers).toString(),
          },
          itineraries: [
            {
              duration: `PT${flight.total_duration || 120}M`,
              segments: (flight.flights || [firstSegment]).map((seg: any) => ({
                departure: {
                  iataCode: seg.departure_airport?.id || params.origin,
                  at: new Date(
                    (seg.departure_airport?.time || params.departureDate).replace(
                      " ",
                      "T",
                    ),
                  ).toISOString(),
                },
                arrival: {
                  iataCode: seg.arrival_airport?.id || params.destination,
                  at: new Date(
                    (seg.arrival_airport?.time || params.departureDate).replace(
                      " ",
                      "T",
                    ),
                  ).toISOString(),
                },
                carrierCode: seg.airline || "UNKNOWN",
                number: seg.flight_number || "0000",
              })),
            },
          ],
          oneWay: !params.returnDate,
          airline: firstSegment.airline || "UNKNOWN",
          airlineLogo: firstSegment.airline_logo || "",
          flightNumber: firstSegment.flight_number || "0000",
          amenities: [],
          stops: (flight.flights?.length || 1) - 1,
          purchaseUrl:
            flight.booking_link ||
            `https://www.google.com/flights?hl=pt-BR#search;f=${params.origin};t=${params.destination};d=${params.departureDate}${params.returnDate ? `;r=${params.returnDate}` : ""}`,
        };
      });
    }
  } catch (error) {
    console.error("[SerpAPI] Error:", error);
  }

  return [];
}

// ============ AMADEUS API ============
export async function searchWithAmadeus(
  params: SearchParams,
): Promise<Flight[]> {
  console.log("[Amadeus] Starting search...");
  
  if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
    console.log("[Amadeus] No API credentials found");
    return [];
  }

  try {
    const token = await getAmadeusToken();

    const query = new URLSearchParams({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.passengers.toString(),
      currencyCode: "BRL",
      max: "50",
    });

    if (params.returnDate) {
      query.append("returnDate", params.returnDate);
    }

    const res = await fetch(
      `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10000),
      },
    );

    console.log(`[Amadeus] Response status: ${res.status}`);
    
    if (!res.ok) {
      const errorData = await res.json();
      console.log(`[Amadeus] Error response:`, errorData);
      return [];
    }
    
    if (res.ok) {
      const data = await res.json();
      console.log(`[Amadeus] Response data:`, {
        data_length: data.data?.length || 0,
        errors: data.errors,
        warnings: data.warnings
      });
      console.log(`[Amadeus] Found ${data.data?.length || 0} flights`);

      return (data.data || []).map((offer: any, idx: number) => ({
        id: `amadeus-${idx}-${offer.price?.total || 0}`,
        price: {
          total: offer.price?.total || "0",
          currency: "BRL",
          grandTotal: offer.price?.grandTotal || offer.price?.total || "0",
        },
        itineraries: offer.itineraries || [],
        oneWay: !params.returnDate,
        airline: offer.validatingAirlineCodes?.[0] || "UNKNOWN",
        airlineLogo: "",
        flightNumber: "",
        amenities: [],
        stops: 0,
        purchaseUrl: `https://www.google.com/flights?hl=pt-BR#search;f=${params.origin};t=${params.destination};d=${params.departureDate}`,
      }));
    }
  } catch (error) {
    console.error("[Amadeus] Error:", error);
  }

  return [];
}

// ============ KIWI.COM API ============
export async function searchWithKiwi(params: SearchParams): Promise<Flight[]> {
  console.log("[Kiwi] Starting search...");
  
  if (!KIWI_API_KEY) {
    console.log("[Kiwi] No API key found");
    return [];
  }

  try {
    // Kiwi usa formato diferente - vamos simplificar por agora
    const url = new URL("https://api.tequila.kiwi.com/v2/search");
    url.searchParams.append("fly_from", params.origin);
    url.searchParams.append("fly_to", params.destination);
    url.searchParams.append("date_from", params.departureDate);
    url.searchParams.append("date_to", params.departureDate);
    url.searchParams.append("adults", params.passengers.toString());
    url.searchParams.append("curr", "BRL");
    url.searchParams.append("limit", "50");

    if (params.returnDate) {
      url.searchParams.append("return_from", params.returnDate);
      url.searchParams.append("return_to", params.returnDate);
    }

    const res = await fetch(url.toString(), {
      headers: {
        apikey: KIWI_API_KEY,
      },
      signal: AbortSignal.timeout(10000),
    });

    console.log(`[Kiwi] Response status: ${res.status}`);
    
    if (!res.ok) {
      const errorData = await res.json();
      console.log(`[Kiwi] Error response:`, errorData);
      return [];
    }
    
    if (res.ok) {
      const data = await res.json();
      console.log(`[Kiwi] Response data:`, {
        data_length: data.data?.length || 0,
        error: data.error,
        message: data.message
      });
      console.log(`[Kiwi] Found ${data.data?.length || 0} flights`);

      return (data.data || []).map((flight: any, idx: number) => ({
        id: `kiwi-${idx}-${flight.price || 0}`,
        price: {
          total: flight.price?.toString() || "0",
          currency: "BRL",
          grandTotal: (flight.price * params.passengers).toString(),
        },
        itineraries: [
          {
            duration: `PT${flight.duration?.total || 120}M`,
            segments: (flight.route || []).map((route: any) => ({
              departure: {
                iataCode: route.flyFrom || params.origin,
                at: new Date(route.local_departure).toISOString(),
              },
              arrival: {
                iataCode: route.flyTo || params.destination,
                at: new Date(route.local_arrival).toISOString(),
              },
              carrierCode: route.airline || "UNKNOWN",
              number: route.flight_no?.toString() || "0000",
            })),
          },
        ],
        oneWay: !params.returnDate,
        airline: flight.airlines?.[0] || "UNKNOWN",
        airlineLogo: "",
        flightNumber: "",
        amenities: [],
        stops: flight.route?.length - 1 || 0,
        purchaseUrl: flight.deep_link || "",
      }));
    }
  } catch (error) {
    console.error("[Kiwi] Error:", error);
  }

  return [];
}
