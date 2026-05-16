import { NextRequest, NextResponse } from 'next/server'
import { updateLeadSchema } from '@/lib/validations/lead.validations'
import { deleteLead, getLeadById, updateLead } from '@/services/lead.service'

type Params = { params: Promise<{ id: string }> }

function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const lead = await getLeadById(id)
    if (!lead) return err('Lead não encontrado', 404)
    return NextResponse.json({ lead })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = updateLeadSchema.safeParse(body)

    if (!parsed.success) return err('Dados inválidos', 422)

    const lead = await updateLead(id, parsed.data)
    return NextResponse.json({ lead })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const lead = await getLeadById(id)
    if (!lead) return err('Lead não encontrado', 404)
    await deleteLead(id)
    return NextResponse.json({ message: 'Lead excluído com sucesso' })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}
