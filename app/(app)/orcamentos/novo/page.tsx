'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { QuoteStepper } from '@/components/quote/quote-stepper'
import type { ClientStepData } from '@/components/quote/step-client'
import type { QuoteItem } from '@/types/quote'

export default function NovoOrcamentoPage() {
  const router = useRouter()

  async function handleSubmit(
    clientData: ClientStepData,
    items: QuoteItem[],
    status: 'DRAFT' | 'SENT',
  ) {
    const res = await fetch('/api/quotes', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId:       clientData.clientId       || null,
        clientName:     clientData.clientName,
        clientEmail:    clientData.clientEmail     || null,
        clientWhatsapp: clientData.clientWhatsapp  || null,
        validUntil:     clientData.validUntil      || null,
        notes:          clientData.notes           || null,
        items,
        status,
      }),
    })

    if (!res.ok) {
      toast.error('Erro ao criar orçamento.')
      return
    }

    const { quote } = await res.json()

    if (status === 'SENT') {
      const publicUrl = `${window.location.origin}/orcamento/${quote.slug}`
      await navigator.clipboard.writeText(publicUrl).catch(() => {})
      toast.success('Link copiado para a área de transferência!')
    } else {
      toast.success('Rascunho salvo!')
    }

    router.push(`/orcamentos/${quote.id}`)
    router.refresh()
  }

  return (
    <>
      <Header title="Novo orçamento" />
      <QuoteStepper onSubmit={handleSubmit} />
    </>
  )
}
