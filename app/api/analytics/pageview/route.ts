import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sessionKey = String(body?.sessionKey || "");
    const path = String(body?.path || "").slice(0, 500);
    const title = body?.title ? String(body.title).slice(0, 500) : null;
    const referrer = body?.referrer ? String(body.referrer).slice(0, 1000) : null;

    if (!sessionKey || !path) {
      return NextResponse.json({ error: "Dados obrigatórios ausentes" }, { status: 400 });
    }

    const authSession = await getServerSession(authOptions);
    const userId = (authSession?.user as any)?.id || null;
    const now = new Date();

    let session = await prisma.visitSession.findUnique({
      where: { sessionKey },
      select: { id: true },
    });

    if (!session) {
      const created = await prisma.visitSession.create({
        data: {
          sessionKey,
          userId: userId || undefined,
          startedAt: now,
          lastSeenAt: now,
          entryPath: path,
          exitPath: path,
          landingPage: path,
          referrer: referrer || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
          deviceType: "desktop",
        },
        select: { id: true },
      });

      session = created;
    }

    await prisma.pageView.create({
      data: {
        sessionId: session.id,
        userId: userId || undefined,
        path,
        title: title || undefined,
        referrer: referrer || undefined,
        visitedAt: now,
      },
    });

    await prisma.visitSession.update({
      where: { sessionKey },
      data: {
        userId: userId || undefined,
        lastSeenAt: now,
        exitPath: path,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro analytics pageview:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
