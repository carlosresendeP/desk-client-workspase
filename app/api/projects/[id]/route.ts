// app/api/projects/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/services/project.service";

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

