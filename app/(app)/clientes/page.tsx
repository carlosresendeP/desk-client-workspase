'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ClientCard } from '@/components/clientes/client-card'
import { NewClientDialog } from '@/components/clientes/new-client-dialog'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Client } from '@/types/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function ClientesPage() {
  const [clients, setClients]       = useState<Client[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [search, setSearch]         = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing]       = useState<Client | null>(null)

  useEffect(() => {
    fetch('/api/clients')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json() as Promise<Client[]>
      })
      .then(setClients)
      .catch(() => toast.error('Erro ao carregar clientes.'))
      .finally(() => setIsLoading(false))
  }, [dialogOpen])


  // O 'useMemo' evita que o filtro seja reexecutado desnecessariamente a cada renderização da página.
  // Ele só vai refazer o filtro se a lista de 'clients' ou o texto de 'search' mudarem.
  const filtered = useMemo(
    () =>
      clients.filter((c) =>
        // Ele só vai refazer o filtro se a lista de 'clients' ou o texto de 'search' mudarem.
        [c.name, c.sector, c.email].some((f) =>
          f?.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [clients, search],
  )

  // Função chamada ao clicar no botão de editar de algum card
  function openEdit(client: Client) {
    setEditing(client)
    setDialogOpen(true)
  }
  // Função que gerencia a abertura/fechamento do modal
  function handleOpenChange(open: boolean) {
    setDialogOpen(open)
    if (!open) setEditing(null)
  }

  return (
    <>
      <Header
        title="Clientes"
        action={
          <button
            onClick={() => setDialogOpen(true)}
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            <Plus className="size-3.5 mr-1.5" />
            Novo cliente
          </button>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'cliente' : 'clientes'}
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-border rounded-lg bg-card text-center">
          <p className="text-sm font-medium text-foreground mb-1">
            {search ? 'Nenhum cliente encontrado' : 'Ainda sem clientes'}
          </p>
          <p className="text-xs text-muted-foreground">
            {search ? 'Tente outro termo de busca.' : 'Clique em "Novo cliente" para adicionar.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} onEdit={openEdit} />
          ))}
        </div>
      )}

      <NewClientDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        editingClient={editing}
      />
    </>
  )
}
