"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Project, ProjectStatus } from "@/types/project";
import { KanbanCard } from "./kanban-card";

export interface Column {
  id: ProjectStatus;
  label: string;
}

export const STATUS_STYLES: Record<ProjectStatus, { dot: string; header: string }> = {
  backlog: { dot: "bg-zinc-400", header: "border-zinc-400/30" },
  em_andamento: { dot: "bg-blue-500", header: "border-blue-500/30" },
  pausado: { dot: "bg-amber-400", header: "border-amber-400/30" },
  concluido: { dot: "bg-emerald-500", header: "border-emerald-500/30" },
  entregue: { dot: "bg-violet-500", header: "border-violet-500/30" },
};

// Renderiza uma coluna do kanban registrada como zona de drop; lista os cards via SortableContext
export function KanbanColumn({
  column,
  projects,
}: {
  column: Column;
  projects: Project[];
}) {
  const styles = STATUS_STYLES[column.id];
  const ids = projects.map((p) => p.id);
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col min-w-[260px] w-[260px] min-h-full">
      <div className={`flex items-center gap-2 mb-3 pb-3 border-b ${styles.header}`}>
        <span className={`size-2 rounded-full shrink-0 ${styles.dot}`} />
        <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
          {column.label}
        </span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {projects.length}
        </span>
      </div>

      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[80px]">
          {projects.map((project) => (
            <KanbanCard key={project.id} project={project} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
