import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.toLowerCase();
    const adminEmails = getAdminEmails();

    if (!sessionEmail || !adminEmails.includes(sessionEmail)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      users,
      acceptances,
      alerts,
      activeAlerts,
      favorites,
      totalSearches,
      searches24h,
      searches7d,
      recentSearches,
      notifications,
    ] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          disclaimerAcceptance: {
            select: {
              acceptedAt: true,
              ip: true,
            },
          },
          searchHistory: {
            orderBy: { timestamp: "desc" },
            take: 1,
            select: {
              origin: true,
              destination: true,
              departureDate: true,
              timestamp: true,
            },
          },
          _count: {
            select: {
              savedSearches: true,
              searchHistory: true,
              priceAlerts: true,
              notifications: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      prisma.disclaimerAcceptance.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
        orderBy: { acceptedAt: "desc" },
        take: 100,
      }),

      prisma.priceAlert.count(),

      prisma.priceAlert.count({
        where: { isActive: true },
      }),

      prisma.savedSearch.count(),

      prisma.searchHistory.count(),

      prisma.searchHistory.count({
        where: { timestamp: { gte: since24h } },
      }),

      prisma.searchHistory.count({
        where: { timestamp: { gte: since7d } },
      }),

      prisma.searchHistory.findMany({
        orderBy: { timestamp: "desc" },
        take: 50,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.notification.count(),
    ]);

    const usersWithLastAccess = users.map((user) => ({
      ...user,
      lastSearch: user.searchHistory[0] || null,
      searchHistory: undefined,
    }));

    return NextResponse.json({
      stats: {
        totalUsers: users.length,
        alerts,
        activeAlerts,
        favorites,
        totalSearches,
        searches24h,
        searches7d,
        notifications,
      },
      users: usersWithLastAccess,
      acceptances,
      recentSearches,
    });
  } catch (error) {
    console.error("Erro no admin:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
