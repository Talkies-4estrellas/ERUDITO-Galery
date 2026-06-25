"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface ToastItem {
  id: string;
  mensaje: string;
  icono?: string;
  tipo?: "ok" | "warn";
}

interface ToastCtx {
  toast: (mensaje: string, opts?: { icono?: string; tipo?: "ok" | "warn" }) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback(
    (mensaje: string, opts?: { icono?: string; tipo?: "ok" | "warn" }) => {
      const id = crypto.randomUUID();
      setItems((prev) => [...prev, { id, mensaje, ...opts }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
    },
    []
  );

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-4 z-[9999] flex flex-col gap-2 sm:right-6"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex animate-toast-in items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium shadow-xl backdrop-blur-md ring-1 ${
              item.tipo === "warn"
                ? "bg-rose-950/90 text-rose-300 ring-rose-400/20"
                : "bg-zinc-900/95 text-white ring-white/15"
            }`}
          >
            {item.icono && <span className="text-base leading-none">{item.icono}</span>}
            {item.mensaje}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
