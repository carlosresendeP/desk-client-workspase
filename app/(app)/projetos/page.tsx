import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { ProjectFilters } from '@/components/projetos/project-filters'
import { ProjectListTable } from '@/components/projetos/project-list-table'
import { getProjects } from '@/services/project.service'
import type { ProjectStatus } from '@/types/project'

interface ProjetosPageProps {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function ProjetosPage({ searchParams }: ProjetosPageProps) {
  const { q, status } = await searchParams

  const projects = await getProjects()

  const filtered = projects.filter((p) => {
    const matchSearch = q ? p.title.toLowerCase().includes(q.toLowerCase()) : true
    const matchStatus = status ? p.status === (status as ProjectStatus) : true
    return matchSearch && matchStatus
  })

  return (
    <>
      <Header
        title="Projetos"
        action={
          <Link href="/projetos/novo" className={buttonVariants({ size: 'sm' })}>
            <Plus className="size-3.5 mr-1.5" />
            Novo projeto
          </Link>
        }
      />
      <Suspense>
        <ProjectFilters />
      </Suspense>
      <ProjectListTable projects={filtered} />
    </>
  )
}