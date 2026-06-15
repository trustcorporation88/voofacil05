import { PrismaClient } from "@prisma/client";

function normalizeDatabaseUrl(rawUrl: string) {
  if (!/^postgres(ql)?:\/\//i.test(rawUrl)) {
    throw new Error("DATABASE_URL precisa começar com postgresql:// ou postgres://");
  }

  const url = new URL(rawUrl);
  url.searchParams.set("pgbouncer", "true");
  url.searchParams.set("connection_limit", "1");
  url.searchParams.set("pool_timeout", "0");

  return url.toString();
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não configurada");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: normalizeDatabaseUrl(databaseUrl),
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
