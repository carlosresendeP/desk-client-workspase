'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { QuoteItem } from '@/types/quote'
import type { ClientStepData } from './step-client'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR')

interface StepPreviewProps {
  clientData: ClientStepData
  items:      QuoteItem[]
  onBack:     () => void
  onSubmit:   (status: 'DRAFT' | 'SENT') => Promise<void>
}

export function StepPreview({ clientData, items, onBack, onSubmit }: StepPreviewProps) {
  const [submitting, setSubmitting] = useState<'DRAFT' | 'SENT' | null>(null)
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0)

  async function handleSubmit(status: 'DRAFT' | 'SENT') {
    setSubmitting(status)
    await onSubmit(status)
    setSubmitting(null)
  }

  return (
    <div className="space-y-5">
      <div className="bg-muted rounded-lg p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cliente</p>
        <p className="font-semibold text-foreground">{clientData.clientName}</p>
        {clientData.clientEmail && (
          <p className="text-sm text-muted-foreground">{clientData.clientEmail}</p>
        )}
        {clientData.clientWhatsapp && (
          <p className="text-sm text-muted-foreground">{clientData.clientWhatsapp}</p>
        )}
        {clientData.validUntil && (
          <p className="text-sm text-muted-foreground mt-1">
            Válido até: <span className="font-medium">{formatDate(clientData.validUntil)}</span>
          </p>
        )}
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Item</th>
              <th className="text-center px-3 py-2.5 font-medium w-24">Quantidade</th>
              <th className="text-right px-4 py-2.5 font-medium w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-3">
                  <p className="font-medium">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  )}
                </td>
                <td className="px-3 py-3 text-center text-muted-foreground">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatBRL(item.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted border-t border-border">
            <tr>
              <td colSpan={2} className="px-4 py-2.5 text-right font-semibold">Total</td>
              <td className="px-4 py-2.5 text-right font-bold text-base">{formatBRL(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {clientData.notes && (
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Observações
          </p>
          <p className="text-sm text-foreground whitespace-pre-line">{clientData.notes}</p>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack} disabled={!!submitting}>
          ← Voltar
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('DRAFT')}
            disabled={!!submitting}
          >
            {submitting === 'DRAFT' ? 'Salvando...' : 'Salvar rascunho'}
          </Button>
          <Button
            onClick={() => handleSubmit('SENT')}
            disabled={!!submitting}
          >
            {submitting === 'SENT' ? 'Gerando...' : 'Gerar link'}
          </Button>
        </div>
      </div>
    </div>
  )
}
