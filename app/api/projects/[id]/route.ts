import { NextRequest, NextResponse } from "next/server";
import { deleteProject, getProjectById, updateProject, updateProjectStatus } from "@/services/project.service";
import { updateProjectSchema } from "@/lib/validations/project.validations";
import { getSessionOrUnauthorized } from "@/lib/session";

type Params = { params: Promise<{ id: string }> }

function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const project = await getProjectById(id, userId!)
    if (!project) return err("Projeto não encontrado", 404)
    return NextResponse.json({ project })
  } catch {
    return err("Erro interno do servidor", 500)
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const parsed = updateProjectSchema.safeParse(await req.json())
    if (!parsed.success) return err("Dados inválidos", 422)
    const project = await updateProject(id, parsed.data, userId!)
    return NextResponse.json({ project })
  } catch {
    return err("Erro interno do servidor", 500)
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const { status } = await req.json()
    if (!status) return err("Status é obrigatório", 400)
    await updateProjectStatus(id, status, userId!)
    return NextResponse.json({ message: "Projeto atualizado" })
  } catch {
    return err("Erro interno do servidor", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const { id } = await params
    const project = await getProjectById(id, userId!)
    if (!project) return err("Projeto não encontrado", 404)
    await deleteProject(id, userId!)
    return NextResponse.json({ message: 'Projeto excluído com sucesso' })
  } catch {
    return err("Erro interno do servidor", 500)
  }
}
