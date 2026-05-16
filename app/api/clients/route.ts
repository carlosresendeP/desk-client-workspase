import { NextRequest, NextResponse } from 'next/server'
import { createClientSchema } from '@/lib/validations/client.validations'
import { createClient, getClients } from '@/services/client.service'

export async function GET() {
  try {
    const clients = await getClients()
    return NextResponse.json(clients)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createClientSchema.safeParse(body)

    if (!parsed.success)
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 422 },
      )

    const client = await createClient(parsed.data)
    return NextResponse.json({ client }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
