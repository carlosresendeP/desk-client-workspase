'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import type { Lead } from '@/types/lead'
import type { LeadStatus } from '@/types/lead'
import { LeadStatusBadge } from './lead-status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'novo',        label: 'Novo'        },
  { value: 'contatado',   label: 'Contatado'   },
  { value: 'qualificado', label: 'Qualificado' },
  { value: 'perdido',     label: 'Perdido'     },
]

interface LeadTableProps {
  leads: Lead[]
}

export function LeadTable({ leads }: LeadTableProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-border rounded-lg bg-card text-center">
        <p className="text-sm font-medium text-foreground mb-1">Nenhum lead encontrado</p>
        <p className="text-xs text-muted-foreground">Use Novo lead para buscar ou adicionar manualmente.</p>
      </div>
    )
  }

  async function handleStatusChange(id: string, status: LeadStatus) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      toast.error('Erro ao atualizar status.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Erro ao excluir lead.')
      return
    }
    toast.success('Lead excluído.')
    router.refresh()
  }

  async function handleConvert(lead: Lead) {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:  lead.name,
        email: lead.email ?? undefined,
        phone: lead.phone ?? undefined,
        notes: lead.notes ?? undefined,
      }),
    })
    if (!res.ok) {
      toast.error('Erro ao converter lead em cliente.')
      return
    }
    toast.success(`${lead.name} convertido em cliente!`)
    router.refresh()
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border ">
            {['Nome', 'Origem', 'Telefone', 'E-mail', 'Status', 'Criado em', ''].map((h) => (
              <TableHead
                key={h}
                className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground h-9 first:pl-4 last:pr-4"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="border-border">
              <TableCell className="py-3 pl-4 text-sm font-medium text-foreground">
                <div>
                  <p>{lead.name}</p>
                  {lead.city && (
                    <p className="text-xs text-muted-foreground">{lead.city}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-3 text-sm text-muted-foreground">
                {lead.source ?? '—'}
              </TableCell>
              <TableCell className="py-3 text-sm font-mono text-muted-foreground">
                {lead.phone ?? '—'}
              </TableCell>
              <TableCell className="py-3 text-sm text-muted-foreground">
                {lead.email ?? '—'}
              </TableCell>
              <TableCell className="py-3">
                <Select
                  value={lead.status}
                  onValueChange={(val) => handleStatusChange(lead.id, val as LeadStatus)}
                  disabled={updatingId === lead.id}
                >
                  <SelectTrigger className="h-7 w-auto border-none bg-transparent p-0 shadow-none [&>svg]:hidden focus:ring-0">
                    <SelectValue>
                      <LeadStatusBadge status={lead.status} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <LeadStatusBadge status={opt.value} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-3 text-sm font-mono text-muted-foreground">
                {format(new Date(lead.createdAt), "dd MMM, yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="py-3 pr-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors">
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {lead.website && (
                      <>
                        <DropdownMenuItem
                          onClick={() => window.open(lead.website!, '_blank', 'noopener,noreferrer')}
                        >
                          Visitar site
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => handleConvert(lead)}>
                      Converter em cliente
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleDelete(lead.id)}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
