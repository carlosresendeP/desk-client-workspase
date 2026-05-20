'use client'

import { MoreVertical, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Service } from '@/types/service'

const unitLabel: Record<string, string> = {
  un:      'Unidade',
  hr:      'Hora',
  m2:      'm²',
  day:     'Dia',
  project: 'Projeto',
  visit:   'Visita',
}

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

interface ServiceCardProps {
  service: Service
  onEdit:  (service: Service) => void
}

export function ServiceCard({ service, onEdit }: ServiceCardProps) {
  const router = useRouter()

  async function handleDelete() {
    const res = await fetch(`/api/services/${service.id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Falha ao excluir o serviço.')
      return
    }
    toast.success('Serviço excluído.')
    router.refresh()
  }

  async function handleToggleActive() {
    const res = await fetch(`/api/services/${service.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ active: !service.active }),
    })
    if (!res.ok) {
      toast.error('Falha ao atualizar o serviço.')
      return
    }
    toast.success(service.active ? 'Serviço desativado.' : 'Serviço ativado.')
    router.refresh()
  }

  return (
    <article className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow flex flex-col group relative">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-foreground leading-tight truncate">{service.name}</h3>
          {service.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{service.description}</p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted shrink-0">
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(service)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleActive}>
              {service.active ? 'Desativar' : 'Ativar'}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
        <span className="text-lg font-semibold text-foreground">{formatBRL(service.basePrice)}</span>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
              service.active
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span className={`size-1.5 rounded-full ${service.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            {service.active ? 'Ativo' : 'Inativo'}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            <Tag className="size-3" />
            {unitLabel[service.unit] ?? service.unit}
          </span>
        </div>
      </div>
    </article>
  )
}
