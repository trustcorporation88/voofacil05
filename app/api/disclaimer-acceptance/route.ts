import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    await prisma.disclaimerAcceptance.upsert({
      where: { userId },
      update: { acceptedAt: new Date(), ip },
      create: { userId, ip },
    });

    return NextResponse.json({ accepted: true });
  } catch (error) {
    console.error("Erro ao salvar aceite:", error);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const acceptance = await prisma.disclaimerAcceptance.findUnique({
      where: { userId },
    });

    return NextResponse.json({ accepted: !!acceptance, acceptance });
  } catch {
    return NextResponse.json({ accepted: false });
  }
}
