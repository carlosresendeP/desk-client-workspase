import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import type { CreateQuoteInput, UpdateQuoteInput } from '@/lib/validations/quote.validations'
import type { Quote, QuoteItem, QuoteStatus } from '@/types/quote'

type PrismaQuote = Awaited<ReturnType<typeof prisma.quote.findUniqueOrThrow>>

function serialize(q: PrismaQuote): Quote {
  return {
    id:             q.id,
    slug:           q.slug,
    userId:         q.userId,
    clientId:       q.clientId       ?? null,
    projectId:      q.projectId      ?? null,
    clientName:     q.clientName,
    clientEmail:    q.clientEmail    ?? null,
    clientWhatsapp: q.clientWhatsapp ?? null,
    items:          q.items          as unknown as QuoteItem[],
    notes:          q.notes          ?? null,
    validUntil:     q.validUntil?.toISOString()  ?? null,
    status:         q.status         as QuoteStatus,
    clientMessage:  q.clientMessage  ?? null,
    views:          q.views,
    approvedAt:     q.approvedAt?.toISOString()  ?? null,
    declinedAt:     q.declinedAt?.toISOString()  ?? null,
    createdAt:      q.createdAt.toISOString(),
    updatedAt:      q.updatedAt.toISOString(),
  }
}

export async function getQuotes(userId: string): Promise<Quote[]> {
  const rows = await prisma.quote.findMany({
    where:   { userId },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(serialize)
}

export async function getQuoteById(id: string, userId: string): Promise<Quote | null> {
  const row = await prisma.quote.findUnique({ where: { id, userId } })
  return row ? serialize(row) : null
}

export async function getQuoteBySlug(slug: string): Promise<Quote | null> {
  const row = await prisma.quote.findUnique({ where: { slug } })
  return row ? serialize(row) : null
}

export async function createQuote(data: CreateQuoteInput, userId: string): Promise<Quote> {
  const row = await prisma.quote.create({
    data: {
      slug:           nanoid(8),
      userId,
      clientId:       data.clientId       ?? null,
      clientName:     data.clientName,
      clientEmail:    data.clientEmail    ?? null,
      clientWhatsapp: data.clientWhatsapp ?? null,
      items:          data.items as object[],
      notes:          data.notes          ?? null,
      validUntil:     data.validUntil ? new Date(data.validUntil) : null,
      status:         data.status,
    },
  })
  return serialize(row)
}

export async function updateQuote(id: string, data: UpdateQuoteInput, userId: string): Promise<Quote> {
  const row = await prisma.quote.update({
    where: { id, userId },
    data: {
      ...data,
      items:     data.items     ? (data.items as object[]) : undefined,
      validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
    },
  })
  return serialize(row)
}

export async function deleteQuote(id: string, userId: string): Promise<void> {
  await prisma.quote.delete({ where: { id, userId } })
}

export async function incrementQuoteViews(slug: string): Promise<void> {
  await prisma.quote.update({
    where: { slug },
    data:  { views: { increment: 1 } },
  })
}

export type PublicQuoteData = Quote & {
  prestador: { name: string; occupation: string | null; whatsapp: string | null }
}

export async function getPublicQuote(slug: string): Promise<PublicQuoteData | null> {
  const row = await prisma.quote.findUnique({
    where:   { slug },
    include: { user: { select: { name: true, occupation: true, whatsapp: true } } },
  })
  if (!row) return null
  return {
    ...serialize(row),
    prestador: {
      name:       row.user.name,
      occupation: row.user.occupation ?? null,
      whatsapp:   row.user.whatsapp   ?? null,
    },
  }
}

export async function approveQuote(slug: string, message?: string): Promise<Quote> {
  const row = await prisma.quote.update({
    where: { slug },
    data:  { status: 'APPROVED', approvedAt: new Date(), clientMessage: message ?? null },
  })
  return serialize(row)
}

export async function declineQuote(slug: string, message?: string): Promise<Quote> {
  const row = await prisma.quote.update({
    where: { slug },
    data:  { status: 'DECLINED', declinedAt: new Date(), clientMessage: message ?? null },
  })
  return serialize(row)
}
