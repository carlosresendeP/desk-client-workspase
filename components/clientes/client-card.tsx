'use client'

import { Mail, Phone, MoreVertical, FolderOpen } from 'lucide-react'
import type { Client } from '@/types/client'
import { ClientAvatar } from './client-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ClientCardProps {
  client: Client
  onEdit: (client: Client) => void
}

export function ClientCard({ client, onEdit }: ClientCardProps) {
  const router = useRouter()

  async function handleDelete() {
    const res = await fetch(`/api/clients/${client.id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Erro ao excluir cliente.')
      return
    }
    toast.success('Cliente excluído.')
    router.refresh() //recarrega a página para atualizar a lista de clientes
  }

  return (
    <article className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow flex flex-col group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <ClientAvatar name={client.name} />
          <div>
            <h3 className="font-semibold text-foreground text-[1.05rem] leading-tight">
              {client.name}
            </h3>
            {client.sector && (
              <p className="text-muted-foreground text-sm mt-0.5">{client.sector}</p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(client)}>Editar</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mb-6">
        {client.email && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Phone className="size-3.5 shrink-0" />
            <span>{client.phone}</span>
          </div>
        )}
        {!client.email && !client.phone && (
          <p className="text-muted-foreground text-sm">Sem informações de contato.</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-auto pt-2 border-t border-border">
        <FolderOpen className="size-3.5" />
        <span>{client.projectCount} {client.projectCount === 1 ? 'projeto' : 'projetos'}</span>
      </div>
    </article>
  )
}
