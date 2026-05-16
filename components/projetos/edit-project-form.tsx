'use client'

import { useForm, Controller } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { buttonVariants } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ProjectLinksField } from './project-links-field'
import { cn } from '@/lib/utils'
import { createProjectSchema } from '@/lib/validations/project.validations'
import { toast } from 'sonner'
import type { Project } from '@/types/project'

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

interface EditProjectFormProps {
  project: Project
}

export function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: standardSchemaResolver(createProjectSchema),
    defaultValues: {
      title:         project.title,
      client:        project.client ?? '',
      description:   project.description ?? '',
      status:        project.status,
      priority:      project.priority,
      startDate:     project.startDate ? project.startDate.slice(0, 10) : '',
      deadline:      project.deadline  ? project.deadline.slice(0, 10)  : '',
      progress:      project.progress,
      totalValue:    project.totalValue ?? undefined,
      receivedValue: project.receivedValue,
      notes:         project.notes ?? '',
      links:         project.links ?? [],
    },
  })

  async function onSubmit(values: object) {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error('Erro ao atualizar projeto. Tente novamente.')
      return
    }

    toast.success('Projeto atualizado com sucesso!')
    router.push(`/projetos/${project.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">

        {/* Título */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
          <Input id="title" placeholder="Nome do projeto" {...register('title')} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Cliente */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="client">Cliente</Label>
          <Input id="client" placeholder="Nome do cliente" {...register('client')} />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <Controller control={control} name="status" render={({ field }) => (
            <Select value={field.value} onValueChange={(val) => val && field.onChange(val)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
        </div>

        {/* Prioridade */}
        <div className="flex flex-col gap-1.5">
          <Label>Prioridade</Label>
          <Controller control={control} name="priority" render={({ field }) => (
            <Select value={field.value} onValueChange={(val) => val && field.onChange(val)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
        </div>

        {/* Progresso */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="progress">Progresso (%)</Label>
          <Input id="progress" type="number" min={0} max={100}
            {...register('progress', { valueAsNumber: true })} />
        </div>

        {/* Valor total */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="totalValue">Valor total (R$)</Label>
          <Input id="totalValue" type="number" min={0} step={0.01} placeholder="0,00"
            {...register('totalValue', { valueAsNumber: true })} />
        </div>

        {/* Valor recebido */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="receivedValue">Valor recebido (R$)</Label>
          <Input id="receivedValue" type="number" min={0} step={0.01} placeholder="0,00"
            {...register('receivedValue', { valueAsNumber: true })} />
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
          <Textarea id="notes" placeholder="Observações sobre o projeto..." rows={3} {...register('notes')} />
        </div>

        {/* Links */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label>Links</Label>
          <ProjectLinksField control={control} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button type="submit" disabled={isSubmitting}
          className={cn(buttonVariants({ size: 'sm' }), 'disabled:opacity-60')}>
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <Link href={`/projetos/${project.id}`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          Cancelar
        </Link>
      </div>
    </form>
  )
}
