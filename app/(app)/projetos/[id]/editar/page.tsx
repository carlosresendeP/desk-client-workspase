import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { getProjectById } from '@/services/project.service'
import { EditProjectForm } from '@/components/projetos/edit-project-form'

interface EditarProjetoPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarProjetoPage({ params }: EditarProjetoPageProps) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  return (
    <div className="space-y-6">
      <Header title={`Editar: ${project.title}`} />
      <EditProjectForm project={project} />
    </div>
  )
}
