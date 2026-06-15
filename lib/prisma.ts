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

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada");
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: normalizeDatabaseUrl(databaseUrl),
      },
    },
  });
}

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

function getPrismaClient() {
  if (!globalThis.prismaClient) {
    globalThis.prismaClient = createPrismaClient();
  }

  return globalThis.prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
}) as PrismaClient;
