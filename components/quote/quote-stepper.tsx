'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { StepClient, type ClientStepData } from './step-client'
import { StepItems } from './step-items'
import { StepPreview } from './step-preview'
import type { QuoteItem } from '@/types/quote'

const steps = [
  { number: 1, label: 'Cliente' },
  { number: 2, label: 'Itens' },
  { number: 3, label: 'Revisão' },
]

const emptyClientData: ClientStepData = {
  clientId:       '',
  clientName:     '',
  clientEmail:    '',
  clientWhatsapp: '',
  validUntil:     '',
  notes:          '',
}

interface QuoteStepperProps {
  onSubmit: (data: ClientStepData, items: QuoteItem[], status: 'DRAFT' | 'SENT') => Promise<void>
}

export function QuoteStepper({ onSubmit }: QuoteStepperProps) {
  const [step, setStep]             = useState(1)
  const [clientData, setClientData] = useState<ClientStepData>(emptyClientData)
  const [items, setItems]           = useState<QuoteItem[]>([])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'size-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors',
                  step === s.number
                    ? 'bg-primary text-primary-foreground border-primary'
                    : step > s.number
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-muted text-muted-foreground border-border',
                )}
              >
                {s.number}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  step >= s.number ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-px mx-3', step > s.number ? 'bg-primary/40' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <StepClient
          data={clientData}
          onChange={setClientData}
          onNext={data => { setClientData(data); setStep(2) }}
        />
      )}
      {step === 2 && (
        <StepItems
          items={items}
          onChange={setItems}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepPreview
          clientData={clientData}
          items={items}
          onBack={() => setStep(2)}
          onSubmit={(status) => onSubmit(clientData, items, status)}
        />
      )}
    </div>
  )
}
