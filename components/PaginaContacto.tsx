"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

type Asunto = "Adquisición" | "Consulta" | "Servicios" | "Prensa" | "Otro";

const ASUNTOS: Asunto[] = ["Adquisición", "Consulta", "Servicios", "Prensa", "Otro"];

const INFO = [
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    titulo: "Dirección",
    lineas: ["Av. Presidente Masaryk 123", "Polanco, Ciudad de México", "C.P. 11560"],
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    titulo: "Teléfono",
    lineas: ["+52 (55) 5280 4100", "Lun–Vie 9:00–18:00"],
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    titulo: "Correo",
    lineas: ["contacto@eruditogalery.com", "prensa@eruditogalery.com"],
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    titulo: "Horario",
    lineas: ["Martes a Domingo", "10:00 – 20:00 hrs", "Lunes cerrado"],
  },
];

export default function PaginaContacto() {
  const { toast } = useToast();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("")
  const [asunto, setAsunto] = useState<Asunto>("Consulta");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const mensajes = JSON.parse(localStorage.getItem("erudito-contacto") || "[]");
    mensajes.push({ nombre, email, asunto, mensaje, fecha: new Date().toISOString() });
    localStorage.setItem("erudito-contacto", JSON.stringify(mensajes));
    toast("Mensaje enviado. Te respondemos en 24 h.", { icono: "✉️" });
    setEnviado(true);
    setNombre(""); setEmail(""); setMensaje(""); setAsunto("Consulta");
    setTimeout(() => setEnviado(false), 4000);
  }

  const INPUT = "w-full rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none transition focus:ring-amber-400/50";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      {/* Encabezado */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Hablemos</p>
        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">Contacto</h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-400">
          Consultas sobre obras, adquisiciones, servicios de restauración o prensa. Respondemos en menos de 24 horas.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

        {/* Formulario */}
        <form onSubmit={enviar} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Nombre completo</label>
              <input required value={nombre} onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre" className={INPUT} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Correo electrónico</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com" className={INPUT} />
            </div>
          </div>

          {/* Asunto */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-400">Asunto</p>
            <div className="flex flex-wrap gap-2">
              {ASUNTOS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAsunto(a)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ring-1 ${
                    asunto === a
                      ? "bg-amber-400 text-zinc-900 ring-amber-400"
                      : "bg-zinc-800 text-zinc-400 ring-white/10 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Mensaje</label>
            <textarea required rows={5} value={mensaje} onChange={e => setMensaje(e.target.value)}
              placeholder="Cuéntanos en qué podemos ayudarte…"
              className={`${INPUT} resize-none`} />
          </div>

          {enviado ? (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-400/8 px-5 py-4 ring-1 ring-emerald-400/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5 shrink-0 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-emerald-400">Mensaje recibido</p>
                <p className="text-xs text-zinc-500">Te escribiremos a {email || "tu correo"} en breve.</p>
              </div>
            </div>
          ) : (
            <button type="submit"
              className="rounded-full bg-amber-400 px-8 py-3 text-sm font-bold text-zinc-900 transition hover:bg-amber-300 active:scale-95">
              Enviar mensaje →
            </button>
          )}
        </form>

        {/* Información de contacto */}
        <aside className="space-y-4">
          {INFO.map(({ icono, titulo, lineas }) => (
            <div key={titulo} className="flex gap-4 rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                {icono}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{titulo}</p>
                {lineas.map((l) => (
                  <p key={l} className="mt-0.5 text-sm text-zinc-300">{l}</p>
                ))}
              </div>
            </div>
          ))}

          {/* Redes */}
          <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Redes sociales</p>
            <div className="flex gap-3">
              {["IG", "FB", "TW", "YT"].map((red) => (
                <button key={red} type="button"
                  className="flex size-9 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-zinc-400 ring-1 ring-white/10 transition hover:bg-amber-400 hover:text-zinc-900">
                  {red}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
