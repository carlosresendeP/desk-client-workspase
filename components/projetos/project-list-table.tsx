"use client";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Project } from "@/types/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectStatusBadge } from "./project-status-badge";
import { Button } from "../ui/button";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDeadline(date: string) {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}

interface ProjectListTableProps {
  projects: Project[];
}

export function ProjectListTable({ projects }: ProjectListTableProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-lg bg-card">
        <p className="text-sm font-medium text-foreground mb-1">
          Nenhum projeto encontrado
        </p>
        <p className="text-xs text-muted-foreground">
          Crie seu primeiro projeto para começar.
        </p>
      </div>
    );
  }

  async function handleConfirmDelete() {
    if (!selectedProjectId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${selectedProjectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir projeto");
      }

      toast.success("Projeto excluído com sucesso!");
      setSelectedProjectId(null);
      router.refresh();
    } catch (error) {
      toast.error("Erro ao excluir projeto. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {selectedProjectId && (
        <div className="bg-background shadow-2xl shadow-foreground absolute max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-40 z-10 p-3 flex flex-col items-center justify-center gap-3 rounded-lg border border-border">
          <p>Voce deseja excluir esse projeto definitivamente?</p>
          <div className="flex w-full items-center justify-center gap-2">
            <Button
              className="bg-foreground text-secondary hover:bg-destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
            <Button
              className="bg-foreground text-secondary hover:bg-destructive"
              onClick={() => setSelectedProjectId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9 pl-4">
                Projeto
              </TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9">
                Cliente
              </TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9">
                Prazo / Progresso
              </TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9 text-right pr-4">
                Valor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="border-border">
                <TableCell className="py-3 pl-4 text-sm font-medium text-foreground">
                  <Link
                    href={`/projetos/${project.id}`}
                    className="hover:underline"
                  >
                    {project.title}
                  </Link>
                </TableCell>
                <TableCell className="py-3 text-sm text-muted-foreground">
                  {project.client || "—"}
                </TableCell>
                <TableCell className="py-3">
                  <ProjectStatusBadge status={project.status} />
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      {project.deadline
                        ? formatDeadline(project.deadline)
                        : "—"}
                    </span>
                    <div className="w-24 h-0.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 pr-4 text-right">
                  <span className="text-sm font-mono text-foreground">
                    {project.totalValue
                      ? formatCurrency(project.totalValue)
                      : "—"}
                  </span>
                </TableCell>
                <TableCell className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:bg-destructive/20"
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <MdDelete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
