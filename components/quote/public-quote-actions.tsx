'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PublicQuoteActionsProps {
  slug: string
}

export function PublicQuoteActions({ slug }: PublicQuoteActionsProps) {
  const router    = useRouter()
  const [message, setMessage]     = useState('')
  const [submitting, setSubmitting] = useState<'approve' | 'decline' | null>(null)
  const [error, setError]         = useState('')

  async function handleAction(action: 'approve' | 'decline') {
    setSubmitting(action)
    setError('')

    const endpoint = action === 'approve'
      ? `/api/orcamento/${slug}/aprovar`
      : `/api/orcamento/${slug}/recusar`

    const res = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: message.trim() || undefined }),
    })

    if (!res.ok) {
      setError('Ocorreu um erro. Tente novamente.')
      setSubmitting(null)
      return
    }

    router.push(`/orcamento/${slug}/obrigado?acao=${action === 'approve' ? 'aprovado' : 'recusado'}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
      <p className="text-sm font-medium text-gray-700">Deixe uma mensagem (opcional)</p>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Observações, dúvidas ou comentários..."
        rows={3}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => handleAction('approve')}
          disabled={!!submitting}
        >
          <ThumbsUp className="size-4 mr-2" />
          {submitting === 'approve' ? 'Aprovando...' : 'Aprovar orçamento'}
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => handleAction('decline')}
          disabled={!!submitting}
        >
          <ThumbsDown className="size-4 mr-2" />
          {submitting === 'decline' ? 'Recusando...' : 'Recusar'}
        </Button>
      </div>
    </div>
  )
}
