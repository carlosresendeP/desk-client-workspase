import { Suspense } from "react";
import KanbanFilters from "@/components/kanban/kanban-kanban-filters";
import KanbanColumns from "@/components/kanban/kanban-columns";
import { getProjects } from "@/services/project.service";

export default async function KanbanPage() {
  const projects = await getProjects();

  return (
    <>
      <div>
        <Suspense>
          <KanbanFilters />
        </Suspense>
        <KanbanColumns initialProjects={projects} />
      </div>
    </>
  );
}
