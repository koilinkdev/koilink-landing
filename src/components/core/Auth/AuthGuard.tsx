"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshAccessTokenApi } from "@/lib/auth-api";
import {
  clearAuthSession,
  getAuthSession,
  isTokenExpired,
  saveAuthSession,
} from "@/lib/auth-session";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const guard = async () => {
      const session = getAuthSession();
      if (!session?.tokens.access) {
        clearAuthSession();
        if (!cancelled) {
          router.replace("/");
          setChecking(false);
        }
        return;
      }

      if (!isTokenExpired(session.tokens.access)) {
        if (!cancelled) setChecking(false);
        return;
      }

      if (!session.tokens.refresh) {
        clearAuthSession();
        if (!cancelled) {
          router.replace("/");
          setChecking(false);
        }
        return;
      }

      try {
        const refreshed = await refreshAccessTokenApi(session.tokens.refresh);
        saveAuthSession({
          ...session,
          tokens: {
            access: refreshed.access,
            refresh: session.tokens.refresh,
          },
        });
      } catch {
        clearAuthSession();
        if (!cancelled) {
          router.replace("/");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    void guard();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) return null;

  return <>{children}</>;
};

export default AuthGuard;
