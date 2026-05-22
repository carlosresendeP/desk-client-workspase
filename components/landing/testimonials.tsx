"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Star } from "lucide-react"

const TESTIMONIALS = [
  {
    quote: "O Desk transformou como gerencio minha agência. Tudo centralizado, nada se perde.",
    name: "Mariana Costa",
    role: "Fundadora · Studio MC",
    initials: "M",
    avatarClass: "bg-status-andamento",
    highlight: true,
  },
  {
    quote: "Antes usava 3 planilhas diferentes. Agora tenho tudo em um lugar e economizo 5 horas por semana.",
    name: "Rafael Mendes",
    role: "CEO · Agência Digital",
    initials: "R",
    avatarClass: "bg-accent",
    highlight: false,
  },
  {
    quote: "O pipeline de leads é incrível. Fechamos 30% mais contratos desde que começamos a usar.",
    name: "Ana Beatriz Lima",
    role: "Consultora de Marketing",
    initials: "A",
    avatarClass: "bg-status-concluido",
    highlight: false,
  },
  {
    quote: "Os orçamentos profissionais impressionam meus clientes. Recebi vários elogios pelas propostas.",
    name: "Carlos Souza",
    role: "Dev Freelancer",
    initials: "C",
    avatarClass: "bg-primary",
    highlight: false,
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

export function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-14"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
            Depoimentos
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-[2.4rem] font-black text-foreground leading-tight max-w-sm">
            Experiências que falam por si só.
          </motion.h2>
        </motion.div>

        {/* Grid 2-col */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Featured testimonial — spans full width on small screens, col 1 on md */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="bg-primary rounded-2xl p-8 flex flex-col justify-between row-span-1"
          >
            <div>
              <div className="text-5xl font-black text-accent/40 leading-none mb-4"></div>
              <p className="text-base text-primary-foreground/80 leading-relaxed mb-6">
                {TESTIMONIALS[0].quote}
              </p>
            </div>
            <div>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 text-accent fill-accent" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full ${TESTIMONIALS[0].avatarClass} flex items-center justify-center text-sm font-black text-primary-foreground shrink-0`}>
                  {TESTIMONIALS[0].initials}
                </div>
                <div>
                  <p className="font-bold text-sm text-primary-foreground">{TESTIMONIALS[0].name}</p>
                  <p className="text-xs text-primary-foreground/50">{TESTIMONIALS[0].role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column: 3 stacked */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-5"
          >
            {TESTIMONIALS.slice(1).map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{t.quote}</p>
                <div className="flex items-center gap-2.5 pt-2 border-t border-border">
                  <div className={`size-8 rounded-full ${t.avatarClass} flex items-center justify-center text-xs font-black text-primary-foreground shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
