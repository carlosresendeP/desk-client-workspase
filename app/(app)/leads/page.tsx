'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { LeadTable } from '@/components/leads/lead-table'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Lead, LeadStatus } from '@/types/lead'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type FilterStatus = LeadStatus | 'todos'

export default function LeadsPage() {
  const [leads, setLeads]           = useState<Lead[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [search, setSearch]         = useState('')
  const [status, setStatus]         = useState<FilterStatus>('todos')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json() as Promise<Lead[]>
      })
      .then(setLeads)
      .catch(() => toast.error('Erro ao carregar leads.'))
      .finally(() => setIsLoading(false))
  }, [dialogOpen])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch = [l.name, l.email, l.phone, l.city, l.niche].some((f) =>
        f?.toLowerCase().includes(search.toLowerCase()),
      )
      const matchStatus = status === 'todos' || l.status === status
      return matchSearch && matchStatus
    })
  }, [leads, search, status])

  return (
    <>
      <Header
        title="Leads"
        action={
          <button
            onClick={() => setDialogOpen(true)}
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            <Plus className="size-3.5 mr-1.5" />
            Novo lead
          </button>
        }
      />

      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome, email, cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={status} onValueChange={(v) => setStatus(v as FilterStatus)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="novo">Novo</SelectItem>
            <SelectItem value="contatado">Contatado</SelectItem>
            <SelectItem value="qualificado">Qualificado</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} {filtered.length === 1 ? 'lead' : 'leads'}
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border overflow-hidden animate-pulse">
          <div className="h-10 bg-muted border-b border-border" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
              <div className="h-3 bg-muted rounded w-1/4" />
              <div className="h-3 bg-muted rounded w-1/5" />
              <div className="h-3 bg-muted rounded w-1/6" />
              <div className="h-5 bg-muted rounded-full w-20 ml-auto" />
            </div>
          ))}
        </div>
      ) : (
        <LeadTable leads={filtered} />
      )}

      <NewLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
