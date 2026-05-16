'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Search, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Controller } from 'react-hook-form'
import { createLeadSchema, apifySearchSchema } from '@/lib/validations/lead.validations'
import type { CreateLeadInput, ApifySearchInput } from '@/lib/validations/lead.validations'
import { cn } from '@/lib/utils'

type Tab = 'apify' | 'manual'

interface NewLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SOURCE_OPTIONS = [
  'Apify',
  'Formulário Site',
  'Indicação',
  'Instagram',
  'LinkedIn',
  'Outro',
]

export function NewLeadDialog({ open, onOpenChange }: NewLeadDialogProps) {
  const [tab, setTab] = useState<Tab>('apify')
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 p-1 bg-muted rounded-md mb-4">
          <button
            type="button"
            onClick={() => setTab('apify')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded transition-colors',
              tab === 'apify'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Search className="size-3.5" />
            Busca automática
          </button>
          <button
            type="button"
            onClick={() => setTab('manual')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded transition-colors',
              tab === 'manual'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <UserPlus className="size-3.5" />
            Adicionar manual
          </button>
        </div>

        {tab === 'apify' ? (
          <ApifyForm onSuccess={() => { onOpenChange(false); router.refresh() }} />
        ) : (
          <ManualForm onSuccess={() => { onOpenChange(false); router.refresh() }} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function ApifyForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApifySearchInput>({
    resolver: standardSchemaResolver(apifySearchSchema),
    defaultValues: { quantity: 10 },
  })

  async function onSubmit(values: ApifySearchInput) {
    const res = await fetch('/api/leads/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const data = await res.json() as { total?: number; error?: string }

    if (!res.ok) {
      toast.error(data.error ?? 'Erro na busca.')
      return
    }

    toast.success(`${data.total} lead(s) importado(s) com sucesso!`)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Busca empresas no Google Maps via Apify e as importa como leads automaticamente.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="niche">
            Nicho <span className="text-destructive">*</span>
          </Label>
          <Input id="niche" placeholder="ex: Clínicas de estética" {...register('niche')} />
          {errors.niche && <p className="text-xs text-destructive">{errors.niche.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">
            Cidade <span className="text-destructive">*</span>
          </Label>
          <Input id="city" placeholder="ex: São Paulo" {...register('city')} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quantity">
          Quantidade <span className="text-muted-foreground text-xs">(máx. 50)</span>
        </Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={50}
          {...register('quantity', { valueAsNumber: true })}
        />
        {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
      </div>

      <div className="flex gap-2 pt-2 justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(buttonVariants({ size: 'sm' }), 'disabled:opacity-60 gap-2')}
        >
          <Search className="size-3.5" />
          {isSubmitting ? 'Buscando...' : 'Buscar e importar'}
        </button>
      </div>
    </form>
  )
}

function ManualForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput>({
    resolver: standardSchemaResolver(createLeadSchema),
    defaultValues: { status: 'novo', source: '' },
  })

  async function onSubmit(values: CreateLeadInput) {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error('Erro ao criar lead.')
      return
    }

    toast.success('Lead criado com sucesso!')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">
          Nome <span className="text-destructive">*</span>
        </Label>
        <Input id="name" placeholder="Nome ou empresa" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" placeholder="(11) 9 9999-9999" {...register('phone')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="email@exemplo.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Origem</Label>
          <Controller
            control={control}
            name="source"
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="niche">Nicho</Label>
          <Input id="niche" placeholder="ex: Restaurante" {...register('niche')} />
        </div>
      </div>

      <div className="flex gap-2 pt-2 justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(buttonVariants({ size: 'sm' }), 'disabled:opacity-60')}
        >
          {isSubmitting ? 'Salvando...' : 'Criar lead'}
        </button>
      </div>
    </form>
  )
}
