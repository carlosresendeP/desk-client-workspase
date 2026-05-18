import { prisma } from '@/lib/prisma'
import type { CreateLeadInput, UpdateLeadInput } from '@/lib/validations/lead.validations'
import type { Lead } from '@/types/lead'

type PrismaLead = Awaited<ReturnType<typeof prisma.lead.findUniqueOrThrow>>

function serialize(l: PrismaLead): Lead {
  return {
    id:        l.id,
    name:      l.name,
    phone:     l.phone ?? null,
    email:     l.email ?? null,
    website:   l.website ?? null,
    source:    l.source ?? null,
    niche:     l.niche ?? null,
    city:      l.city ?? null,
    status:    l.status as Lead['status'],
    notes:     l.notes ?? null,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }
}

export async function getLeads(userId: string): Promise<Lead[]> {
  const rows = await prisma.lead.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(serialize)
}

export async function getLeadById(id: string, userId: string): Promise<Lead | null> {
  const row = await prisma.lead.findUnique({ where: { id, userId } })
  return row ? serialize(row) : null
}

export async function createLead(data: CreateLeadInput, userId: string): Promise<Lead> {
  const row = await prisma.lead.create({ data: { ...data, userId } })
  return serialize(row)
}

export async function createManyLeads(items: CreateLeadInput[], userId: string): Promise<Lead[]> {
  const rows = await Promise.all(items.map((data) => prisma.lead.create({ data: { ...data, userId } })))
  return rows.map(serialize)
}

export async function updateLead(id: string, data: UpdateLeadInput, userId: string): Promise<Lead> {
  const row = await prisma.lead.update({ where: { id, userId }, data })
  return serialize(row)
}

export async function deleteLead(id: string, userId: string): Promise<void> {
  await prisma.lead.delete({ where: { id, userId } })
}

export async function countNewLeadsThisWeek(userId: string): Promise<number> {
  const since = new Date()
  since.setDate(since.getDate() - 7)
  return prisma.lead.count({
    where: { userId, status: 'novo', createdAt: { gte: since } },
  })
}
