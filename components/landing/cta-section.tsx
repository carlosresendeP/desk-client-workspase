"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const STATS = [
  { value: "500+", label: "Freelancers usando" },
  { value: "R$2M+", label: "Em receita gerenciada" },
  { value: "98%", label: "De satisfação" },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-24 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">

        {/* Social proof numbers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-x-14 gap-y-6 mb-10"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-black text-primary-foreground">{s.value}</p>
              <p className="text-xs text-primary-foreground/40 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="h-px bg-primary-foreground/10 mb-12"
        />

        {/* Copy + CTA */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-6"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-accent">
            Pronto pra começar?
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-6xl font-black text-primary-foreground leading-tight">
            Chega de planilhas.
            <br />
            <span className="text-accent">Comece agora.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-primary-foreground/50 max-w-lg mx-auto">
            Centralize clientes, projetos, orçamentos e finanças. Tudo num só lugar, do jeito certo.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/cadastro">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base px-10 font-bold flex items-center gap-2"
              >
                Criar conta grátis <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 h-12 text-base px-8"
              >
                Já tenho conta
              </Button>
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="text-xs text-primary-foreground/30 pt-1">
            Grátis para começar · Sem cartão de crédito · Suporte em português
          </motion.p>
        </motion.div>

      </div>
    </section>
  )
}
