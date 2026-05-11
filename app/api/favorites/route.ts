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
    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ savedSearches });
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json({ error: "Erro ao carregar favoritos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { name, origin, destination, departureDate, returnDate, passengers } = await request.json();

    if (!name || !origin || !destination || !departureDate) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId,
        name,
        origin,
        destination,
        departureDate,
        returnDate: returnDate || null,
        passengers: passengers || 1,
      },
    });

    return NextResponse.json({ savedSearch }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar busca:", error);
    return NextResponse.json({ error: "Erro ao salvar busca" }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const savedSearch = await prisma.savedSearch.findFirst({
      where: { id, userId },
    });

    if (!savedSearch) {
      return NextResponse.json({ error: "Busca não encontrada" }, { status: 404 });
    }

    await prisma.savedSearch.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    return NextResponse.json({ error: "Erro ao remover favorito" }, { status: 500 });
  }
}


