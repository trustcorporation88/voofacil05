import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";
import {
  DISCLAIMER_TEXT,
  DISCLAIMER_VERSION,
} from "@/lib/disclaimer";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Sessão sem userId" }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const acceptance = await prisma.disclaimerAcceptance.upsert({
      where: {
        userId_version: {
          userId,
          version: DISCLAIMER_VERSION,
        },
      },
      update: {
        acceptedAt: new Date(),
        ip,
        userAgent,
        disclaimerText: DISCLAIMER_TEXT,
      },
      create: {
        userId,
        version: DISCLAIMER_VERSION,
        disclaimerText: DISCLAIMER_TEXT,
        ip,
        userAgent,
      },
    });

    return NextResponse.json({
      accepted: true,
      version: DISCLAIMER_VERSION,
      acceptedAt: acceptance.acceptedAt,
    });
  } catch (error: any) {
    console.error("Erro ao salvar aceite:", error);
    return NextResponse.json(
      {
        error: error?.message || "Erro ao salvar aceite",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ accepted: false, authenticated: false });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ accepted: false, authenticated: true, error: "Sessão sem userId" });
    }

    const acceptance = await prisma.disclaimerAcceptance.findUnique({
      where: {
        userId_version: {
          userId,
          version: DISCLAIMER_VERSION,
        },
      },
    });

    return NextResponse.json({
      authenticated: true,
      accepted: !!acceptance,
      version: DISCLAIMER_VERSION,
      acceptance,
    });
  } catch (error: any) {
    console.error("Erro ao consultar aceite:", error);
    return NextResponse.json({
      accepted: false,
      authenticated: false,
      error: error?.message || "Erro ao consultar aceite",
    });
  }
}
