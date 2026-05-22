import Link from "next/link"
import { Users } from "lucide-react"

const FOOTER_COLS = [
  {
    title: "Produto",
    links: ["Funcionalidades", "Preços", "Roadmap", "Changelog"],
  },
  {
    title: "Empresa",
    links: ["Sobre", "Blog", "Carreiras", "Contato"],
  },
  {
    title: "Legal",
    links: ["Privacidade", "Termos", "Cookies", "LGPD"],
  },
]


export function Footer() {

const date = new Date().getFullYear()

  return (
    <footer className="bg-primary py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-accent flex items-center justify-center">
                <Users className="size-4 text-accent-foreground" />
              </div>
              <span className="font-black text-xl text-primary-foreground">
                Desk<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/35 leading-relaxed max-w-md">
              Workspace para freelancers e agências gerenciarem clientes, projetos e receita.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-black uppercase tracking-widest text-primary-foreground/35 mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-primary-foreground/30 hover:text-primary-foreground/65 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/25">
            © {date} Desk. Todos os direitos reservados.
          </p>
          <p className="text-xs text-primary-foreground/25">🇧🇷 Desenvolvido por <strong>Carlos Paula</strong></p>
        </div>
      </div>
    </footer>
  )
}
