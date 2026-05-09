import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const acceptances = await prisma.disclaimerAcceptance.findMany({
      include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
      orderBy: { acceptedAt: "desc" },
    });

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const alerts = await prisma.priceAlert.count();
    const favorites = await prisma.savedSearch.count();
    const totalSearches = await prisma.searchHistory.count();

    return NextResponse.json({
      acceptances,
      users,
      stats: { totalUsers: users.length, alerts, favorites, totalSearches },
    });
  } catch {
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}
