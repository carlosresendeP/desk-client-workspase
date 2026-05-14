"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { profileSchema, ProfileInput } from "@/lib/validations/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";


function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function ConfiguracoesPage() {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: standardSchemaResolver(profileSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name ?? "", email: user.email ?? "" });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileInput) => {
    if (data.currentPassword && data.newPassword) {
      const { error } = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      });
      if (error) {
        toast.error(error.message || "Senha atual incorreta.");
        return;
      }
    }

    const { error } = await authClient.updateUser({ name: data.name });
    if (error) {
      toast.error(error.message || "Erro ao atualizar perfil.");
    } else {
      toast.success("Perfil atualizado com sucesso!");
      reset({ name: data.name, email: data.email, currentPassword: "", newPassword: "" });
    }
  };

  return (
    <div className="space-y-4">
      <Header title="Configurações" />

      <Card className="border-none shadow-sm ring-0">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ""} />
                <AvatarFallback className="text-2xl font-semibold">
                  {isPending ? "..." : getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground text-center max-w-[120px]">
                Avatar via Google
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nome
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="O seu nome"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : "border-input"}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled
                  className="border-input opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields((v) => !v)}
                  className="text-sm text-primary hover:underline"
                >
                  {showPasswordFields ? "Cancelar alteração de senha" : "Alterar senha"}
                </button>
              </div>

              {showPasswordFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-foreground">
                      Senha atual
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Digite a sua senha atual"
                      {...register("currentPassword")}
                      className={errors.currentPassword ? "border-destructive focus-visible:ring-0 focus-visible:ring-offset-0" : "border-input focus-visible:ring-0 focus-visible:ring-offset-0"}
                    />
                    {errors.currentPassword && (
                      <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-foreground">
                      Nova senha
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Digite a nova senha"
                      {...register("newPassword")}
                      className={errors.newPassword ? "border-destructive focus-visible:ring-0 focus-visible:ring-offset-0" : "border-input focus-visible:ring-0 focus-visible:ring-offset-0"}
                    />
                    {errors.newPassword && (
                      <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      A guardar...
                    </>
                  ) : (
                    "Guardar alterações"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
