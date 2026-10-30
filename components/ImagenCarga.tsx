"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** next/image con un brillo animado detrás mientras la foto termina de cargar. El contenedor debe ser `relative`. */
export default function ImagenCarga({ onLoad, ...props }: ImageProps) {
  const [cargada, setCargada] = useState(false);

  return (
    <>
      {!cargada && (
        <span
          aria-hidden
          className="absolute inset-0 animate-[shimmer_1.5s_linear_infinite] bg-[length:200%_100%] bg-[linear-gradient(90deg,#27272a_25%,#3f3f46_50%,#27272a_75%)] motion-reduce:animate-none [[data-theme=light]_&]:bg-[linear-gradient(90deg,#e5e4e1_25%,#f0efed_50%,#e5e4e1_75%)]"
        />
      )}
      <Image
        {...props}
        onLoad={(e) => {
          setCargada(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
