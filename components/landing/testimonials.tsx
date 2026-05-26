"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useInView } from "motion/react"
import { Star, ArrowLeft, ArrowRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const TESTIMONIALS = [
  {
    quote: "O Desk transformou como gerencio minha agência. Tudo centralizado, nada mais se perde. Reduzi o tempo administrativo pela metade.",
    name: "Mariana Costa",
    role: "Fundadora",
    company: "Studio MC",
    initials: "M",
    color: "bg-status-andamento",
  },
  {
    quote: "Antes usava 3 planilhas diferentes. Agora tenho tudo em um lugar e economizo 5 horas por semana. Não consigo imaginar trabalhar sem o Desk.",
    name: "Rafael Mendes",
    role: "CEO",
    company: "Agência Digital",
    initials: "R",
    color: "bg-accent",
  },
  {
    quote: "O pipeline de leads é incrível. Fechamos 30% mais contratos desde que começamos a usar. A visão kanban muda tudo.",
    name: "Ana Beatriz Lima",
    role: "Consultora",
    company: "Marketing Digital",
    initials: "A",
    color: "bg-status-concluido",
  },
  {
    quote: "Os orçamentos profissionais impressionam meus clientes. Recebi vários elogios pelas propostas enviadas. Vale muito a pena.",
    name: "Carlos Souza",
    role: "Dev Freelancer",
    company: "Autônomo",
    initials: "C",
    color: "bg-status-pausado",
  },
  {
    quote: "Finalmente tenho controle total das finanças dos meus projetos. Sei exatamente o que recebi e o que está pendente em tempo real.",
    name: "Juliana Ferreira",
    role: "Designer UX",
    company: "JF Studio",
    initials: "J",
    color: "bg-primary",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-3.5 text-accent fill-accent" />
      ))}
    </div>
  )
}

export function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [api, setApi] = useState<CarouselApi>()

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  return (
    <section ref={ref} className="py-24 bg-muted/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16"
        >

          {/* Left column — title + nav */}
          <div className="lg:w-75 shrink-0">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-xs font-bold uppercase tracking-widest text-accent mb-3"
            >
              Depoimentos
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-7xl font-black text-accent/20 leading-none select-none mb-2"
            >
              &ldquo;
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-5"
            >
              O que nossos clientes dizem.
            </motion.h2>

            {/* Rating badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 bg-background border border-border rounded-full px-4 py-2 mb-8"
            >
              <Stars />
              <span className="text-sm font-black text-foreground">4.9</span>
              <span className="text-border text-sm">·</span>
              <span className="text-xs text-muted-foreground">500+ avaliações</span>
            </motion.div>

            {/* Navigation arrows */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex gap-2.5"
            >
              <button
                onClick={scrollPrev}
                className="size-11 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                aria-label="Anterior"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                onClick={scrollNext}
                className="size-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors"
                aria-label="Próximo"
              >
                <ArrowRight className="size-4" />
              </button>
            </motion.div>
          </div>

          {/* Right column — carousel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 flex-1"
          >
            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: true, dragFree: true }}
            >
              <CarouselContent className="-ml-4">
                {TESTIMONIALS.map((t) => (
                  <CarouselItem
                    key={t.name}
                    className="pl-4 basis-[85%] sm:basis-[55%] lg:basis-[48%]"
                  >
                    <div className="rounded-2xl bg-background border border-border p-6 flex flex-col h-full min-h-55">
                      <Stars />
                      <p className="text-sm text-muted-foreground leading-relaxed mt-4 flex-1">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
                        <div className={`size-9 rounded-full ${t.color} flex items-center justify-center text-xs font-black text-primary-foreground shrink-0`}>
                          {t.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
