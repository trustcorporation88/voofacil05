import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const alerts = await prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Erro ao buscar alertas:", error);
    return NextResponse.json({ error: "Erro ao carregar alertas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { origin, originName, destination, destinationName, departureDate, returnDate, passengers, targetPrice, currency, tripType } = await request.json();

    if (!origin || !destination || !departureDate || !targetPrice) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId,
        origin,
        originName: originName || null,
        destination,
        destinationName: destinationName || null,
        departureDate,
        returnDate: returnDate || null,
        passengers: passengers || 1,
        targetPrice,
        currency: currency || "BRL",
        tripType: tripType || "oneWay",
      },
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar alerta:", error);
    return NextResponse.json({ error: "Erro ao criar alerta" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id, isActive } = await request.json();

    const alert = await prisma.priceAlert.findFirst({
      where: { id, userId },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alerta não encontrado" }, { status: 404 });
    }

    const updated = await prisma.priceAlert.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ alert: updated });
  } catch (error) {
    console.error("Erro ao atualizar alerta:", error);
    return NextResponse.json({ error: "Erro ao atualizar alerta" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

    const alert = await prisma.priceAlert.findFirst({
      where: { id, userId },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alerta não encontrado" }, { status: 404 });
    }

    await prisma.priceAlert.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover alerta:", error);
    return NextResponse.json({ error: "Erro ao remover alerta" }, { status: 500 });
  }
}


