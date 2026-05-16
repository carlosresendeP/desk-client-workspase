"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock, DollarSign } from "lucide-react";
import type { Project } from "@/types/project";

// Renderiza um card de projeto arrastável; no estado de arrastar mostra apenas um placeholder
export function KanbanCard({
  project,
  overlay = false,
}: {
  project: Project;
  overlay?: boolean;
}) {

  // Hook do DndKit para criar itens arrastáveis
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  // Calcula o estilo de transformação e transição para o card
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Se estiver arrastando e não for um card overlay, retorna um placeholder
  if (isDragging && !overlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[108px] rounded-lg border border-dashed border-border bg-muted/30"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow ${
        overlay ? "shadow-lg ring-1 ring-primary/20 rotate-1" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
          {project.title}
        </p>
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <GripVertical className="size-3.5" />
        </button>
      </div>

      {project.client && (
        <p className="text-xs text-muted-foreground mb-3 truncate">{project.client}</p>
      )}

      <div className="flex items-center justify-between">
        {project.deadline && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Clock className="size-3" />
            {new Date(project.deadline).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
        )}

        {project.totalValue != null && project.totalValue > 0 && (
          <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground font-mono ml-auto">
            <DollarSign className="size-3" />
            {project.totalValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            })}
          </span>
        )}
      </div>

      <div className="mt-2 h-0.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </div>
  );
}
