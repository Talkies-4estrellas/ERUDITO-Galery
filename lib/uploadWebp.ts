/**
 * Convierte cualquier imagen a WebP (calidad 82 %) usando Canvas API del navegador
 * y la sube al endpoint indicado (POST multipart/form-data).
 *
 * Solo funciona en componentes con "use client" — nunca en el servidor.
 * Usa Canvas API nativa, cero dependencias externas.
 *
 * @param file     Archivo de imagen original (cualquier formato que el navegador soporte)
 * @param endpoint Ruta de la API que recibirá el archivo; por defecto "/api/upload"
 * @returns        URL pública del archivo subido
 */
export async function uploadWebp(
  file: File,
  endpoint = "/api/upload"
): Promise<string> {
  const blob =
    file.type === "image/webp"
      ? file
      : await convertirAWebp(file, 0.82);

  const fd = new FormData();
  fd.append("file", blob, "imagen.webp");

  const res = await fetch(endpoint, { method: "POST", body: fd });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error ?? "Error al subir imagen");
  }

  const { url } = (await res.json()) as { url: string };
  return url;
}

/** Dibuja el archivo en un <canvas> y exporta como WebP */
function convertirAWebp(file: File, calidad: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas 2D no disponible")); return; }

      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(img.src);
          blob ? resolve(blob) : reject(new Error("canvas.toBlob devolvió null"));
        },
        "image/webp",
        calidad
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("No se pudo cargar la imagen"));
    };

    img.src = URL.createObjectURL(file);
  });
}
