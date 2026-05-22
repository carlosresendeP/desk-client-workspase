"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  UserCheck, Users, FolderKanban, BarChart3,
  Home, FileText, DollarSign, Settings, Layout,
} from "lucide-react"

const STEPS = [
  {
    n: "01",
    Icon: UserCheck,
    title: "Crie sua conta",
    desc: "Cadastro em menos de 2 minutos, sem cartão de crédito.",
  },
  {
    n: "02",
    Icon: Users,
    title: "Importe seus clientes",
    desc: "Adicione via planilha CSV ou manualmente. Histórico e contatos centralizados.",
  },
  {
    n: "03",
    Icon: FolderKanban,
    title: "Organize projetos e orçamentos",
    desc: "Crie projetos no kanban, envie orçamentos profissionais e acompanhe aprovações.",
  },
  {
    n: "04",
    Icon: BarChart3,
    title: "Acompanhe e cresça",
    desc: "Dashboard em tempo real com receita, leads e satisfação de clientes.",
  },
]

const SIDEBAR_NAV = [
  { Icon: Home, label: "Dashboard", active: true },
  { Icon: Users, label: "Clientes", active: false },
  { Icon: FolderKanban, label: "Projetos", active: false },
  { Icon: Layout, label: "Kanban", active: false },
  { Icon: FileText, label: "Orçamentos", active: false },
  { Icon: DollarSign, label: "Financeiro", active: false },
  { Icon: Settings, label: "Config.", active: false },
]

const MOCK_CLIENTS = [
  { initials: "M", name: "Studio MC", value: "R$8.400", s: "andamento" },
  { initials: "R", name: "Rafael Design", value: "R$3.200", s: "concluido" },
  { initials: "T", name: "Tech Builders", value: "R$12.000", s: "andamento" },
  { initials: "L", name: "Loja Premium", value: "R$5.600", s: "pausado" },
]

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
const S_LABEL: Record<string, string> = {
  andamento: "Andamento",
  concluido: "Concluído",
  pausado: "Pausado",
}

const CHART_BARS = [
  { h: "h-[35%]" }, { h: "h-[55%]" }, { h: "h-[42%]" }, { h: "h-[70%]" },
  { h: "h-[50%]" }, { h: "h-[85%]" }, { h: "h-full" },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="how" ref={ref} className="py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
            Como funciona
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-[2.4rem] font-black text-foreground leading-tight max-w-md">
            Comece em minutos, veja resultados em dias.
          </motion.h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* LEFT — steps */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="lg:col-span-2 space-y-0"
          >
            {STEPS.map((step, i) => {
              const Icon = step.Icon
              return (
                <motion.div key={step.n} variants={fadeUp} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                      <Icon className="size-5 text-accent" />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-border my-2 min-h-[1.5rem]" />
                    )}
                  </div>
                  <div className="pb-7">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-accent">{step.n}</span>
                      <h3 className="font-black text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* RIGHT — app mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-muted border-b border-border">
                <span className="size-2 rounded-full bg-destructive/50" />
                <span className="size-2 rounded-full bg-status-pausado/50" />
                <span className="size-2 rounded-full bg-status-concluido/50" />
                <div className="flex-1 mx-3">
                  <div className="h-4 bg-muted-foreground/10 rounded max-w-[180px] mx-auto flex items-center justify-center">
                    <span className="text-[8px] text-muted-foreground/40">app.desk.com.br/dashboard</span>
                  </div>
                </div>
              </div>

              {/* App layout */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-32 border-r border-border bg-card shrink-0 py-4 px-2">
                  <div className="flex items-center gap-1.5 mb-4 px-1.5">
                    <div className="size-5 rounded-md bg-primary flex items-center justify-center">
                      <Users className="size-2.5 text-accent" />
                    </div>
                    <span className="font-black text-[10px] text-foreground">Desk.</span>
                  </div>
                  <nav className="space-y-0.5">
                    {SIDEBAR_NAV.map(({ Icon, label, active }) => (
                      <div
                        key={label}
                        className={`flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-[9px] font-medium ${
                          active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-2.5 shrink-0" />
                        {label}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 min-w-0">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[["R$47.200", "Receita total"], ["128", "Clientes"], ["34", "Projetos"]].map(([v, l]) => (
                      <div key={l} className="rounded-lg bg-muted/50 border border-border p-2.5">
                        <p className="text-xs font-black text-foreground">{v}</p>
                        <p className="text-[8px] text-muted-foreground mt-0.5">{l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mini chart */}
                  <div className="rounded-lg border border-border p-3 mb-4">
                    <p className="text-[9px] font-bold text-foreground mb-2">Receita mensal</p>
                    <div className="flex items-end gap-1 h-10">
                      {CHART_BARS.map(({ h }, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t-sm ${h} ${
                            i === CHART_BARS.length - 1 ? "bg-accent" : "bg-muted-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Client list */}
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="px-3 py-2 border-b border-border bg-muted/30">
                      <p className="text-[9px] font-bold text-foreground">Clientes recentes</p>
                    </div>
                    {MOCK_CLIENTS.map((c) => (
                      <div key={c.name} className="flex items-center gap-2 px-3 py-2 border-b border-border last:border-0">
                        <div className={`size-5 rounded-full ${A_CLASS[c.s]} flex items-center justify-center text-[7px] font-black text-primary-foreground shrink-0`}>
                          {c.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-semibold text-foreground truncate">{c.name}</p>
                        </div>
                        <p className="text-[9px] font-bold text-foreground shrink-0">{c.value}</p>
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${S_CLASS[c.s]}`}>
                          {S_LABEL[c.s]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
