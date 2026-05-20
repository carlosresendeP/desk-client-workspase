import { NextRequest, NextResponse } from 'next/server'
import { declineQuote, getQuoteBySlug } from '@/services/quote.service'

type Params = { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const existing = await getQuoteBySlug(slug)
    if (!existing) return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    if (existing.status !== 'SENT')
      return NextResponse.json({ error: 'Este orçamento não pode ser recusado' }, { status: 422 })

    const body  = await req.json().catch(() => ({}))
    const quote = await declineQuote(slug, body.message || undefined)
    return NextResponse.json({ quote })
  } catch {
    return NextResponse.json({ error: 'Erro ao recusar orçamento' }, { status: 500 })
  }
}
