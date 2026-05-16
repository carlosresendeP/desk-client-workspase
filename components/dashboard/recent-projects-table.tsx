import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ProjectStatus = 'backlog' | 'em_andamento' | 'pausado' | 'concluido' | 'entregue'

interface RecentProject {
  id: string
  title: string
  client: string
  status: ProjectStatus
  deadline: string
  progress: number
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-status-backlog' },
  em_andamento: { label: 'Em andamento', color: 'bg-status-andamento' },
  pausado: { label: 'Pausado', color: 'bg-status-pausado' },
  concluido: { label: 'Concluído', color: 'bg-status-concluido' },
  entregue: { label: 'Entregue', color: 'bg-status-entregue' },
}

const PROGRESS_COLOR: Record<ProjectStatus, string> = {
  backlog: 'bg-status-backlog',
  em_andamento: 'bg-status-andamento',
  pausado: 'bg-status-pausado',
  concluido: 'bg-status-concluido',
  entregue: 'bg-status-entregue',
}

interface RecentProjectsTableProps {
  projects: RecentProject[]
}

export function RecentProjectsTable({ projects }: RecentProjectsTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Projetos recentes</h2>
        <Link href="/projetos" className="text-xs text-accent hover:underline font-medium">
          Ver todos
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9 pl-4">
                Projeto
              </TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9">
                Cliente
              </TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9 text-right pr-4">
                Prazo / Progresso
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-10">
                  Nenhum projeto ainda
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => {
                const status = STATUS_CONFIG[project.status]
                return (
                  <TableRow key={project.id} className="border-border">
                    <TableCell className="py-3 pl-4 text-sm font-medium text-foreground">
                      <Link href={`/projetos/${project.id}`} className="hover:underline">
                        {project.title}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground">
                      {project.client || '—'}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="flex items-center gap-1.5 text-sm text-foreground">
                        <span className={`size-1.5 rounded-full shrink-0 ${status.color}`} />
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 pr-4">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          {project.deadline}
                        </span>
                        <div className="w-20 h-0.5 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${PROGRESS_COLOR[project.status]}`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
