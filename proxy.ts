import { NextResponse, type NextRequest } from "next/server";

/** Quien abre la portada por primera vez (sin la marca) pasa antes por /bienvenida; después va directo a la galería. */
const MARCA = "erudito-bienvenida";
const ES_ROBOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|twitter|linkedin|preview|lighthouse|headless/i;

const marcar = (r: NextResponse) => {
  r.cookies.set(MARCA, "1", { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
  return r;
};

export function proxy(req: NextRequest) {
  // Quien ve la presentación por un enlace directo ya no debe volver a ella al entrar a la galería
  if (req.nextUrl.pathname === "/bienvenida") return req.cookies.has(MARCA) ? NextResponse.next() : marcar(NextResponse.next());
  if (req.method !== "GET" || req.cookies.has(MARCA)) return NextResponse.next();
  // Solo personas abriendo la página: no buscadores ni vistas previas de redes; se puede saltar con ?inicio
  if (ES_ROBOT.test(req.headers.get("user-agent") ?? "")) return NextResponse.next();
  const destino = req.headers.get("sec-fetch-dest");
  if (destino && destino !== "document") return NextResponse.next();
  if (req.nextUrl.searchParams.has("inicio")) return NextResponse.next();

  const r = marcar(NextResponse.redirect(new URL("/bienvenida", req.url), 307));
  r.headers.set("cache-control", "no-store");
  return r;
}

export const config = { matcher: ["/", "/bienvenida"] };
