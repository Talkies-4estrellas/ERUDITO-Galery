"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
  redirigirA?: string;
}

export default function AuthGuard({ children, redirigirA = "/login" }: Props) {
  const { user, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !user) {
      router.replace(redirigirA);
    }
  }, [user, cargando, router, redirigirA]);

  if (cargando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="size-8 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
