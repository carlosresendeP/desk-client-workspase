import type { LeadStatus } from '@/types/lead'

const CONFIG: Record<LeadStatus, { label: string; color: string; dot: string }> = {
  novo:        { label: 'Novo',        color: 'border-blue-200  bg-blue-50  text-blue-700',  dot: 'bg-blue-500'  },
  contatado:   { label: 'Contatado',   color: 'border-amber-200 bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  qualificado: { label: 'Qualificado', color: 'border-green-200 bg-green-50 text-green-700', dot: 'bg-green-500' },
  perdido:     { label: 'Perdido',     color: 'border-border    bg-muted    text-muted-foreground', dot: 'bg-muted-foreground' },
}

interface LeadStatusBadgeProps {
  status: LeadStatus
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const { label, color, dot } = CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
