"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Target, FileText, DollarSign, UserCheck, BarChart3, TrendingUp } from "lucide-react"

const MINI_BARS = [
  { h: "h-[40%]" }, { h: "h-[60%]" }, { h: "h-[45%]" },
  { h: "h-[75%]" }, { h: "h-[55%]" }, { h: "h-full" },
]

const MOCK_CLIENTS = [
  { initials: "M", name: "Studio MC",      project: "Redesign Website",  s: "andamento" },
  { initials: "R", name: "Rafael Design",  project: "App Mobile",         s: "concluido" },
  { initials: "T", name: "Tech Builders",  project: "Dashboard Admin",    s: "andamento" },
]

const A_CLASS: Record<string, string> = {
  andamento: "bg-status-andamento",
  concluido: "bg-status-concluido",
  pausado:   "bg-status-pausado",
}
const S_CLASS: Record<string, string> = {
  andamento: "bg-status-andamento/20 text-status-andamento",
  concluido: "bg-status-concluido/20 text-status-concluido",
  pausado:   "bg-status-pausado/20 text-status-pausado",
}
const S_LABEL: Record<string, string> = {
  andamento: "Andamento",
  concluido: "Concluído",
  pausado:   "Pausado",
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

        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-12"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
            Funcionalidades
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-[2.4rem] font-black text-foreground leading-tight max-w-lg mb-3">
            Tudo que você precisa para gerir clientes.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-muted-foreground max-w-md">
            CRM, projetos, finanças e leads num só workspace.
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* ── CRM card — large, dark ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-2 rounded-2xl bg-primary p-6 overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="size-9 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <UserCheck className="size-5 text-accent" />
              </div>
              <div>
                <p className="font-black text-sm text-primary-foreground">CRM completo</p>
                <p className="text-[11px] text-primary-foreground/40">Gestão de clientes</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/55 mb-5 leading-relaxed max-w-sm">
              Histórico de interações, anotações e toda a jornada do cliente num só lugar.
            </p>
            {/* Mini client list */}
            <div className="rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 overflow-hidden">
              {MOCK_CLIENTS.map((c, i) => (
                <div
                  key={c.name}
                  className={`flex items-center gap-2.5 px-4 py-2.5 ${
                    i < MOCK_CLIENTS.length - 1 ? "border-b border-primary-foreground/10" : ""
                  }`}
                >
                  <div className={`size-7 rounded-full ${A_CLASS[c.s]} flex items-center justify-center text-[9px] font-black text-primary-foreground shrink-0`}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-primary-foreground truncate">{c.name}</p>
                    <p className="text-[9px] text-primary-foreground/40 truncate">{c.project}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${S_CLASS[c.s]}`}>
                    {S_LABEL[c.s]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Dashboard analytics card ───────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-muted/50 border border-border p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <BarChart3 className="size-4 text-accent" />
              </div>
              <p className="font-bold text-sm text-foreground">Dashboard em tempo real</p>
            </div>
            <p className="text-3xl font-black text-foreground">R$47k</p>
            <div className="flex items-center gap-1.5 text-status-concluido text-xs font-bold mt-1 mb-6">
              <TrendingUp className="size-3" />
              +23% este mês
            </div>
            <div className="flex items-end gap-1 h-14 mt-auto">
              {MINI_BARS.map(({ h }, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm ${h} ${
                    i === MINI_BARS.length - 1 ? "bg-accent" : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Pipeline card ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="size-9 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Target className="size-5 text-accent" />
            </div>
            <p className="font-black text-sm text-foreground mb-1">Pipeline de leads</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Kanban de vendas para visualizar e fechar mais contratos.
            </p>
            {/* Mini kanban */}
            <div className="flex gap-1.5">
              {([["Prospecção", 2], ["Negociando", 1], ["Fechado", 1]] as [string, number][]).map(([col, count]) => (
                <div key={col} className="flex-1 rounded-lg bg-muted/50 p-1.5">
                  <p className="text-[7px] font-bold text-muted-foreground mb-1.5 truncate">{col}</p>
                  {Array.from({ length: count }).map((_, j) => (
                    <div key={j} className="h-4 rounded bg-card border border-border mb-1 last:mb-0" />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Orçamentos card — accent highlight ────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-accent/10 border border-accent/20 p-6"
          >
            <div className="size-9 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
              <FileText className="size-5 text-accent" />
            </div>
            <p className="font-black text-sm text-foreground mb-1">Orçamentos online</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Propostas profissionais aprovadas com um clique.
            </p>
            {/* Mini proposal */}
            <div className="rounded-xl bg-card border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-foreground">Studio MC</p>
                <span className="text-[8px] font-bold bg-status-concluido/15 text-status-concluido px-1.5 py-0.5 rounded-full">
                  Aprovado
                </span>
              </div>
              <p className="text-xl font-black text-foreground">R$8.400</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Redesign Website</p>
            </div>
          </motion.div>

          {/* ── Financeiro card ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="size-9 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <DollarSign className="size-5 text-accent" />
            </div>
            <p className="font-black text-sm text-foreground mb-1">Controle financeiro</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Faturamento e recebíveis por cliente em tempo real.
            </p>
            {/* Mini financials */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[9px] text-muted-foreground">Recebido</p>
                  <p className="text-[10px] font-bold text-status-concluido">R$12.400</p>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-status-concluido rounded-full w-3/4" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[9px] text-muted-foreground">Pendente</p>
                  <p className="text-[10px] font-bold text-status-pausado">R$3.200</p>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-status-pausado rounded-full w-1/4" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
