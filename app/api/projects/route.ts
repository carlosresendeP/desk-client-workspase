import { createProjectSchema } from "@/lib/validations/project.validations";
import { createProject, getProjects } from "@/services/project.service";
import { NextRequest, NextResponse } from "next/server";
import { getSessionOrUnauthorized } from "@/lib/session";

export async function GET() {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const projects = await getProjects(userId!)
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: "Erro ao buscar projetos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { userId, error } = await getSessionOrUnauthorized()
  if (error) return error
  try {
    const body = await req.json()
    const parsed = createProjectSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 422 })

    const project = await createProject(parsed.data, userId!)
    return NextResponse.json({ project }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 })
  }
}