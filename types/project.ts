import type { CreateProjectInput } from "@/lib/validations/project.validations";

export type { CreateProjectInput };

export type ProjectStatus = "backlog" | "em_andamento" | "pausado" | "concluido" | "entregue";
export type ProjectPriority = "baixa" | "media" | "alta";

export interface ProjectLink {
  label: string;
  url:   string;
}

export interface Project {
  id:            string;
  title:         string;
  client:        string | null;
  clientId:      string | null;
  description:   string | null;
  status:        ProjectStatus;
  priority:      ProjectPriority;
  startDate:     string | null;
  deadline:      string | null;
  progress:      number;
  totalValue:    number | null;
  receivedValue: number;
  links:         ProjectLink[];
  notes:         string | null;
  position:      number;
  createdAt:     string;
  updatedAt:     string;
}
