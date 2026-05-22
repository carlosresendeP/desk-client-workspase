"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Target, FileText, DollarSign, UserCheck, Bell, BarChart3 } from "lucide-react"

const FEATURES = [
  { Icon: UserCheck, title: "CRM completo", desc: "Histórico de interações, anotações e toda a jornada do cliente." },
  { Icon: Target, title: "Pipeline de leads", desc: "Kanban de vendas para visualizar e fechar mais contratos." },
  { Icon: FileText, title: "Orçamentos online", desc: "Propostas profissionais aprovadas com um clique." },
  { Icon: DollarSign, title: "Controle financeiro", desc: "Faturamento e recebíveis por cliente em tempo real." },
  { Icon: Bell, title: "Alertas inteligentes", desc: "Lembretes para prazos, pagamentos e follow-ups." },
  { Icon: BarChart3, title: "Dashboard em tempo real", desc: "Visão completa do negócio: receita, projetos e satisfação." },
]

const MOCK_CLIENTS = [
  { initials: "M", name: "Studio MC", project: "Redesign Website", s: "andamento" },
  { initials: "R", name: "Rafael Design", project: "App Mobile", s: "concluido" },
  { initials: "T", name: "Tech Builders", project: "Dashboard Admin", s: "andamento" },
  { initials: "L", name: "Loja Premium", project: "E-commerce", s: "pausado" },
]

const S_LABEL: Record<string, string> = {
  andamento: "Em andamento",
  concluido: "Concluído",
  pausado: "Pausado",
}
const S_CLASS: Record<string, string> = {
  andamento: "bg-status-andamento/15 text-status-andamento",
  concluido: "bg-status-concluido/15 text-status-concluido",
  pausado: "bg-status-pausado/15 text-status-pausado",
}
const A_CLASS: Record<string, string> = {
  andamento: "bg-status-andamento",
  concluido: "bg-status-concluido",
  pausado: "bg-status-pausado",
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="features" ref={ref} className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — feature list */}
          <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
              Funcionalidades
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-[2.4rem] font-black text-foreground leading-tight mb-10">
              Tudo que você precisa para gerir clientes.
            </motion.h2>
            <div className="space-y-6">
              {FEATURES.map((f) => {
                const Icon = f.Icon
                return (
                  <motion.div key={f.title} variants={fadeUp} className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-0.5">{f.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* RIGHT — clients mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground">Workspace</p>
                  <p className="font-bold text-sm text-foreground">Clientes</p>
                </div>
                <div className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-bold px-3 py-1.5 rounded-full">
                  128 ativos
                </div>
              </div>

              {/* Search */}
              <div className="px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                  <div className="size-3 rounded-full bg-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground">Buscar cliente...</span>
                </div>
              </div>

              {/* Client rows */}
              <div className="divide-y divide-border">
                {MOCK_CLIENTS.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 px-5 py-3.5">
                    <div className={`size-8 rounded-full ${A_CLASS[c.s]} flex items-center justify-center text-xs font-black text-primary-foreground shrink-0`}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{c.project}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${S_CLASS[c.s]}`}>
                      {S_LABEL[c.s]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">4 de 128 clientes</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="size-1.5 rounded-full bg-muted-foreground/30" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
