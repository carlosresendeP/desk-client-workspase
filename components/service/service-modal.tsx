'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createServiceSchema, serviceUnitValues, type CreateServiceInput } from '@/lib/validations/service.validations'
import type { Service } from '@/types/service'

const unitLabel: Record<string, string> = {
  un:      'Unidade',
  hr:      'Hora',
  m2:      'm²',
  day:     'Dia',
  project: 'Projeto',
  visit:   'Visita',
}

interface ServiceModalProps {
  open:           boolean
  onOpenChange:   (open: boolean) => void
  editingService: Service | null
}

export function ServiceModal({ open, onOpenChange, editingService }: ServiceModalProps) {
  const router    = useRouter()
  const isEditing = Boolean(editingService)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceInput>({
    resolver: standardSchemaResolver(createServiceSchema),
    defaultValues: { unit: 'un', active: true },
  })

  useEffect(() => {
    if (open) {
      reset(
        editingService
          ? {
              name:        editingService.name,
              description: editingService.description ?? '',
              basePrice:   editingService.basePrice,
              unit:        (editingService.unit as CreateServiceInput['unit']) ?? 'un',
              active:      editingService.active,
            }
          : { name: '', description: '', basePrice: 0, unit: 'un', active: true },
      )
    }
  }, [open, editingService, reset])

  async function onSubmit(values: CreateServiceInput) {
    const url    = isEditing ? `/api/services/${editingService!.id}` : '/api/services'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error(isEditing ? 'Falha ao atualizar o serviço.' : 'Falha ao criar o serviço.')
      return
    }

    toast.success(isEditing ? 'Serviço atualizado!' : 'Serviço criado!')
    onOpenChange(false)
    router.refresh()
  } 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar serviço' : 'Novo serviço'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input id="name" placeholder="ex: Desenvolvimento de landing page" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Breve descrição do serviço" {...register('description')} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label htmlFor="basePrice">
                Preço base (R$) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('basePrice', { valueAsNumber: true })}
              />
              {errors.basePrice && <p className="text-xs text-destructive">{errors.basePrice.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5 w-36">
              <Label htmlFor="unit">Unidade</Label>
              <select
                id="unit"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('unit')}
              >
                {serviceUnitValues.map((u) => (
                  <option key={u} value={u}>
                    {unitLabel[u]}
                  </option>
                ))}
              </select>
              {errors.unit && <p className="text-xs text-destructive">{errors.unit.message}</p>}
            </div>
          </div>

          <div className="flex gap-2 pt-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar serviço'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
