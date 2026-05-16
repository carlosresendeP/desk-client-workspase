import Link from 'next/link'
import { FolderOpen, Clock, CheckCircle, UserPlus, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { MetricCard } from '@/components/dashboard/metric-card'
import { RecentProjectsTable } from '@/components/dashboard/recent-projects-table'
import { getProjects } from '@/services/project.service'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

//fomatar valor em reais (R$)
function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Componente principal
export default async function DashboardPage() {

  //buscar todos os projetos no banco de dados
  const projects = await getProjects()

  //contar projetos ativos
  const ativos = projects.filter((p) => p.status === 'em_andamento').length
  
  // Soma o valor total de todos os projetos que ainda NÃO foram entregues
  const aReceber = projects
    .filter((p) => p.status !== 'entregue')
    .reduce((acc, p) => acc + (p.totalValue ?? 0), 0)

  // Soma o valor total de todos os projetos que JÁ foram entregues
  const recebido = projects
    .filter((p) => p.status === 'entregue')
    .reduce((acc, p) => acc + (p.totalValue ?? 0), 0)

  // Pega os 5 projetos mais recentes
  const recentProjects = [...projects]
    // Ordena por data de atualização (do mais novo para o mais antigo)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    // Pega apenas os 5 primeiros resultados
    .slice(0, 5)
    // Formata os dados para exibir na tabela
    .map((p) => ({
      id:       p.id,
      title:    p.title,
      client:   p.client ?? '',
      status:   p.status,
      // Formata a data de entrega para dd/MM/yyyy ou exibe um traço se não houver data
      deadline: p.deadline
        ? format(new Date(p.deadline), 'dd/MM/yyyy', { locale: ptBR })
        : '—',
  // Se o projeto estiver entregue ou     concluído, define o progresso como 100%, senão usa o progresso salvo
      progress: p.status === 'entregue' || p.status === 'concluido' ? 100 : p.progress,
    }))

  return (
    <>
      <Header
        title="Dashboard"
        action={
          <Link href="/projetos/novo" className={buttonVariants({ size: 'sm' })}>
            <Plus className="size-3.5 mr-1.5" />
            Novo projeto
          </Link>
        }
      />

      <div className="flex gap-4 mb-8">
        <MetricCard
          label="Projetos ativos"
          value={String(ativos)}
          subtitle="em andamento"
          icon={FolderOpen}
        />
        <MetricCard
          label="A receber"
          value={formatCurrency(aReceber)}
          subtitle="valor pendente"
          icon={Clock}
          mono
        />
        <MetricCard
          label="Total recebido"
          value={formatCurrency(recebido)}
          subtitle="pagamentos confirmados"
          icon={CheckCircle}
          mono
        />
        <MetricCard
          label="Leads"
          value="0"
          subtitle="novos esta semana"
          icon={UserPlus}
        />
      </div>

      <RecentProjectsTable projects={recentProjects} />
    </>
  )
}
