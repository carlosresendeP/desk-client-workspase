import { prisma } from "@/lib/prisma";
import type { CreateProjectInput } from "@/lib/validations/project.validations";
import type { Project, ProjectLink } from "@/types/project";

type PrismaProject = Awaited<ReturnType<typeof prisma.project.findUniqueOrThrow>>

function serialize(p: PrismaProject): Project {
  return {
    id:            p.id,
    title:         p.title,
    client:        p.client ?? null,
    clientId:      p.clientId ?? null,
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

export async function getProjects(userId: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { userId },
    orderBy: { position: "asc" },
  });
  return rows.map(serialize);
}

export async function getProjectById(id: string, userId: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { id, userId } });
  return row ? serialize(row) : null;
}

export async function createProject(data: CreateProjectInput, userId: string): Promise<Project> {
  const row = await prisma.project.create({
    data: {
      ...data,
      userId,
      startDate: data.startDate ? new Date(data.startDate) : null,
      deadline:  data.deadline  ? new Date(data.deadline)  : null,
      links:     data.links ?? [],
    },
  });
  return serialize(row);
}

export async function updateProject(id: string, data: import("@/lib/validations/project.validations").UpdateProjectInput, userId: string): Promise<Project> {
  const row = await prisma.project.update({
    where: { id, userId },
    data: {
      ...data,
      startDate: data.startDate !== undefined ? (data.startDate ? new Date(data.startDate) : null) : undefined,
      deadline:  data.deadline  !== undefined ? (data.deadline  ? new Date(data.deadline)  : null) : undefined,
      links:     data.links ?? undefined,
    },
  });
  return serialize(row);
}

export async function updateProjectStatus(id: string, status: Project["status"], userId: string): Promise<void> {
  await prisma.project.update({ where: { id, userId }, data: { status } });
}

export async function deleteProject(id: string, userId: string): Promise<void> {
  await prisma.project.delete({ where: { id, userId } });
}