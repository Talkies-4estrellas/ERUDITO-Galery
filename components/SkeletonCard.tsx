export function SkeletonObra() {
  return (
    <div className="w-60 shrink-0 sm:w-64">
      <div className="aspect-[3/4] animate-shimmer rounded-3xl bg-zinc-800" />
      <div className="mt-3 flex items-center gap-2 px-1">
        <div className="size-9 animate-shimmer rounded-full bg-zinc-800" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2.5 w-3/4 animate-shimmer rounded-full bg-zinc-800" />
          <div className="h-2 w-1/2 animate-shimmer rounded-full bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonArticulo() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10">
      <div className="aspect-[16/9] animate-shimmer bg-zinc-800" />
      <div className="space-y-2 p-4">
        <div className="h-2 w-1/3 animate-shimmer rounded-full bg-zinc-800" />
        <div className="h-3 w-full animate-shimmer rounded-full bg-zinc-800" />
        <div className="h-3 w-4/5 animate-shimmer rounded-full bg-zinc-800" />
        <div className="h-2 w-1/4 animate-shimmer rounded-full bg-zinc-800 mt-3" />
      </div>
    </div>
  );
}

export function SkeletonEventoCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10">
      <div className="aspect-[16/9] animate-shimmer bg-zinc-800" />
      <div className="space-y-2 p-5">
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-shimmer rounded-full bg-zinc-800" />
          <div className="h-5 w-20 animate-shimmer rounded-full bg-zinc-800" />
        </div>
        <div className="h-3.5 w-3/4 animate-shimmer rounded-full bg-zinc-800 mt-1" />
        <div className="h-2.5 w-1/2 animate-shimmer rounded-full bg-zinc-800" />
        <div className="h-2 w-full animate-shimmer rounded-full bg-zinc-800" />
        <div className="h-2 w-4/5 animate-shimmer rounded-full bg-zinc-800" />
        <div className="mt-3 h-8 animate-shimmer rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}
