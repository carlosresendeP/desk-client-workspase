import { NextRequest, NextResponse } from 'next/server'
import { createLeadSchema } from '@/lib/validations/lead.validations'
import { createLead, getLeads } from '@/services/lead.service'

export async function GET() {
  try {
    const leads = await getLeads()
    return NextResponse.json(leads)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createLeadSchema.safeParse(body)

    if (!parsed.success)
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 422 },
      )

    const lead = await createLead(parsed.data)
    return NextResponse.json({ lead }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 })
  }
}
