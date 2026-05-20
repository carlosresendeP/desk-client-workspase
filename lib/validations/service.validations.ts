import { z } from 'zod'

export const serviceUnitValues = ['un', 'hr', 'm2', 'day', 'project', 'visit'] as const

export const createServiceSchema = z.object({
  name:        z.string().min(1, 'Nome é obrigatório').max(255),
  description: z.string().max(1000).optional().nullable(),
  basePrice:   z.number().min(0, 'Preço deve ser 0 ou maior'),
  unit:        z.enum(serviceUnitValues),
  active:      z.boolean(),
})

export const updateServiceSchema = createServiceSchema.partial()

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
