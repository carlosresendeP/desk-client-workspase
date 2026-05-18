import { NextRequest, NextResponse } from 'next/server'
import { updateClientSchema } from '@/lib/validations/client.validations'
import { deleteClient, getClientById, updateClient } from '@/services/client.service'
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
    const client = await getClientById(id, userId!)
    if (!client) return err('Cliente não encontrado', 404)
    return NextResponse.json({ client })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const parsed = updateClientSchema.safeParse(await req.json())
    if (!parsed.success) return err('Dados inválidos', 422)
    const client = await updateClient(id, parsed.data, userId!)
    return NextResponse.json({ client })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const client = await getClientById(id, userId!)
    if (!client) return err('Cliente não encontrado', 404)
    await deleteClient(id, userId!)
    return NextResponse.json({ message: 'Cliente excluído com sucesso' })
  } catch {
    return err('Erro interno do servidor', 500)
  }
}
