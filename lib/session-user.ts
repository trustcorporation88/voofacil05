import { prisma } from "@/lib/prisma";

type SessionUserLike = {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

type SessionLike = {
  user?: SessionUserLike | null;
} | null;

export async function resolveAuthenticatedUser(session: SessionLike) {
  const sessionUser = session?.user;

  if (!sessionUser) {
    return null;
  }

  const sessionId = sessionUser.id?.trim();
  if (sessionId) {
    const userById = await prisma.user.findUnique({
      where: { id: sessionId },
    });

    if (userById) {
      return userById;
    }
  }

  const email = sessionUser.email?.trim().toLowerCase();
  if (!email) {
    return null;
  }

  return prisma.user.upsert({
    where: { email },
    update: {
      name: sessionUser.name || undefined,
      image: sessionUser.image || undefined,
    },
    create: {
      email,
      name: sessionUser.name || undefined,
      image: sessionUser.image || undefined,
    },
  });
}
