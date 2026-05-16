import { NextRequest, NextResponse } from 'next/server'
import { apifySearchSchema } from '@/lib/validations/lead.validations'
import { createManyLeads } from '@/services/lead.service'
import type { CreateLeadInput } from '@/lib/validations/lead.validations'

interface ApifyPlace {
  title?:        string
  phone?:        string
  website?:      string
  email?:        string
  categoryName?: string
  city?:         string
  address?:      string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = apifySearchSchema.safeParse(body)

    if (!parsed.success)
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 422 },
      )

    const { city, niche, quantity } = parsed.data
    const token = process.env.APIFY_TOKEN

    if (!token)
      return NextResponse.json({ error: 'Serviço de busca não configurado' }, { status: 503 })

    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchStringsArray:        [`${niche} em ${city}`],
          maxCrawledPlacesPerSearch: quantity,
          language:                  'pt-BR',
          country:                   'BR',
        }),
        signal: AbortSignal.timeout(120_000),
      },
    )

    if (!apifyRes.ok) {
      const errBody = await apifyRes.text()
      return NextResponse.json(
        { error: 'Erro na busca Apify', detail: errBody },
        { status: 502 },
      )
    }

    const places: ApifyPlace[] = await apifyRes.json()

    const items: CreateLeadInput[] = places
      .filter((p) => p.title)
      .map((p) => ({
        name:    p.title!,
        phone:   p.phone   ?? null,
        email:   p.email   ?? null,
        website: p.website ?? null,
        niche:   p.categoryName ?? niche,
        city,
        source:  'Apify',
        status:  'novo' as const,
        notes:   p.address ?? null,
      }))

    const leads = await createManyLeads(items)
    return NextResponse.json({ leads, total: leads.length }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError')
      return NextResponse.json({ error: 'Tempo limite de busca excedido. Tente com menos resultados.' }, { status: 504 })

    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
