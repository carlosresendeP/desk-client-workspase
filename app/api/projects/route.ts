import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validations/project.validations";
import { createProject, getProjects } from "@/services/project.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar projetos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = createProjectSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: parsed.error.flatten() },
                { status: 422 }
            );
        }

        const project = await createProject(parsed.data);

        return NextResponse.json({ project }, { status: 201 });


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 })
    }
}