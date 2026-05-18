import { Header } from '@/components/layout/header'
import { ProjectForm } from '@/components/projetos/project-form'
import { getClients } from '@/services/client.service'
import { getUserId } from '@/lib/session'

export default async function NovoProjetoPage() {
  const userId = await getUserId()
  const clients = await getClients(userId ?? '')

  return (
    <>
      <Header title="Novo projeto" />
      <div className="max-w-2xl">
        <ProjectForm clients={clients} />
      </div>
    </>
  )
}