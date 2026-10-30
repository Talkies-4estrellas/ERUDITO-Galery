"use client";

import { useEffect, useState } from "react";

/** false en el primer render y true justo después: permite animar la entrada de algo recién montado. */
export function useAparecer() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 16);
    return () => clearTimeout(id);
  }, []);
  return visible;
}

/** Clases y retraso para que el elemento `i` aparezca en cascada (35 ms entre uno y otro). */
export function entradaCascada(visible: boolean, i: number) {
  return {
    className: `transition duration-300 ease-out motion-reduce:transition-none ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
    }`,
    style: { transitionDelay: visible ? `${i * 35}ms` : "0ms" },
  };
}
