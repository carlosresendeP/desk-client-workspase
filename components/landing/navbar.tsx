"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Users, Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { label: "Produto", href: "#features" },
  { label: "Benefícios", href: "#features" },
  { label: "Como funciona", href: "#how" },
  { label: "Preços", href: "#pricing" },
  { label: "Empresa", href: "#faq" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const linkClass = scrolled
    ? "text-muted-foreground hover:text-foreground"
    : "text-primary-foreground/65 hover:text-primary-foreground"

  const logoTextClass = scrolled ? "text-foreground" : "text-primary-foreground"

  const iconBg = scrolled ? "bg-primary" : "bg-accent/20"
  const iconColor = scrolled ? "text-accent" : "text-accent"

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className={`size-8 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Users className={`size-4 ${iconColor}`} />
          </div>
          <span className={`font-black text-lg tracking-tight transition-colors ${logoTextClass}`}>
            Desk<span className="text-accent">.</span>
            <p className="text-xs font-medium text-muted-foreground">
              Clint workspace
            </p>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-200 ${linkClass}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-primary-foreground/65 hover:text-primary-foreground"
            }`}
          >
            Login
          </Link>
          <Link href="/cadastro">
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-4 flex items-center gap-1.5"
            >
              Começar grátis <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          className={`md:hidden p-2 transition-colors ${
            scrolled ? "text-foreground" : "text-primary-foreground"
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary border-t border-primary-foreground/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm font-medium text-primary-foreground/70"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-center py-2.5 text-sm font-medium text-primary-foreground/70 border border-primary-foreground/15 rounded-xl"
                >
                  Login
                </Link>
                <Link href="/cadastro" onClick={() => setOpen(false)} className="w-full">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Começar grátis
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
