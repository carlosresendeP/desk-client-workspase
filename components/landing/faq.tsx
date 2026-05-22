"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "motion/react"
import { ChevronDown } from "lucide-react"

const FAQS = [
  {
    q: "Preciso de cartão de crédito para começar?",
    a: "Não. O plano grátis não requer nenhum dado de pagamento. Comece agora mesmo.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Sem fidelidade, sem multa. Cancele quando quiser e continue usando até o período expirar.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Absolutamente. Criptografia de ponta a ponta e backups automáticos diários. Seus dados são seus.",
  },
  {
    q: "O que está incluído no plano Pro?",
    a: "Clientes, projetos e orçamentos ilimitados, pipeline de leads, controle financeiro completo e suporte prioritário em português — tudo por R$17/mês.",
  },
  {
    q: "Posso importar clientes de uma planilha?",
    a: "Sim. Importação via CSV/Excel. Em minutos todos os seus dados estarão na plataforma.",
  },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" ref={ref} className="py-24 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
            FAQ
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-foreground">
            Perguntas frequentes
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-2"
        >
          {FAQS.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-sm text-foreground">{f.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="size-4 text-muted-foreground" />
                </motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 pt-3 text-sm text-muted-foreground leading-relaxed border-t border-border">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
