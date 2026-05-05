// app/api/projects/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { deleteProject, getProjectById, updateProjectStatus } from "@/services/project.service";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

//get
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) return errorResponse("Projeto não encontrado", 404);


    return NextResponse.json({ message: 'Projetos encontrados', project }, { status: 200 });
  } catch {
    return errorResponse("Erro interno do servidor", 500);
  }
}

//patch - atualiza status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status) return errorResponse("Status é obrigatório", 400);

    await updateProjectStatus(id, status);
    return NextResponse.json({ message: "Projeto atualizado" }, { status: 200 });
  } catch {
    return errorResponse("Erro interno do servidor", 500);
  }
}

//delete
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) return errorResponse("Projeto não encontrado", 404);

    await deleteProject(id);
    return NextResponse.json({ message: 'Projeto excluído com sucesso' }, { status: 200 });
  } catch {
    return errorResponse("Erro interno do servidor", 500);
  }
}
