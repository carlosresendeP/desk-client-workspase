
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ExternalLink, Pencil } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { ProjectStatusBadge } from '@/components/projetos/project-status-badge'
import { getProjectById } from '@/services/project.service'
import { cn } from '@/lib/utils'

const PRIORITY_LABEL = { baixa: 'Baixa', media: 'Média', alta: 'Alta' }

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: string) {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

interface ProjetoPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjetoPage({ params }: ProjetoPageProps) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  const pending = (project.totalValue ?? 0) - project.receivedValue

  return (
    <>
      <Header
        title={project.title}
        action={
          <Link
            href={`/projetos/${project.id}/editar`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <Pencil className="size-3.5 mr-1.5" />
            Editar
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Info geral */}
        <Card className="col-span-2">
          <CardContent className="pt-5 px-5 pb-5 space-y-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Informações
            </h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Cliente</p>
                <p className="text-sm font-medium">{project.client || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Status</p>
                <ProjectStatusBadge status={project.status} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Prioridade</p>
                <p className="text-sm font-medium">{PRIORITY_LABEL[project.priority]}</p>
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-2">Progresso</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{project.startDate ? formatDate(project.startDate) : '—'}</span>
                <span className="font-semibold text-foreground">{project.progress}%</span>
                <span>{project.deadline ? formatDate(project.deadline) : '—'}</span>
              </div>
              <Progress value={project.progress}>
                <ProgressTrack>
                  <ProgressIndicator className="bg-status-andamento" />
                </ProgressTrack>
              </Progress>
            </div>
          </CardContent>
        </Card>

        {/* Financeiro */}
        <Card>
          <CardContent className="pt-5 px-5 pb-5 space-y-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Financeiro
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Valor total</p>
                <p className="text-lg font-semibold font-mono">
                  {project.totalValue ? formatCurrency(project.totalValue) : '—'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Recebido</p>
                <p className="text-sm font-mono text-status-concluido font-medium">
                  {formatCurrency(project.receivedValue)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Pendente</p>
                <p className={cn('text-sm font-mono font-medium', pending > 0 ? 'text-status-pausado' : 'text-muted-foreground')}>
                  {formatCurrency(pending > 0 ? pending : 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Notas */}
        <Card className="col-span-2">
          <CardContent className="pt-5 px-5 pb-5">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Notas
            </h2>
            {project.notes ? (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {project.notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Sem notas.</p>
            )}
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardContent className="pt-5 px-5 pb-5">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Links
            </h2>
            {project.links.length > 0 ? (
              <div className="flex flex-col gap-2">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors"
                  >
                    <ExternalLink className="size-3.5 flex-shrink-0 text-muted-foreground" />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem links.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
