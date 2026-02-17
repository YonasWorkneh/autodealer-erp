"use client";

import React, { ReactElement, useEffect, useState } from "react";
import Loading from "./loading";
import { useUserStore } from "@/store/user";
import { useRouter, usePathname } from "next/navigation";
import { initializeAuthState, clearAuthState } from "@/lib/api";

export default function Protected({
  children,
  isLogged,
}: {
  children: ReactElement;
  isLogged: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath =
    pathname?.startsWith("/signin") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset");
  const [isMounted, setIsMounted] = useState(() => isAuthPath);
  const { setUser } = useUserStore();

  useEffect(() => {
    // For auth pages, just mount immediately without any auth logic
    if (isAuthPath) {
      setIsMounted(true);
      return;
    }

    // For non-auth pages, check if user is logged in
    if (!isLogged) {
      clearAuthState();
      router.push("/signin");
      return;
    }

    // Only run auth refresh for logged-in users on non-auth pages
    const refreshUserCredentials = async () => {
      try {
        const res = await fetch("/api/me");
    
        const data = await res.json();

        if (!data.ok) {
          clearAuthState();
          router.push("/signin");
          return;
        }
        if (!data.user) {
          clearAuthState();
          router.push("/signin");
          return;
        }
        setUser(data.user);
        initializeAuthState(data.user);
        setIsMounted(true);
      } catch (err: any) {
        clearAuthState();
        router.push("/signin");
      }
    };

    refreshUserCredentials();
  }, [isAuthPath, isLogged, router, setUser, pathname]);
  if (!isMounted) return <Loading />;
  return <div>{children}</div>;
}
