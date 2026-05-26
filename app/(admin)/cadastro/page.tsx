"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function CadastroPage() {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: standardSchemaResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    });

    if (error) {
      const msg = error.message ?? "Erro ao criar conta.";
      if (msg.toLowerCase().includes("password")) {
        setError("password", { message: "A senha deve ter pelo menos 8 caracteres" });
      } else if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("user")) {
        setError("email", { message: "Este e-mail já está em uso." });
      } else {
        setError("email", { message: msg });
      }
    } else {
      toast.success("Conta criada com sucesso!");
      router.push("/dashboard");
    }
  };



  const handleGoogle = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social(
      { provider: "google", callbackURL: "/dashboard" },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Erro ao registar com Google.");
          setGoogleLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
           Desk. Criar Conta
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Preencha os dados abaixo para criar a sua conta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={googleLoading || isSubmitting}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FcGoogle className="mr-2 h-4 w-4" />
            )}
            Registar com Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Email/Password */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="O seu nome"
                {...register("name")}
                className={
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-input"
                }
              />
              {errors.name && (
                <p className="text-xs font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@dominio.com"
                {...register("email")}
                className={
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-input"
                }
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Palavra-passe
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={
                  errors.password
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-input"
                }
              />
              {errors.password && (
                <p className="text-xs font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting || googleLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A criar conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline transition-all"
            >
              Inicie sessão aqui
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
