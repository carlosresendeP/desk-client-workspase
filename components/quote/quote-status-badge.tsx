import type { QuoteStatus } from '@/types/quote'

const statusConfig: Record<QuoteStatus, { label: string; bg: string; text: string; dot: string }> = {
  APPROVED: { label: 'Aprovado',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  DECLINED: { label: 'Recusado',   bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
  SENT:     { label: 'Aguardando', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  EXPIRED:  { label: 'Expirado',   bg: 'bg-gray-100',   text: 'text-gray-600',    dot: 'bg-gray-400'    },
  DRAFT:    { label: 'Rascunho',   bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.bg} ${config.text}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
