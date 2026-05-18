'use client'

import { useForm, Controller } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectLinksField } from './project-links-field'
import { cn } from '@/lib/utils'
import { CreateProjectInput } from '@/types/project'
import { createProjectSchema } from '@/lib/validations/project.validations'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { Client } from '@/types/client'

export type ProjectFormValues = CreateProjectInput

const STATUS_OPTIONS = [
  { value: 'backlog',      label: 'Backlog' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'pausado',      label: 'Pausado' },
  { value: 'concluido',    label: 'Concluído' },
  { value: 'entregue',     label: 'Entregue' },
]

const PRIORITY_OPTIONS = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta',  label: 'Alta' },
]

interface ProjectFormProps {
  clients: Client[]
}

export function ProjectForm({ clients }: ProjectFormProps) {
  const router = useRouter()
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: standardSchemaResolver(createProjectSchema),
    defaultValues: {
      status:   'backlog',
      priority: 'media',
      links:    [],
    }
  }
)
// envia os dados para a api
async function handleFormSubmit(values: ProjectFormValues) {
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      throw new Error('Erro ao criar projeto')
    }

    toast.success('Projeto criado com sucesso!')
    router.push('/projetos')
  } catch {
    toast.error('Erro ao criar projeto. Tente novamente.')
  }
}

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">

        {/* Título */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="title">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input id="title" placeholder="Nome do projeto" {...register('title')} />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Cliente */}
        <div className="flex flex-col gap-1.5">
          <Label>Cliente</Label>
          <Controller
            control={control}
            name="client"
            render={({ field }) => (
              <Select
                value={field.value ?? 'none'}
                onValueChange={(val) => {
                  if (val === 'none') {
                    field.onChange(null)
                    setValue('client', null)
                  } else {
                    field.onChange(val)
                    setValue('client', clients.find(c => c.id === val)?.name ?? null)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem cliente</SelectItem>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(val) => val && field.onChange(val)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Prioridade */}
        <div className="flex flex-col gap-1.5">
          <Label>Prioridade</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(val) => val && field.onChange(val)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Valor total */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="totalValue">Valor total (R$)</Label>
          <Input
            id="totalValue"
            type="number"
            min={0}
            step={0.01}
            placeholder="0,00"
            {...register('totalValue', { valueAsNumber: true })}
          />
        </div>

        {/* Data início */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startDate">Data de início</Label>
          <Input id="startDate" type="date" {...register('startDate')} />
        </div>

        {/* Deadline */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deadline">Prazo</Label>
          <Input id="deadline" type="date" {...register('deadline')} />
        </div>

        {/* Notas */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            placeholder="Observações sobre o projeto..."
            rows={3}
            {...register('notes')}
          />
        </div>

        {/* Links */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label>Links</Label>
          <ProjectLinksField control={control} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(buttonVariants({ size: 'sm' }), 'disabled:opacity-60')}
        >
          {isSubmitting ? 'Criando...' : 'Criar projeto'}
        </button>
        <Link href="/projetos" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          Cancelar
        </Link>
      </div>
    </form>
  )
}