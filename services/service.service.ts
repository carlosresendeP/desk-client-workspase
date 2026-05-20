import { prisma } from '@/lib/prisma'
import type { CreateServiceInput, UpdateServiceInput } from '@/lib/validations/service.validations'
import type { Service } from '@/types/service'

type PrismaService = Awaited<ReturnType<typeof prisma.service.findUniqueOrThrow>>

function serialize(s: PrismaService): Service {
  return {
    id:          s.id,
    userId:      s.userId,
    name:        s.name,
    description: s.description ?? null,
    basePrice:   s.basePrice,
    unit:        s.unit,
    active:      s.active,
    createdAt:   s.createdAt.toISOString(),
    updatedAt:   s.updatedAt.toISOString(),
  }
}

export async function getServices(userId: string): Promise<Service[]> {
  const rows = await prisma.service.findMany({
    where:   { userId },
    orderBy: { name: 'asc' },
  })
  return rows.map(serialize)
}

export async function getServiceById(id: string, userId: string): Promise<Service | null> {
  const row = await prisma.service.findUnique({ where: { id, userId } })
  return row ? serialize(row) : null
}

export async function createService(data: CreateServiceInput, userId: string): Promise<Service> {
  const row = await prisma.service.create({ data: { ...data, userId } })
  return serialize(row)
}

export async function updateService(id: string, data: UpdateServiceInput, userId: string): Promise<Service> {
  const row = await prisma.service.update({ where: { id, userId }, data })
  return serialize(row)
}

export async function deleteService(id: string, userId: string): Promise<void> {
  await prisma.service.delete({ where: { id, userId } })
}

export async function toggleServiceActive(id: string, userId: string): Promise<Service> {
  const current = await prisma.service.findUnique({ where: { id, userId } })
  if (!current) throw new Error('Service not found')
  const row = await prisma.service.update({
    where: { id, userId },
    data:  { active: !current.active },
  })
  return serialize(row)
}
