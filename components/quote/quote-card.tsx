'use client'

import Link from 'next/link'
import { Calendar, User, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { QuoteStatusBadge } from './quote-status-badge'
import type { Quote, QuoteItem } from '@/types/quote'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR')

export function QuoteCard({ quote }: { quote: Quote }) {
  const router = useRouter()
  const total  = quote.items.reduce((sum, item: QuoteItem) => sum + item.total, 0)

  async function handleDelete() {
    const res = await fetch(`/api/quotes/${quote.id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Erro ao excluir orçamento.')
      return
    }
    toast.success('Orçamento excluído.')
    router.refresh()
  }

  return (
    <article className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow flex flex-col group relative">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-2">
            <User className="size-3.5 text-muted-foreground shrink-0" />
            <p className="font-semibold text-foreground truncate">{quote.clientName}</p>
          </div>
          <QuoteStatusBadge status={quote.status} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted shrink-0">
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/orcamentos/${quote.id}`)}>
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link href={`/orcamentos/${quote.id}`} className="mt-auto pt-3 border-t border-border flex items-center justify-between">
        <span className="text-lg font-bold text-foreground">{formatBRL(total)}</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3.5" />
          {formatDate(quote.createdAt)}
        </div>
      </Link>
    </article>
  )
}
