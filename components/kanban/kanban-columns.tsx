"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock, DollarSign } from "lucide-react";
import type { Project, ProjectStatus } from "@/types/project";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Column {
  id: ProjectStatus;
  label: string;
}

// ─── Configuração das colunas ────────────────────────────────────────────────

const COLUMNS: Column[] = [
  { id: "backlog", label: "Backlog" },
  { id: "em_andamento", label: "Em andamento" },
  { id: "pausado", label: "Pausado" },
  { id: "concluido", label: "Concluído" },
  { id: "entregue", label: "Entregue" },
];

const STATUS_STYLES: Record<ProjectStatus, { dot: string; header: string }> = {
  backlog: { dot: "bg-zinc-400", header: "border-zinc-400/30" },
  em_andamento: { dot: "bg-blue-500", header: "border-blue-500/30" },
  pausado: { dot: "bg-amber-400", header: "border-amber-400/30" },
  concluido: { dot: "bg-emerald-500", header: "border-emerald-500/30" },
  entregue: { dot: "bg-violet-500", header: "border-violet-500/30" },
};

// ─── Card arrastável ─────────────────────────────────────────────────────────

function KanbanCard({
  project,
  overlay = false,
}: {
  project: Project;
  overlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
        overlay
          ? "shadow-lg ring-1 ring-primary/20 rotate-1"
          : "hover:shadow-md"
      }`}
    >
      {/* Header do card */}
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

      {/* Cliente */}
      {project.client && (
        <p className="text-xs text-muted-foreground mb-3 truncate">
          {project.client}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Prazo */}
        {project.deadline && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Clock className="size-3" />
            {new Date(project.deadline).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
        )}

        {/* Valor */}
        {project.totalValue > 0 && (
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

      {/* Barra de progresso */}
      <div className="mt-2 h-0.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── Coluna ───────────────────────────────────────────────────────────────────

function KanbanColumn({
  column,
  projects,
}: {
  column: Column;
  projects: Project[];
}) {
  const styles = STATUS_STYLES[column.id];
  const ids = projects.map((p) => p.id);

  // registra a coluna como zona de drop
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
       <div className="flex flex-col min-w-[260px] w-[260px] min-h-full">
      {/* Header */}
      <div className={`flex items-center gap-2 mb-3 pb-3 border-b ${styles.header}`}>
        <span className={`size-2 rounded-full shrink-0 ${styles.dot}`} />
        <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
          {column.label}
        </span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {projects.length}
        </span>
      </div>

      {/* Cards -- ref aqui para a área de drop ser a lista de cards */}
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

// ─── KanbanColumns (componente principal) ────────────────────────────────────

export default function KanbanColumns() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // configura o sensor de drag com threshold de 5px para não conflitar com cliques
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // evita acionar ao clicar
    }),
  );

  // Agrupa projetos por status
  function getByStatus(status: ProjectStatus) {
    return projects.filter((p) => p.status === status);
  }

  //devolve o status ao project
  function findStatus(id: string): ProjectStatus | null {
    const project = projects.find((p) => p.id === id);
    return project?.status ?? null;
  }

  // ── Drag start ──────────────────────────────────────────────────────────────
  function handleDragStart({ active }: DragStartEvent) {
    const project = projects.find((p) => p.id === active.id);
    setActiveProject(project ?? null);
  }

  // ── Drag over: muda coluna em tempo real ────────────────────────────────────
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeStatus = findStatus(activeId);

    // over pode ser um card ou uma coluna (id de coluna = ProjectStatus)
    const overStatus =
      findStatus(overId) ?? COLUMNS.find((c) => c.id === overId)?.id ?? null;

    if (!activeStatus || !overStatus || activeStatus === overStatus) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeId ? { ...p, status: overStatus as ProjectStatus } : p,
      ),
    );
  }

  // ── Drag end: reordena dentro da coluna ─────────────────────────────────────
  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveProject(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    setProjects((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === activeId);
      const newIndex = prev.findIndex((p) => p.id === overId);
      if (newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  // colisão customizada: tenta pointerWithin primeiro, cai em rectIntersection
  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    return rectIntersection(args);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto px-3 py-2 h-full">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            projects={getByStatus(column.id)}
          />
        ))}
      </div>

      {/* Card fantasma que segue o cursor durante o drag */}
      <DragOverlay>
        {activeProject && <KanbanCard project={activeProject} overlay />}
      </DragOverlay>
    </DndContext>
  );
}
