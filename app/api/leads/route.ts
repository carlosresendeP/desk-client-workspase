import { NextRequest, NextResponse } from 'next/server'
import { createLeadSchema } from '@/lib/validations/lead.validations'
import { createLead, getLeads } from '@/services/lead.service'
import { getSessionOrUnauthorized } from '@/lib/session'

export async function GET() {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const leads = await getLeads(userId!)
    return NextResponse.json(leads)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const parsed = createLeadSchema.safeParse(await req.json())
    if (!parsed.success)
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 422 })
    const lead = await createLead(parsed.data, userId!)
    return NextResponse.json({ lead }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 })
  }
}
