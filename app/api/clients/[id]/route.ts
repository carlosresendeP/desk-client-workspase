import { NextRequest, NextResponse } from 'next/server'
import { updateClientSchema } from '@/lib/validations/client.validations'
import { deleteClient, getClientById, updateClient } from '@/services/client.service'

type Params = { params: Promise<{ id: string }> }

function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const client = await getClientById(id)
    if (!client) return err('Cliente não encontrado', 404)
    return NextResponse.json({ client })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = updateClientSchema.safeParse(body)

    if (!parsed.success) return err('Dados inválidos', 422)

    const client = await updateClient(id, parsed.data)
    return NextResponse.json({ client })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const client = await getClientById(id)
    if (!client) return err('Cliente não encontrado', 404)
    await deleteClient(id)
    return NextResponse.json({ message: 'Cliente excluído com sucesso' })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}
