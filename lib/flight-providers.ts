// lib/flight-providers.ts
"use server";

import { SearchParams, Flight } from "@/lib/types";
import { getTravelpayoutsLink } from "@/lib/travelpayouts";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com";
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Debug: Log environment variables (apenas primeiros/últimos caracteres por segurança)
console.log("[ENV] Variables loaded:", {
  SERPAPI_KEY: SERPAPI_KEY ? `${SERPAPI_KEY.slice(0, 10)}...${SERPAPI_KEY.slice(-10)}` : "NOT SET",
  AMADEUS_API_KEY: AMADEUS_API_KEY ? `${AMADEUS_API_KEY.slice(0, 10)}...` : "NOT SET",
  AMADEUS_API_SECRET: AMADEUS_API_SECRET ? `${AMADEUS_API_SECRET.slice(0, 10)}...` : "NOT SET",
  RAPIDAPI_KEY: RAPIDAPI_KEY ? `${RAPIDAPI_KEY.slice(0, 10)}...${RAPIDAPI_KEY.slice(-10)}` : "NOT SET",
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

      // Gerar link de afiliado uma vez para todos
      const affiliateUrl = await getTravelpayoutsLink(params);

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
          purchaseUrl: affiliateUrl, // Link de afiliado com cashback!
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

      // Gerar link de afiliado uma vez
      const affiliateUrl = await getTravelpayoutsLink(params);

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
        purchaseUrl: affiliateUrl, // Link de afiliado com cashback!
      }));
    }
  } catch (error) {
    console.error("[Amadeus] Error:", error);
  }

  return [];
}

// ============ SKYSCANNER (via RapidAPI) ============
export async function searchWithSkyscanner(params: SearchParams): Promise<Flight[]> {
  console.log("[Skyscanner] Starting search...");
  
  if (!RAPIDAPI_KEY) {
    console.log("[Skyscanner] No RapidAPI key found");
    return [];
  }

  try {
    // Skyscanner via Sky Scrapper API
    const url = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights`;
    
    const queryParams = new URLSearchParams({
      originSkyId: params.origin,
      destinationSkyId: params.destination,
      originEntityId: params.origin,
      destinationEntityId: params.destination,
      date: params.departureDate,
      adults: params.passengers.toString(),
      currency: "BRL",
      market: "BR",
      locale: "pt-BR"
    });

    if (params.returnDate) {
      queryParams.append("returnDate", params.returnDate);
    }

    const res = await fetch(`${url}?${queryParams}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com"
      },
      signal: AbortSignal.timeout(15000),
    });

    console.log(`[Skyscanner] Response status: ${res.status}`);
    
    if (!res.ok) {
      const errorData = await res.text();
      console.log(`[Skyscanner] Error response:`, errorData);
      return [];
    }
    
    const data = await res.json();
    console.log(`[Skyscanner] Response data:`, {
      status: data.status,
      itineraries_length: data.data?.itineraries?.length || 0,
    });

    const itineraries = data.data?.itineraries || [];
    console.log(`[Skyscanner] Found ${itineraries.length} flights`);

    // Gerar link de afiliado uma vez
    const affiliateUrl = await getTravelpayoutsLink(params);

    return itineraries.slice(0, 50).map((itin: any, idx: number) => {
      const price = itin.price?.raw || 0;
      const legs = itin.legs || [];
      const firstLeg = legs[0] || {};

      return {
        id: `skyscanner-${idx}-${price}`,
        price: {
          total: price.toString(),
          currency: "BRL",
          grandTotal: price.toString(),
        },
        itineraries: legs.map((leg: any) => ({
          duration: `PT${leg.durationInMinutes || 120}M`,
          segments: (leg.segments || []).map((seg: any) => ({
            departure: {
              iataCode: seg.origin?.displayCode || params.origin,
              at: seg.departure || new Date().toISOString(),
            },
            arrival: {
              iataCode: seg.destination?.displayCode || params.destination,
              at: seg.arrival || new Date().toISOString(),
            },
            carrierCode: seg.marketingCarrier?.alternateId || "UNKNOWN",
            number: seg.flightNumber || "0000",
          })),
        })),
        oneWay: !params.returnDate,
        airline: firstLeg.carriers?.marketing?.[0]?.name || "UNKNOWN",
        airlineLogo: firstLeg.carriers?.marketing?.[0]?.imageUrl || "",
        flightNumber: firstLeg.segments?.[0]?.flightNumber || "",
        amenities: [],
        stops: firstLeg.stopCount || 0,
        purchaseUrl: affiliateUrl, // Link de afiliado com cashback!
      };
    });
  } catch (error) {
    console.error("[Skyscanner] Error:", error);
  }

  return [];
}
