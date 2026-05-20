import { NextRequest, NextResponse } from 'next/server'
import { updateServiceSchema } from '@/lib/validations/service.validations'
import { deleteService, getServiceById, updateService } from '@/services/service.service'
import { getSessionOrUnauthorized } from '@/lib/session'

type Params = { params: Promise<{ id: string }> }

function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const service = await getServiceById(id, userId!)
    if (!service) return err('Service not found', 404)
    return NextResponse.json({ service })
  } catch {
    return err('Internal server error', 500)
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const parsed = updateServiceSchema.safeParse(await req.json())
    if (!parsed.success) return err('Invalid data', 422)
    const service = await updateService(id, parsed.data, userId!)
    return NextResponse.json({ service })
  } catch {
    return err('Internal server error', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const service = await getServiceById(id, userId!)
    if (!service) return err('Service not found', 404)
    await deleteService(id, userId!)
    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch {
    return err('Internal server error', 500)
  }
}
