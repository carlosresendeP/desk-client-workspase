'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ServiceCard } from '@/components/service/service-card'
import { ServiceModal } from '@/components/service/service-modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Service } from '@/types/service'

export default function ServicosPage() {
  const [services, setServices]     = useState<Service[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [search, setSearch]         = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState<Service | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json() as Promise<Service[]>
      })
      .then(setServices)
      .catch(() => toast.error('Failed to load services.'))
      .finally(() => setIsLoading(false))
  }, [modalOpen])

  const filtered = useMemo(
    () =>
      services.filter((s) =>
        [s.name, s.description].some((f) =>
          f?.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [services, search],
  )

  function openEdit(service: Service) {
    setEditing(service)
    setModalOpen(true)
  }

  function handleOpenChange(open: boolean) {
    setModalOpen(open)
    if (!open) setEditing(null)
  }

  return (
    <>
      <Header
        title="Serviços"
        action={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Novo serviço
          </Button>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-sm">
            {search ? 'Nenhum serviço corresponde à sua pesquisa.' : 'Nenhum serviço encontrado.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} onEdit={openEdit} />
          ))}
        </div>
      )}

      <ServiceModal
        open={modalOpen}
        onOpenChange={handleOpenChange}
        editingService={editing}
      />
    </>
  )
}
