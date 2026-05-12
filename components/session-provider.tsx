"use client";

import type { ReactNode } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { LoginRequiredListener } from "@/components/login-required-listener";

export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider refetchOnWindowFocus={false}>
      <LoginRequiredListener />
      {children}
    </NextAuthSessionProvider>
  );
}
