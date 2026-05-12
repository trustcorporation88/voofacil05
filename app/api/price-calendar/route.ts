export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";
import { getPriceMonthMatrix } from "@/lib/travelpayouts";
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
    const { origin, destination, month } = body;

    if (!origin || !destination || !month) {
      return NextResponse.json(
        { error: "origin, destination e month são obrigatórios" },
        { status: 400 }
      );
    }

    const data = await getPriceMonthMatrix({
      origin,
      destination,
      month,
      currency: "BRL",
    });

    if (!data) {
      return NextResponse.json({
        prices: [],
        message: "Nenhum dado de preço disponível para este mês",
      });
    }

    const prices = Array.isArray(data)
      ? data.map((item: any) => ({
          date: item.depart_date || item.date,
          price: item.value,
          currency: "BRL",
          airline: item.airline,
          transfers: item.number_of_changes,
          tripDuration: item.duration,
        }))
      : [];

    return NextResponse.json({ prices });
  } catch (error) {
    console.error("[PriceCalendar] Error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar preços do mês", details: String(error) },
      { status: 500 }
    );
  }
}




