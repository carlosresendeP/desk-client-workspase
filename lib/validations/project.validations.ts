import { z } from "zod";

const projectLinkSchema = z.object({
  label: z.string().min(1),
  url:   z.string().url(),
})

export const createProjectSchema = z.object({
  title:         z.string().min(1, "Título obrigatório").max(255),
  client:        z.string().max(255).optional().nullable(),
  description:   z.string().max(1000).optional().nullable(),
  status:        z.enum(["backlog", "em_andamento", "pausado", "concluido", "entregue"]).optional(),
  priority:      z.enum(["baixa", "media", "alta"]).optional(),
  startDate:     z.string().optional().nullable(),  // aceita date string do input
  deadline:      z.string().optional().nullable(),  // aceita date string do input
  progress:      z.number().int().min(0).max(100).optional(),
  totalValue:    z.number().min(0).optional().nullable(),
  receivedValue: z.number().min(0).optional(),
  links:         z.array(projectLinkSchema).optional(),
  notes:         z.string().max(2000).optional().nullable(),
  position:      z.number().int().min(0).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;