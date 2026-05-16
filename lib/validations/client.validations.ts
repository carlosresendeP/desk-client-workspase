import { z } from 'zod'

export const createClientSchema = z.object({
  name:   z.string().min(1, 'Nome obrigatório').max(255),
  email:  z.string().email({ message: 'E-mail inválido' }).max(255).optional().nullable(),
  sector: z.string().max(255).optional().nullable(),
  notes:  z.string().max(2000).optional().nullable(),
  phone:  z.string().max(20).optional().nullable(),
})

export const updateClientSchema = createClientSchema.partial()

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
