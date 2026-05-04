'use server'

import { redirect } from 'next/navigation'
import { createProject } from '@/services/project.service'
import { createProjectSchema } from '@/lib/validations/project.validations'

export async function createProjectAction(values: unknown) {
   console.log('values recebidos:', JSON.stringify(values, null, 2))
  const parsed = createProjectSchema.safeParse(values)

  if (!parsed.success) {
    throw new Error('Dados inválidos')
  }

  const { startDate, deadline, ...rest } = parsed.data

  await createProject({
    ...rest,
    startDate: startDate ? new Date(startDate).toISOString() : undefined,
    deadline:  deadline  ? new Date(deadline).toISOString()  : undefined,
    links:     rest.links ?? [],
  })

  redirect('/projetos/novo')
}