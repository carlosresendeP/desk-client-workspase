import { prisma } from '@/lib/prisma'
import type { CreateClientInput, UpdateClientInput } from '@/lib/validations/client.validations'
import type { Client } from '@/types/client'

type PrismaClient_ = Awaited<ReturnType<typeof prisma.client.findUniqueOrThrow>>

function serialize(c: PrismaClient_): Client {
  return {
    id:        c.id,
    name:      c.name,
    email:     c.email ?? null,
    phone:     c.phone ?? null,
    sector:    c.sector ?? null,
    notes:     c.notes ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }
}

export async function getClients(): Promise<Client[]> {
  const rows = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  return rows.map(serialize)
}

export async function getClientById(id: string): Promise<Client | null> {
  const row = await prisma.client.findUnique({ where: { id } })
  return row ? serialize(row) : null
}

export async function createClient(data: CreateClientInput): Promise<Client> {
  const row = await prisma.client.create({ data })
  return serialize(row)
}

export async function updateClient(id: string, data: UpdateClientInput): Promise<Client> {
  const row = await prisma.client.update({ where: { id }, data })
  return serialize(row)
}

export async function deleteClient(id: string): Promise<void> {
  await prisma.client.delete({ where: { id } })
}
