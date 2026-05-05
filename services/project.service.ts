import { prisma } from "@/lib/prisma";
import type { CreateProjectInput } from "@/lib/validations/project.validations";
import type { Project, ProjectLink } from "@/types/project";

type PrismaProject = Awaited<ReturnType<typeof prisma.project.findUniqueOrThrow>>

function serialize(p: PrismaProject): Project {
  return {
    id:            p.id,
    title:         p.title,
    client:        p.client ?? null,
    description:   p.description ?? null,
    status:        p.status as Project["status"],
    priority:      p.priority as Project["priority"],
    startDate:     p.startDate?.toISOString() ?? null,
    deadline:      p.deadline?.toISOString() ?? null,
    progress:      p.progress,
    totalValue:    p.totalValue ?? null,
    receivedValue: p.receivedValue,
    links:         (p.links as unknown as ProjectLink[]) ?? [],
    notes:         p.notes ?? null,
    position:      p.position,
    createdAt:     p.createdAt.toISOString(),
    updatedAt:     p.updatedAt.toISOString(),
  }
}

// ─── Listar todos ────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({ orderBy: { position: "asc" } });
  return rows.map(serialize);
}

// ─── Buscar por id ───────────────────────────────────────────────────────────

export async function getProjectById(id: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { id } });
  return row ? serialize(row) : null;
}

// ─── Criar ───────────────────────────────────────────────────────────────────

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const row = await prisma.project.create({ data });
  return serialize(row);
}

// ─── Atualizar ───────────────────────────────────────────────────────────────


// ─── Atualizar status ────────────────────────────────────────────────────────
export async function updateProjectStatus(id: string, status: Project["status"]): Promise<void> {
  await prisma.project.update({ where: { id }, data: { status } });
}

// ─── Deletar ─────────────────────────────────────────────────────────────────
export async function deleteProject(id: string): Promise<void> {
  await prisma.project.delete({ where: { id } });
}