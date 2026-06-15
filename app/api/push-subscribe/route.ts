export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { subscription } = await request.json();

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Subscription inválida" }, { status: 400 });
    }

    await prisma.pushSubscription.upsert({
      where: { userId },
      update: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys?.p256dh || "",
        auth: subscription.keys?.auth || "",
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys?.p256dh || "",
        auth: subscription.keys?.auth || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar subscription:", error);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await prisma.pushSubscription.deleteMany({ where: { userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover subscription:", error);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

