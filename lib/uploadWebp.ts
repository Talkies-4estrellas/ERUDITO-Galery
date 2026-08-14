"use client";

/**
 * Convierte cualquier imagen a WebP usando Canvas API nativa (browser only).
 * Sin dependencias npm.
 */
export async function convertToWebp(file: File, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Canvas toBlob falló")); return; }
          const stem = file.name.replace(/\.[^.]+$/, "");
          resolve(new File([blob], `${stem}.webp`, { type: "image/webp" }));
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo cargar la imagen"));
    };
    img.src = objectUrl;
  });
}

/**
 * Convierte un File a WebP y lo sube al bucket de Supabase via /api/upload.
 * Devuelve la URL pública.
 */
export async function uploadImagenWebp(file: File, carpeta: string): Promise<string> {
  const webp = await convertToWebp(file);
  const form = new FormData();
  form.append("file", webp);
  const res = await fetch(`/api/upload?carpeta=${encodeURIComponent(carpeta)}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error ?? "Error al subir imagen");
  }
  const { url } = await res.json();
  return url as string;
}

/** Alias de compatibilidad: acepta URL completa o nombre de carpeta. */
export async function uploadWebp(file: File, urlOrCarpeta: string): Promise<string> {
  let carpeta = urlOrCarpeta;
  try {
    const u = new URL(urlOrCarpeta, "http://localhost");
    carpeta = u.searchParams.get("carpeta") ?? "";
  } catch {
    // ya es nombre de carpeta
  }
  return uploadImagenWebp(file, carpeta);
}
