import { NextRequest, NextResponse } from 'next/server'
import { updateQuoteSchema } from '@/lib/validations/quote.validations'
import { deleteQuote, getQuoteById, updateQuote } from '@/services/quote.service'
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
    const quote = await getQuoteById(id, userId!)
    if (!quote) return err('Orçamento não encontrado', 404)
    return NextResponse.json({ quote })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const parsed = updateQuoteSchema.safeParse(await req.json())
    if (!parsed.success) return err('Dados inválidos', 422)
    const quote = await updateQuote(id, parsed.data, userId!)
    return NextResponse.json({ quote })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const quote = await getQuoteById(id, userId!)
    if (!quote) return err('Orçamento não encontrado', 404)
    await deleteQuote(id, userId!)
    return NextResponse.json({ message: 'Orçamento excluído com sucesso' })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}
