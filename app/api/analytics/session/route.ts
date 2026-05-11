import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { createHash } from "node:crypto";
import { authOptions } from "@/lib/auth.config";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

function detectDeviceType(userAgent: string | null) {
  const ua = (userAgent || "").toLowerCase();

  if (/ipad|tablet|sm-t|tab/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

async function parseBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const raw = await request.text();
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

function hashIp(ip: string) {
  const salt = process.env.ANALYTICS_IP_SALT || "voos-cortex";
  return createHash("sha256").update(`${ip}|${salt}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const action = String(body?.action || "heartbeat");
    const sessionKey = String(body?.sessionKey || "");
    const path = body?.path ? String(body.path).slice(0, 500) : null;
    const referrer = body?.referrer ? String(body.referrer).slice(0, 1000) : null;

    if (!sessionKey) {
      return NextResponse.json({ error: "sessionKey obrigatório" }, { status: 400 });
    }

    const authSession = await getServerSession(authOptions);
    const userId = (authSession?.user as any)?.id || null;

    const userAgent = request.headers.get("user-agent");
    const xForwardedFor = request.headers.get("x-forwarded-for") || "";
    const ip =
      xForwardedFor.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    const ipHash = ip ? hashIp(ip) : null;
    const deviceType = detectDeviceType(userAgent);
    const now = new Date();

    const existing = await prisma.visitSession.findUnique({
      where: { sessionKey },
      select: { id: true, startedAt: true },
    });

    if (action === "end") {
      if (!existing) {
        return NextResponse.json({ ok: true });
      }

      const durationSeconds = Math.max(
        0,
        Math.floor((now.getTime() - new Date(existing.startedAt).getTime()) / 1000)
      );

      await prisma.visitSession.update({
        where: { sessionKey },
        data: {
          userId: userId || undefined,
          lastSeenAt: now,
          endedAt: now,
          exitPath: path || undefined,
          durationSeconds,
        },
      });

      return NextResponse.json({ ok: true });
    }

    if (!existing) {
      await prisma.visitSession.create({
        data: {
          sessionKey,
          userId: userId || undefined,
          startedAt: now,
          lastSeenAt: now,
          entryPath: path || undefined,
          exitPath: path || undefined,
          landingPage: path || undefined,
          referrer: referrer || undefined,
          ipHash: ipHash || undefined,
          userAgent: userAgent || undefined,
          deviceType,
        },
      });

      return NextResponse.json({ ok: true });
    }

    const durationSeconds = Math.max(
      0,
      Math.floor((now.getTime() - new Date(existing.startedAt).getTime()) / 1000)
    );

    await prisma.visitSession.update({
      where: { sessionKey },
      data: {
        userId: userId || undefined,
        lastSeenAt: now,
        exitPath: path || undefined,
        durationSeconds,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro analytics session:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
