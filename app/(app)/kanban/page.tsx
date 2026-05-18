import { Suspense } from "react";
import KanbanFilters from "@/components/kanban/kanban-kanban-filters";
import KanbanColumns from "@/components/kanban/kanban-columns";
import { getProjects } from "@/services/project.service";
import { Header } from "@/components/layout/header";
import { getUserId } from "@/lib/session";

export default async function KanbanPage() {
  const userId = await getUserId()
  const projects = await getProjects(userId ?? '');

  return (
    <>
      <div>
        <Header title="Kanban" />
        <Suspense>
        </Suspense>
        <KanbanColumns initialProjects={projects} />
      </div>
    </>
  );
}
