import { NextRequest, NextResponse } from 'next/server'
import { createClientSchema } from '@/lib/validations/client.validations'
import { createClient, getClients } from '@/services/client.service'
import { getSessionOrUnauthorized } from '@/lib/session'

export async function GET() {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const clients = await getClients(userId!)
    return NextResponse.json(clients)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const parsed = createClientSchema.safeParse(await req.json())
    if (!parsed.success)
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 422 })
    const client = await createClient(parsed.data, userId!)
    return NextResponse.json({ client }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
