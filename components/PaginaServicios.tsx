const servicios = [
  {
    id: "registro-de-obras",
    titulo: "Registro de Obras",
    descripcion:
      "Documentamos y certificamos tu obra para incluirla en nuestro catálogo, con respaldo legal y técnico.",
  },
  {
    id: "grupo-de-coleccionistas",
    titulo: "Grupo de Coleccionistas",
    descripcion:
      "Únete a una comunidad privada de coleccionistas con acceso preferente a piezas exclusivas y subastas.",
  },
  {
    id: "restauracion-de-arte",
    titulo: "Restauración de Arte",
    descripcion:
      "Especialistas en conservación y restauración de obras históricas y contemporáneas.",
  },
  {
    id: "museos-asociaciones-y-galerias",
    titulo: "Museos, Asociaciones y Galerías",
    descripcion:
      "Alianzas institucionales para préstamos, exhibiciones conjuntas y programas educativos.",
  },
  {
    id: "manager-de-ventas",
    titulo: "Manager de Ventas",
    descripcion:
      "Un agente dedicado que gestiona la venta de tu colección con estrategia y discreción.",
  },
  {
    id: "exposicion",
    titulo: "Exposición",
    descripcion:
      "Organizamos exposiciones temáticas, presenciales o digitales, para dar visibilidad a tu obra.",
  },
];

export default function PaginaServicios() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-wide text-white">
        Servicios
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Todo lo que ERUDITO Galery ofrece a artistas, coleccionistas e
        instituciones.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {servicios.map((s) => (
          <div
            key={s.id}
            id={s.id}
            className="scroll-mt-28 rounded-2xl bg-zinc-900 p-6 ring-1 ring-white/10"
          >
            <h2 className="text-base font-bold text-white">{s.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {s.descripcion}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
