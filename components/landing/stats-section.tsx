"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "motion/react"
import { Check, X, TrendingUp } from "lucide-react"

const BARS = [
  { pct: "30%", accent: false },
  { pct: "52%", accent: false },
  { pct: "41%", accent: false },
  { pct: "68%", accent: false },
  { pct: "55%", accent: false },
  { pct: "80%", accent: false },
  { pct: "62%", accent: false },
  { pct: "88%", accent: false },
  { pct: "70%", accent: false },
  { pct: "95%", accent: false },
  { pct: "78%", accent: false },
  { pct: "100%", accent: true },
]

const TABS = {
  com: [
    "Todos os clientes centralizados em um só lugar",
    "Projetos e prazos sempre sob controle",
    "Orçamentos profissionais enviados em minutos",
    "Financeiro e recebíveis em tempo real",
    "Pipeline de leads para fechar mais contratos",
  ],
  sem: [
    "Clientes espalhados em contatos do celular",
    "Prazos perdidos por falta de organização",
    "Orçamentos feitos no Word ou à mão",
    "Sem visão clara da receita mensal",
    "Oportunidades esquecidas sem follow-up",
  ],
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [activeTab, setActiveTab] = useState<"com" | "sem">("com")

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — analytics card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Card header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Receita</p>
                  <p className="text-2xl font-black text-foreground mt-0.5">R$47.200</p>
                </div>
                <div className="flex items-center gap-1.5 bg-status-concluido/10 text-status-concluido text-xs font-bold px-3 py-1.5 rounded-full">
                  <TrendingUp className="size-3" />
                  +23% este mês
                </div>
              </div>

              {/* Chart */}
              <div className="p-5">
                <div className="flex items-end gap-1.5 h-28">
                  {BARS.map(({ pct, accent }, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={inView ? { height: pct } : { height: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className={`flex-1 rounded-t-sm ${accent ? "bg-accent" : "bg-muted-foreground/15"}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map((m) => (
                    <span key={m} className="text-[10px] text-muted-foreground">{m}</span>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-0 border-t border-border">
                {[
                  { label: "Clientes", value: "128" },
                  { label: "Projetos", value: "34" },
                  { label: "Satisfação", value: "98%" },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className={`px-4 py-3 text-center ${i < 2 ? "border-r border-border" : ""}`}
                  >
                    <p className="text-base font-black text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -right-5 bg-primary text-primary-foreground rounded-2xl px-4 py-2.5 shadow-lg"
            >
              <p className="text-[10px] text-primary-foreground/50">Novos clientes</p>
              <p className="text-lg font-black">+12 <span className="text-status-concluido text-sm">este mês</span></p>
            </motion.div>
          </motion.div>

          {/* RIGHT — tabs comparison */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
              Produtividade
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-[2.4rem] font-black text-foreground leading-tight mb-5">
              Tome decisões com base em dados reais.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base text-muted-foreground leading-relaxed mb-7">
              Veja como o Desk transforma a gestão do seu negócio.
            </motion.p>

            {/* Tabs */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-flex rounded-xl bg-muted p-1 gap-1">
                <button
                  onClick={() => setActiveTab("com")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === "com"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Com Desk
                </button>
                <button
                  onClick={() => setActiveTab("sem")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === "sem"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sem Desk
                </button>
              </div>
            </motion.div>

            <ul className="space-y-3">
              {TABS[activeTab].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    activeTab === "com" ? "bg-accent/15" : "bg-destructive/10"
                  }`}>
                    {activeTab === "com"
                      ? <Check className="size-3.5 text-accent" />
                      : <X className="size-3.5 text-destructive" />
                    }
                  </div>
                  <span className="text-sm text-foreground/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
