'use client'

import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Client } from '@/types/client'

export type ClientStepData = {
  clientId:       string
  clientName:     string
  clientEmail:    string
  clientWhatsapp: string
  validUntil:     string
  notes:          string
}

interface StepClientProps {
  data:     ClientStepData
  onChange: (data: ClientStepData) => void
  onNext:   (data: ClientStepData) => void
}

export function StepClient({ data, onChange, onNext }: StepClientProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError]     = useState('')

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(setClients)
      .catch(() => {})
  }, [])

  function handleClientSelect(id: string) {
    const client = clients.find(c => c.id === id)
    if (client) {
      onChange({
        ...data,
        clientId:       client.id,
        clientName:     client.name,
        clientEmail:    client.email    ?? '',
        clientWhatsapp: client.phone    ?? '',
      })
    } else {
      onChange({ ...data, clientId: '', clientName: '', clientEmail: '', clientWhatsapp: '' })
    }
  }

  function handleNext() {
    if (!data.clientName.trim()) {
      setError('Nome do cliente é obrigatório.')
      return
    }
    setError('')
    onNext(data)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientSelect">Cliente existente</Label>
        <select
          id="clientSelect"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={data.clientId}
          onChange={e => handleClientSelect(e.target.value)}
        >
          <option value="">Selecionar cliente...</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientName">
          Nome do cliente <span className="text-destructive">*</span>
        </Label>
        <Input
          id="clientName"
          value={data.clientName}
          onChange={e => onChange({ ...data, clientName: e.target.value })}
          placeholder="Nome completo ou razão social"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="clientEmail">E-mail</Label>
          <Input
            id="clientEmail"
            type="email"
            value={data.clientEmail}
            onChange={e => onChange({ ...data, clientEmail: e.target.value })}
            placeholder="email@exemplo.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="clientWhatsapp">WhatsApp</Label>
          <Input
            id="clientWhatsapp"
            value={data.clientWhatsapp}
            onChange={e => onChange({ ...data, clientWhatsapp: e.target.value })}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <Label htmlFor="validUntil">Válido até</Label>
        <Input
          id="validUntil"
          type="date"
          value={data.validUntil}
          onChange={e => onChange({ ...data, validUntil: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Observações</Label>
        <textarea
          id="notes"
          value={data.notes}
          onChange={e => onChange({ ...data, notes: e.target.value })}
          placeholder="Condições, prazo de execução, forma de pagamento..."
          rows={3}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleNext}>Próximo →</Button>
      </div>
    </div>
  )
}
