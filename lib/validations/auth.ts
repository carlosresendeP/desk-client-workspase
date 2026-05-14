import { z } from "zod";

// Schema para Registro
export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 6 caracteres"),
});


export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),

});

export const profileSchema = z.object({
  name: registerSchema.shape.name,
  email: registerSchema.shape.email,
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres").optional(),
}).refine(
  (d) => !(d.currentPassword && !d.newPassword) && !(!d.currentPassword && d.newPassword),
  { message: "Preencha os dois campos de senha.", path: ["currentPassword"] }
);

export type ProfileInput = z.infer<typeof profileSchema>;

export type User = z.infer<typeof userSchema>;

// Tipagem inferida automaticamente do Zod
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserOutput = z.infer<typeof userSchema>;