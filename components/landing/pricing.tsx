"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const PLANS = [
  {
    name: "Grátis",
    price: "R$0",
    period: "",
    badge: null as string | null,
    desc: "Para começar a organizar sem custo.",
    href: "/cadastro",
    cta: "Começar grátis",
    highlight: false,
    features: [
      "Até 10 clientes",
      "3 projetos ativos",
      "2 orçamentos por mês",
      "Dashboard básico",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Pro",
    price: "R$17",
    period: "/mês",
    badge: "Mais popular" as string | null,
    desc: "Para freelancers e agências que querem crescer.",
    href: "/cadastro",
    cta: "Assinar Pro",
    highlight: true,
    features: [
      "Clientes ilimitados",
      "Projetos ilimitados",
      "Orçamentos ilimitados",
      "Pipeline de leads (Kanban)",
      "Controle financeiro completo",
      "Dashboard avançado",
      "Suporte prioritário em português",
    ],
  },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="pricing" ref={ref} className="py-24 bg-muted/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
            Preços
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-foreground mb-3">
            Simples e transparente
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-muted-foreground">
            Comece grátis. Escale quando crescer.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto items-stretch"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative rounded-2xl p-8 flex flex-col gap-6 ${
                plan.highlight
                  ? "bg-primary ring-2 ring-accent"
                  : "bg-card border border-border"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[11px] font-black px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div>
                <p className="text-sm font-bold text-accent mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${plan.highlight ? "text-primary-foreground" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlight ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-2 ${plan.highlight ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <div className={`size-5 rounded-full flex items-center justify-center shrink-0 ${
                      plan.highlight ? "bg-accent/20" : "bg-accent/10"
                    }`}>
                      <Check className="size-3 text-accent" />
                    </div>
                    <span className={plan.highlight ? "text-primary-foreground/75" : "text-foreground/75"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="block">
                <Button
                  className={`w-full font-bold flex items-center gap-2 justify-center ${
                    plan.highlight
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {plan.cta}
                  {plan.highlight && <ArrowRight className="size-4" />}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Sem cartão de crédito · Cancele quando quiser · Suporte em português
        </motion.p>
      </div>
    </section>
  )
}
