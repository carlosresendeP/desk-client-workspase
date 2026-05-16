import { z } from 'zod'

const leadStatusValues = ['novo', 'contatado', 'qualificado', 'perdido'] as const

export const createLeadSchema = z.object({
  name:    z.string().min(1, 'Nome obrigatório').max(255),
  phone:   z.string().max(30).optional().nullable(),
  email:   z.string().email('E-mail inválido').max(255).optional().or(z.literal('')).nullable(),
  website: z.string().url('URL inválida').max(500).optional().or(z.literal('')).nullable(),
  source:  z.string().max(100).optional().nullable(),
  niche:   z.string().max(255).optional().nullable(),
  city:    z.string().max(255).optional().nullable(),
  status:  z.enum(leadStatusValues).optional(),
  notes:   z.string().max(2000).optional().nullable(),
})

export const updateLeadSchema = createLeadSchema.partial()

export const apifySearchSchema = z.object({
  city:     z.string().min(1, 'Cidade obrigatória').max(255),
  niche:    z.string().min(1, 'Nicho obrigatório').max(255),
  quantity: z.number().int().min(1).max(50),
})

export type CreateLeadInput  = z.infer<typeof createLeadSchema>
export type UpdateLeadInput  = z.infer<typeof updateLeadSchema>
export type ApifySearchInput = z.infer<typeof apifySearchSchema>
