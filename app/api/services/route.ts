import { NextRequest, NextResponse } from 'next/server'
import { createServiceSchema } from '@/lib/validations/service.validations'
import { createService, getServices } from '@/services/service.service'
import { getSessionOrUnauthorized } from '@/lib/session'

export async function GET() {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const services = await getServices(userId!)
    return NextResponse.json(services)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const parsed = createServiceSchema.safeParse(await req.json())
    if (!parsed.success)
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 422 })
    const service = await createService(parsed.data, userId!)
    return NextResponse.json({ service }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
