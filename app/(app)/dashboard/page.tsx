import Link from 'next/link'
import { FolderOpen, Clock, CheckCircle, UserPlus, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { MetricCard } from '@/components/dashboard/metric-card'
import { RecentProjectsTable } from '@/components/dashboard/recent-projects-table'

export default function DashboardPage() {
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
          value="0"
          subtitle="em andamento"
          icon={FolderOpen}
        />
        <MetricCard
          label="A receber este mês"
          value="R$ 0,00"
          subtitle="valor pendente"
          icon={Clock}
          mono
        />
        <MetricCard
          label="Recebido este mês"
          value="R$ 0,00"
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

      <RecentProjectsTable projects={[]} />
    </>
  )
}
