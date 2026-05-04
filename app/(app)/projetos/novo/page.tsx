import { Header } from '@/components/layout/header'
import { ProjectForm } from '@/components/projetos/project-form'
import { createProjectAction } from './actions'

export default function NovoProjetoPage() {
  return (
    <>
      <Header title="Novo projeto" />
      <div className="max-w-2xl">
        <ProjectForm onSubmit={createProjectAction} />
      </div>
    </>
  )
}