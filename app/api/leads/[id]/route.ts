import { NextRequest, NextResponse } from 'next/server'
import { updateLeadSchema } from '@/lib/validations/lead.validations'
import { deleteLead, getLeadById, updateLead } from '@/services/lead.service'
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
    const lead = await getLeadById(id, userId!)
    if (!lead) return err('Lead não encontrado', 404)
    return NextResponse.json({ lead })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const parsed = updateLeadSchema.safeParse(await req.json())
    if (!parsed.success) return err('Dados inválidos', 422)
    const lead = await updateLead(id, parsed.data, userId!)
    return NextResponse.json({ lead })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const lead = await getLeadById(id, userId!)
    if (!lead) return err('Lead não encontrado', 404)
    await deleteLead(id, userId!)
    return NextResponse.json({ message: 'Lead excluído com sucesso' })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}
