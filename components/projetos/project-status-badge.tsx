import type { ProjectStatus } from '@/types/project'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; dot: string }> = {
  backlog: { label: 'Backlog', dot: 'bg-status-backlog' },
  em_andamento: { label: 'Em andamento', dot: 'bg-status-andamento' },
  pausado: { label: 'Pausado', dot: 'bg-status-pausado' },
  concluido: { label: 'Concluído', dot: 'bg-status-concluido' },
  entregue: { label: 'Entregue', dot: 'bg-status-entregue' },
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const { label, dot } = STATUS_CONFIG[status]
  return (
    <span className={cn('flex items-center gap-1.5 text-sm text-foreground', className)}>
      <span className={cn('size-1.5 rounded-full shrink-0', dot)} />
      {label}
    </span>
  )
}

export { STATUS_CONFIG }
