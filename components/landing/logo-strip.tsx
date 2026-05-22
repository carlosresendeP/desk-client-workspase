const LOGOS = [
  "Agência Nova",
  "Studio Digital",
  "TechBR Labs",
  "DesignCo",
  "WebCraft",
  "Devflow",
]

export function LogoStrip() {
  return (
    <section className="py-12 border-y border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-8">
          Usado por times de todo o Brasil
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {LOGOS.map((name) => (
            <span
              key={name}
              className="text-sm font-black text-muted-foreground/40 tracking-tight select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
