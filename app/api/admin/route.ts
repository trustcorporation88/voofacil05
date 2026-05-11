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

function formatDurationSeconds(startedAt: Date, lastSeenAt: Date, durationSeconds: number) {
  if (durationSeconds > 0) return durationSeconds;
  return Math.max(0, Math.floor((new Date(lastSeenAt).getTime() - new Date(startedAt).getTime()) / 1000));
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.toLowerCase();
    const adminEmails = getAdminEmails();

    if (!sessionEmail || !adminEmails.includes(sessionEmail)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const now = new Date();
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const since15m = new Date(Date.now() - 15 * 60 * 1000);
    const since60m = new Date(Date.now() - 60 * 60 * 1000);
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);

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
      totalSessions,
      sessionsToday,
      activeSessions15m,
      activeSessions60m,
      pageViewsToday,
      avgDurationAgg,
      topPagesRaw,
      recentSessionsRaw,
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
              visitSessions: true,
              pageViews: true,
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

      prisma.visitSession.count(),

      prisma.visitSession.count({
        where: {
          startedAt: { gte: startToday },
        },
      }),

      prisma.visitSession.count({
        where: {
          lastSeenAt: { gte: since15m },
        },
      }),

      prisma.visitSession.count({
        where: {
          lastSeenAt: { gte: since60m },
        },
      }),

      prisma.pageView.count({
        where: {
          visitedAt: { gte: startToday },
        },
      }),

      prisma.visitSession.aggregate({
        _avg: {
          durationSeconds: true,
        },
        where: {
          startedAt: { gte: startToday },
          durationSeconds: { gt: 0 },
        },
      }),

      prisma.pageView.groupBy({
        by: ["path"],
        _count: {
          path: true,
        },
        where: {
          visitedAt: { gte: startToday },
        },
        orderBy: {
          _count: {
            path: "desc",
          },
        },
        take: 10,
      }),

      prisma.visitSession.findMany({
        orderBy: { startedAt: "desc" },
        take: 50,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              pageViews: true,
            },
          },
        },
      }),
    ]);

    const usersWithLastAccess = users.map((user) => ({
      ...user,
      lastSearch: user.searchHistory[0] || null,
      searchHistory: undefined,
    }));

    const recentSessions = recentSessionsRaw.map((session) => ({
      ...session,
      computedDurationSeconds: formatDurationSeconds(
        session.startedAt,
        session.lastSeenAt,
        session.durationSeconds
      ),
    }));

    const avgPagesPerSession =
      sessionsToday > 0 ? Number((pageViewsToday / sessionsToday).toFixed(2)) : 0;

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
        totalSessions,
        sessionsToday,
        activeSessions15m,
        activeSessions60m,
        pageViewsToday,
        avgSessionSeconds: Math.round(avgDurationAgg._avg.durationSeconds || 0),
        avgPagesPerSession,
      },
      users: usersWithLastAccess,
      acceptances,
      recentSearches,
      recentSessions,
      topPages: topPagesRaw.map((item) => ({
        path: item.path,
        views: item._count.path,
      })),
    });
  } catch (error) {
    console.error("Erro no admin:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
