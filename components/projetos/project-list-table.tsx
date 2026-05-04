import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Project } from '@/types/project'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ProjectStatusBadge } from './project-status-badge'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDeadline(date: string) {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

interface ProjectListTableProps {
  projects: Project[]
}

export function ProjectListTable({ projects }: ProjectListTableProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-lg bg-card">
        <p className="text-sm font-medium text-foreground mb-1">Nenhum projeto encontrado</p>
        <p className="text-xs text-muted-foreground">Crie seu primeiro projeto para começar.</p>
      </div>
    )
  }

  return (
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
            <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9">
              Prazo / Progresso
            </TableHead>
            <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9 text-right pr-4">
              Valor
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
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
                <ProjectStatusBadge status={project.status} />
              </TableCell>
              <TableCell className="py-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-mono">
                    {project.deadline ? formatDeadline(project.deadline) : '—'}
                  </span>
                  <div className="w-24 h-0.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3 pr-4 text-right">
                <span className="text-sm font-mono text-foreground">
                  {project.totalValue ? formatCurrency(project.totalValue) : '—'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
