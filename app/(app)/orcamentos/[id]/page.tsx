'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Copy, Check, Eye, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { QuoteStatusBadge } from '@/components/quote/quote-status-badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Quote, QuoteItem } from '@/types/quote'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR')

export default function OrcamentoDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const router   = useRouter()
  const [quote, setQuote]       = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied]     = useState(false)

  useEffect(() => {
    fetch(`/api/quotes/${id}`)
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(data => setQuote(data.quote))
      .catch(() => toast.error('Orçamento não encontrado.'))
      .finally(() => setIsLoading(false))
  }, [id])

  async function copyLink() {
    if (!quote) return
    const url = `${window.location.origin}/orcamento/${quote.slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!confirm('Excluir este orçamento?')) return
    const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Erro ao excluir.'); return }
    toast.success('Orçamento excluído.')
    router.push('/orcamentos')
  }

  if (isLoading) {
    return (
      <>
        <Header title="Orçamento" />
        <div className="space-y-4 max-w-2xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </>
    )
  }

  if (!quote) return null

  const total = quote.items.reduce((sum, item: QuoteItem) => sum + item.total, 0)
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/orcamento/${quote.slug}`
  const canShare = quote.status !== 'DRAFT'

  return (
    <>
      <Header
        title={`Orçamento — ${quote.clientName}`}
        action={
          <Link href="/orcamentos" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
            <ArrowLeft className="size-4 mr-1.5" />
            Voltar
          </Link>
        }
      />

      <div className="max-w-2xl space-y-5">
        {/* Status + meta */}
        <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <QuoteStatusBadge status={quote.status} />
            {quote.views > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="size-3.5" />
                {quote.views} {quote.views === 1 ? 'visualização' : 'visualizações'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            Criado em {formatDate(quote.createdAt)}
          </div>
        </div>

        {/* Public link */}
        {canShare && (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Link público
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-md truncate text-foreground">
                {publicUrl}
              </code>
              <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0">
                {copied
                  ? <><Check className="size-4 mr-1.5 text-emerald-600" /> Copiado</>
                  : <><Copy className="size-4 mr-1.5" /> Copiar</>
                }
              </Button>
            </div>
          </div>
        )}

        {/* Client info */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Cliente
          </p>
          <p className="font-semibold text-foreground">{quote.clientName}</p>
          {quote.clientEmail    && <p className="text-sm text-muted-foreground">{quote.clientEmail}</p>}
          {quote.clientWhatsapp && <p className="text-sm text-muted-foreground">{quote.clientWhatsapp}</p>}
          {quote.validUntil && (
            <p className="text-sm text-muted-foreground mt-1">
              Válido até: <span className="font-medium text-foreground">{formatDate(quote.validUntil)}</span>
            </p>
          )}
        </div>

        {/* Items */}
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Item</th>
                <th className="text-center px-3 py-3 font-medium w-28">Quantidade</th>
                <th className="text-right px-4 py-3 font-medium w-28">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item: QuoteItem, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center text-muted-foreground">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatBRL(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted border-t border-border">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total</td>
                <td className="px-4 py-3 text-right font-bold text-base">{formatBRL(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Observações
            </p>
            <p className="text-sm text-foreground whitespace-pre-line">{quote.notes}</p>
          </div>
        )}

        {/* Client message */}
        {quote.clientMessage && (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Mensagem do cliente
            </p>
            <p className="text-sm text-foreground whitespace-pre-line">{quote.clientMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pb-8">
          {!canShare && (
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="size-4 mr-1.5" />
              Copiar link de rascunho
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Excluir orçamento
          </Button>
        </div>
      </div>
    </>
  )
}
