"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null);
        setCargando(false);
      }).catch(() => setCargando(false));

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch {
      setCargando(false);
    }
  }, []);

  const entrar = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const registrar = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);

  const salir = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, cargando, entrar, registrar, salir };
}
