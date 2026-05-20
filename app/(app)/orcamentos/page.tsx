'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { QuoteCard } from '@/components/quote/quote-card'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Quote, QuoteStatus } from '@/types/quote'

const statusFilters: { label: string; value: QuoteStatus | 'ALL' }[] = [
  { label: 'Todos',      value: 'ALL'      },
  { label: 'Rascunho',   value: 'DRAFT'    },
  { label: 'Aguardando', value: 'SENT'     },
  { label: 'Aprovado',   value: 'APPROVED' },
  { label: 'Recusado',   value: 'DECLINED' },
  { label: 'Expirado',   value: 'EXPIRED'  },
]

export default function OrcamentosPage() {
  const [quotes, setQuotes]       = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState<QuoteStatus | 'ALL'>('ALL')

  useEffect(() => {
    fetch('/api/quotes')
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json() as Promise<Quote[]>
      })
      .then(setQuotes)
      .catch(() => toast.error('Erro ao carregar orçamentos.'))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      quotes.filter(q => {
        const matchStatus = statusFilter === 'ALL' || q.status === statusFilter
        const matchSearch = q.clientName.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
      }),
    [quotes, search, statusFilter],
  )

  const approved = quotes.filter(q => q.status === 'APPROVED').length
  const pending  = quotes.filter(q => q.status === 'SENT').length

  return (
    <>
      <Header
        title="Orçamentos"
        action={
          <Link href="/orcamentos/novo" className={cn(buttonVariants({ size: 'sm' }))}>
            <Plus className="size-4 mr-1.5" />
            Novo orçamento
          </Link>
        }
      />

      {!isLoading && quotes.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{quotes.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Aprovados</p>
            <p className="text-2xl font-bold text-emerald-600">{approved}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Aguardando</p>
            <p className="text-2xl font-bold text-amber-600">{pending}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                statusFilter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-sm">
            {search || statusFilter !== 'ALL'
              ? 'Nenhum orçamento encontrado para este filtro.'
              : 'Nenhum orçamento ainda. Crie o primeiro.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(quote => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </>
  )
}
