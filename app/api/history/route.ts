export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { resolveAuthenticatedUser } from "@/lib/session-user";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = await resolveAuthenticatedUser(session);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = user.id;
    const history = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Erro ao carregar histórico" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = await resolveAuthenticatedUser(session);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = user.id;
    const { origin, destination, departureDate, returnDate, passengers } = await request.json();

    if (!origin || !destination || !departureDate) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const historyEntry = await prisma.searchHistory.create({
      data: {
        userId,
        origin,
        destination,
        departureDate,
        returnDate: returnDate || null,
        passengers: passengers || 1,
      },
    });

    return NextResponse.json({ historyEntry }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar histórico:", error);
    return NextResponse.json({ error: "Erro ao salvar histórico" }, { status: 500 });
  }
}
