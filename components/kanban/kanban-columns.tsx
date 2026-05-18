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
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Project, ProjectStatus } from "@/types/project";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn, type Column } from "./kanban-column";

const COLUMNS: Column[] = [
  { id: "backlog", label: "Backlog" },
  { id: "em_andamento", label: "Em andamento" },
  { id: "pausado", label: "Pausado" },
  { id: "concluido", label: "Concluído" },
  { id: "entregue", label: "Entregue" },
];

interface KanbanColumnsProps {
  initialProjects: Project[];
}

export default function KanbanColumns({ initialProjects }: KanbanColumnsProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [dragStartStatus, setDragStartStatus] = useState<ProjectStatus | null>(null);

  // Usa sensores do DndKit para detectar eventos de drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // Retorna os projetos que pertencem ao status/coluna informado
  function getByStatus(status: ProjectStatus) {
    return projects.filter((p) => p.status === status);
  }

  // Retorna o status atual de um projeto pelo seu id
  function findStatus(id: string): ProjectStatus | null {
    return projects.find((p) => p.id === id)?.status ?? null;
  }

  // Guarda o projeto ativo e seu status original ao iniciar o arrastar
  function handleDragStart({ active }: DragStartEvent) {
    const project = projects.find((p) => p.id === active.id);
    setActiveProject(project ?? null);
    setDragStartStatus(project?.status ?? null);
  }

  // Muda o status do card em tempo real ao passar sobre outra coluna
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Encontra o status do card ativo e da coluna onde ele está sendo arrastado
    const activeStatus = findStatus(activeId);
    const overStatus =
      findStatus(overId) ?? COLUMNS.find((c) => c.id === overId)?.id ?? null;

    if (!activeStatus || !overStatus || activeStatus === overStatus) return;

    // Atualiza o status do card
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeId ? { ...p, status: overStatus as ProjectStatus } : p,
      ),
    );
  }

  // Persiste a mudança de status via API e reordena os cards dentro da coluna
  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveProject(null);

    const activeId = active.id as string;
    const currentProject = projects.find((p) => p.id === activeId);

    if (currentProject && dragStartStatus && currentProject.status !== dragStartStatus) {
      fetch(`/api/projects/${activeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentProject.status }),
      });
    }
    // Limpa o status original do drag
    setDragStartStatus(null);

    if (!over) return;
    const overId = over.id as string;
    if (activeId === overId) return;
    
    // Reordena os cards dentro da coluna
    setProjects((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === activeId);
      const newIndex = prev.findIndex((p) => p.id === overId);
      if (newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  // Usa pointerWithin primeiro; cai em rectIntersection se não houver colisão exata
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

      <DragOverlay>
        {activeProject && <KanbanCard project={activeProject} overlay />}
      </DragOverlay>
    </DndContext>
  );
}
