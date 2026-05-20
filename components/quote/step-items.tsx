'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { QuoteItem } from '@/types/quote'
import type { Service } from '@/types/service'

const unitOptions = [
  { value: 'un',      label: 'Unidade' },
  { value: 'hr',      label: 'Hora' },
  { value: 'm2',      label: 'm²' },
  { value: 'day',     label: 'Dia' },
  { value: 'project', label: 'Projeto' },
  { value: 'visit',   label: 'Visita' },
]

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

interface StepItemsProps {
  items:    QuoteItem[]
  onChange: (items: QuoteItem[]) => void
  onNext:   () => void
  onBack:   () => void
}

export function StepItems({ items, onChange, onNext, onBack }: StepItemsProps) {
  const [services, setServices] = useState<Service[]>([])
  const [error, setError]       = useState('')

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: Service[]) => setServices(data.filter(s => s.active)))
      .catch(() => {})
  }, [])

  function addFromService(service: Service) {
    onChange([...items, {
      name:        service.name,
      description: service.description ?? undefined,
      quantity:    1,
      unitPrice:   service.basePrice,
      unit:        service.unit,
      total:       service.basePrice,
    }])
  }

  function addManual() {
    onChange([...items, { name: '', description: undefined, quantity: 1, unitPrice: 0, unit: 'un', total: 0 }])
  }

  function updateItem(index: number, field: keyof QuoteItem, value: string | number) {
    const updated = items.map((item, i) => {
      if (i !== index) return item
      const next = { ...item, [field]: value }
      if (field === 'quantity' || field === 'unitPrice') {
        next.total = Number(next.quantity) * Number(next.unitPrice)
      }
      return next
    })
    onChange(updated)
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0)

  function handleNext() {
    if (items.length === 0) {
      setError('Adicione ao menos um item ao orçamento.')
      return
    }
    if (items.some(item => !item.name.trim())) {
      setError('Todos os itens precisam ter um nome.')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div className="space-y-4">
      {services.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Adicionar serviço salvo</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value=""
            onChange={e => {
              const service = services.find(s => s.id === e.target.value)
              if (service) addFromService(service)
            }}
          >
            <option value="">Selecionar serviço...</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} — {formatBRL(s.basePrice)} / {s.unit}
              </option>
            ))}
          </select>
        </div>
      )}

      {items.length > 0 && (
        <div className="border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Item</th>
                <th className="text-center px-2 py-2 font-medium w-20">Qtd</th>
                <th className="text-center px-2 py-2 font-medium w-28">Preço unit.</th>
                <th className="text-center px-2 py-2 font-medium w-24">Unid.</th>
                <th className="text-right px-3 py-2 font-medium w-28">Total</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2">
                    <Input
                      value={item.name}
                      onChange={e => updateItem(i, 'name', e.target.value)}
                      placeholder="Nome do item"
                      className="h-7 text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity}
                      onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={e => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      value={item.unit}
                      onChange={e => updateItem(i, 'unit', e.target.value)}
                      className="h-7 w-full rounded border border-input bg-transparent px-2 text-xs"
                    >
                      {unitOptions.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">{formatBRL(item.total)}</td>
                  <td className="px-1 py-2">
                    <button
                      onClick={() => removeItem(i)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted border-t border-border">
              <tr>
                <td colSpan={4} className="px-3 py-2 text-right font-semibold text-sm">Total</td>
                <td className="px-3 py-2 text-right font-bold">{formatBRL(grandTotal)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addManual} className="w-full">
        <Plus className="size-4 mr-1.5" />
        Adicionar item manual
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
        <Button onClick={handleNext}>Próximo →</Button>
      </div>
    </div>
  )
}
