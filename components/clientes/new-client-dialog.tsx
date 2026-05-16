'use client'

import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClientSchema, type CreateClientInput } from '@/lib/validations/client.validations'
import type { Client } from '@/types/client'
import {useEffect } from 'react'
import { cn } from '@/lib/utils'

interface NewClientDialogProps {
  editingClient?: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
}

export function NewClientDialog({ editingClient, open, onOpenChange, trigger }: NewClientDialogProps) {
  const router = useRouter()
  const isEditing = Boolean(editingClient)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientInput>({
    resolver: standardSchemaResolver(createClientSchema),
  })

  // Função para formatar o telefone
  function formatPhone(value: string): string {
    const d = value.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 2)  return `(${d}`
    if (d.length <= 6)  return `(${d.slice(0,2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  }


  // Se o modal estiver aberto, carrega os dados do cliente para edição.
  useEffect(() => {
    if (open) {
      reset(
        editingClient
          ? {
              name:   editingClient.name,
              email:  editingClient.email  ?? '',
              phone:  editingClient.phone  ?? '',
              sector: editingClient.sector ?? '',
              notes:  editingClient.notes  ?? '',
            }
          : { name: '', email: '', phone: '', sector: '', notes: '' },
      )
    }
  }, [open, editingClient, reset])


  //função para o criar um cliente ou atualizar um cliente
  async function onSubmit(values: CreateClientInput) {
    const url    = isEditing ? `/api/clients/${editingClient!.id}` : '/api/clients'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error(isEditing ? 'Erro ao atualizar cliente.' : 'Erro ao criar cliente.')
      return
    }

    toast.success(isEditing ? 'Cliente atualizado!' : 'Cliente criado!')
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar cliente' : 'Novo cliente'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input id="name" placeholder="Nome do cliente" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sector">Setor</Label>
            <Input id="sector" placeholder="ex: Tecnologia, Saúde..." {...register('sector')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="email@empresa.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 9 9999-9999"
                {...register('phone')}
                onChange={(e) => setValue('phone', formatPhone(e.target.value))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" placeholder="Observações..." rows={3} {...register('notes')} />
          </div>

          <div className="flex gap-2 pt-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(buttonVariants({ size: 'sm' }), 'disabled:opacity-60')}
            >
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar cliente'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
