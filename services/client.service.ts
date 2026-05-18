import { prisma } from '@/lib/prisma'
import type { CreateClientInput, UpdateClientInput } from '@/lib/validations/client.validations'
import type { Client } from '@/types/client'

type PrismaClientWithCount = Awaited<ReturnType<typeof prisma.client.findUniqueOrThrow>> & {
  _count: { projects: number }
}

function serialize(c: PrismaClientWithCount): Client {
  return {
    id:           c.id,
    name:         c.name,
    email:        c.email ?? null,
    phone:        c.phone ?? null,
    sector:       c.sector ?? null,
    notes:        c.notes ?? null,
    projectCount: c._count.projects,
    createdAt:    c.createdAt.toISOString(),
    updatedAt:    c.updatedAt.toISOString(),
  }
}

const withCount = { _count: { select: { projects: true } } } as const

export async function getClients(userId: string): Promise<Client[]> {
  const rows = await prisma.client.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    include: withCount,
  })
  return rows.map(serialize)
}

export async function getClientById(id: string, userId: string): Promise<Client | null> {
  const row = await prisma.client.findUnique({ where: { id, userId }, include: withCount })
  return row ? serialize(row) : null
}

export async function createClient(data: CreateClientInput, userId: string): Promise<Client> {
  const row = await prisma.client.create({ data: { ...data, userId }, include: withCount })
  return serialize(row)
}

export async function updateClient(id: string, data: UpdateClientInput, userId: string): Promise<Client> {
  const row = await prisma.client.update({ where: { id, userId }, data, include: withCount })
  return serialize(row)
}

export async function deleteClient(id: string, userId: string): Promise<void> {
  await prisma.client.delete({ where: { id, userId } })
}
