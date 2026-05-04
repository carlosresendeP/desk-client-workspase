import { Suspense } from "react";
import KanbanFilters from "@/components/kanban/kanban-kanban-filters";
import KanbanColumns from "@/components/kanban/kanban-columns";

export default function KanbanPage() {
  return (
    <>
      <div>
        <Suspense>
          <KanbanFilters />
        </Suspense>
        <Suspense>
          <KanbanColumns />
        </Suspense>
      </div>
    </>
  );
}
