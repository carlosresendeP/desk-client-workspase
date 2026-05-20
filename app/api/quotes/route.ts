import { NextRequest, NextResponse } from 'next/server'
import { createQuoteSchema } from '@/lib/validations/quote.validations'
import { createQuote, getQuotes } from '@/services/quote.service'
import { getSessionOrUnauthorized } from '@/lib/session'

export async function GET() {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const quotes = await getQuotes(userId!)
    return NextResponse.json(quotes)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar orçamentos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const parsed = createQuoteSchema.safeParse(await req.json())
    if (!parsed.success)
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 422 })
    const quote = await createQuote(parsed.data, userId!)
    return NextResponse.json({ quote }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar orçamento' }, { status: 500 })
  }
}
