import { z } from 'zod'

export const quoteItemSchema = z.object({
  name:        z.string().min(1).max(255),
  description: z.string().max(500).optional(),
  quantity:    z.number().min(0),
  unitPrice:   z.number().min(0),
  unit:        z.string().max(50),
  total:       z.number(),
})

export const createQuoteSchema = z.object({
  clientId:       z.string().uuid().optional().nullable(),
  clientName:     z.string().min(1, 'Nome do cliente obrigatório').max(255),
  clientEmail:    z.string().email('E-mail inválido').max(255).optional().nullable(),
  clientWhatsapp: z.string().max(30).optional().nullable(),
  items:          z.array(quoteItemSchema).min(1, 'Adicione ao menos um item'),
  notes:          z.string().max(2000).optional().nullable(),
  validUntil:     z.string().optional().nullable(),
  status:         z.enum(['DRAFT', 'SENT']),
})

export const updateQuoteSchema = createQuoteSchema.partial()

export type QuoteItemInput = z.infer<typeof quoteItemSchema>
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>
