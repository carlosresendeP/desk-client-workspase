"use client"

import { motion } from "motion/react"
import Link from "next/link"
import {
  ArrowRight, Bell, FolderKanban, Home, Layout,
  Search, Users, FileText, DollarSign, Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import SplitText from "@/components/SplitText"
import RotatingText from "@/components/RotatingText"

const ease = [0.22, 1, 0.36, 1] as const

const SIDEBAR_ITEMS = [
  { Icon: Home, label: "Dashboard", active: true },
  { Icon: Users, label: "Clientes", active: false },
  { Icon: FolderKanban, label: "Projetos", active: false },
  { Icon: Layout, label: "Kanban", active: false },
  { Icon: FileText, label: "Orçamentos", active: false },
  { Icon: DollarSign, label: "Financeiro", active: false },
  { Icon: Settings, label: "Configurações", active: false },
]

const CHART_BARS = [
  { h: "h-[38%]", accent: false },
  { h: "h-[62%]", accent: false },
  { h: "h-[44%]", accent: false },
  { h: "h-[78%]", accent: false },
  { h: "h-[58%]", accent: false },
  { h: "h-[88%]", accent: true },
  { h: "h-[52%]", accent: false },
  { h: "h-[82%]", accent: false },
  { h: "h-[68%]", accent: false },
  { h: "h-[92%]", accent: false },
  { h: "h-[74%]", accent: false },
  { h: "h-full", accent: false },
]

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

const ROTATING_WORDS = ["clientes", "projetos", "tarefas"]

export function Hero() {
  return (
    <section className="bg-primary relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-0 right-0 w-2lg h-2xl rounded-full bg-accent/5 blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2xl h-2xl rounded-full bg-primary-foreground/3 blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* ── TEXT ─────────────────────────────────────── */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-36 pb-14 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-7"
        >
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent border border-accent/20 text-xs font-bold px-4 py-2 rounded-full">
            <span className="size-1.5 rounded-full bg-accent shrink-0" />
            Workspace para freelancers e agências brasileiras
          </span>
        </motion.div>

        {/* Headline — SplitText + RotatingText */}
        <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] w-full font-black tracking-tight text-primary-foreground leading-[1.04] mb-6">
          {/* Linha 1: "Todos os seus [palavra rotativa]" */}
          <div className="flex justify-center items-center gap-2 flex-wrap relative">
            <SplitText
              text="Todos os seus"
              tag="span"
              textAlign="center"
              splitType="chars"
              delay={22}
              duration={0.75}
              ease="power3.out"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="0px"
            />
            <div className="flex items-center gap-2">
              <RotatingText
                texts={ROTATING_WORDS}
                mainClassName="text-accent"
                splitLevelClassName="overflow-hidden"
                rotationInterval={2500}
                staggerDuration={0.025}
                staggerFrom="first"
                splitBy="characters"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-120%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            </div>
          </div>
          {/* Linha 2: "em um só lugar." */}
          <div>
            <SplitText
              text="em um só lugar."
              tag="span"
              textAlign="center"
              splitType="chars"
              delay={22}
              duration={0.75}
              ease="power3.out"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="0px"
            />
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease }}
          className="text-lg text-primary-foreground/50 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Centralize clientes, projetos, orçamentos e finanças numa só plataforma.
          Chega de planilhas espalhadas.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3, ease }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Link href="/cadastro">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8 text-[15px] font-bold flex items-center gap-2"
            >
              Começar de graça <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href="#pricing">
            <Button
              size="lg"
              className="bg-transparent border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8 text-[15px] font-bold"
            >
              Ver preços
            </Button>
          </a>
        </motion.div>
      </div>

      {/* ── APP MOCKUP ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 52 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, delay: 0.45, ease }}
        className="relative max-w-5xl mx-auto px-4 sm:px-6"
      >
        <div className="rounded-t-2xl border-t border-primary-foreground/10 shadow-2xl overflow-hidden">

          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-foreground/5 border-b border-primary-foreground/10">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-status-pausado/60" />
            <span className="size-2.5 rounded-full bg-status-concluido/60" />
            <div className="flex-1 mx-4">
              <div className="h-5 bg-primary-foreground/8 rounded-md max-w-md mx-auto flex items-center justify-center">
                <span className="text-[10px] text-primary-foreground/25 select-none">
                  app.desk.com.br/dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard */}
          <div className="flex bg-card">

            {/* Sidebar */}
            <div className="w-48 border-r border-border bg-card shrink-0 py-5 px-3">
              <div className="flex items-center gap-2 mb-6 px-2">
                <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
                  <Users className="size-3.5 text-accent" />
                </div>
                <span className="font-black text-sm text-foreground">Desk.</span>
              </div>

              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/45 px-2 mb-2.5">
                Menu Principal
              </p>
              <nav className="space-y-0.5">
                {SIDEBAR_ITEMS.map(({ Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 min-w-0">

              {/* Top bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 w-56">
                  <Search className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">Buscar algo aqui...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center relative">
                    <Bell className="size-3.5 text-muted-foreground" />
                    <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-destructive border-2 border-card" />
                  </div>
                  <div className="flex items-center gap-2 bg-muted rounded-xl px-2.5 py-1.5">
                    <div className="size-5 rounded-full bg-accent flex items-center justify-center text-[9px] font-black text-accent-foreground shrink-0">
                      C
                    </div>
                    <span className="text-xs font-semibold text-foreground">Carlos</span>
                  </div>
                </div>
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-3 gap-4">

                {/* Chart — 2 cols */}
                <div className="col-span-2 rounded-xl bg-muted/50 border border-border p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Receita total</p>
                      <p className="text-sm font-bold text-foreground">Estatísticas de gastos</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-background rounded-lg px-2 py-1 border border-border shrink-0">
                      2025
                    </span>
                  </div>

                  {/* Bars */}
                  <div className="flex items-end gap-1 h-20">
                    {CHART_BARS.map(({ h, accent }, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm ${h} ${accent ? "bg-accent" : "bg-muted-foreground/20"}`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-2">
                    {MONTHS.map((m) => (
                      <span key={m} className="text-[8px] text-muted-foreground/45">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Balance card */}
                <div className="rounded-xl bg-primary p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-primary-foreground/45 mb-1">Seu saldo</p>
                    <p className="text-xl font-black text-primary-foreground leading-none">R$47.200</p>
                    <p className="text-[9px] text-primary-foreground/35 mt-1.5">Jan 2025 – Jun 2025</p>
                  </div>
                  <div className="flex gap-1.5 mt-5">
                    <div className="flex-1 bg-accent rounded-lg py-2 text-center">
                      <span className="text-[10px] font-bold text-accent-foreground">Receber</span>
                    </div>
                    <div className="flex-1 bg-primary-foreground/10 border border-primary-foreground/15 rounded-lg py-2 text-center">
                      <span className="text-[10px] font-bold text-primary-foreground">Enviar</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  )
}
