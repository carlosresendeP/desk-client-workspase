import { notFound } from 'next/navigation'
import { Calendar, Clock } from 'lucide-react'
import { getPublicQuote, incrementQuoteViews } from '@/services/quote.service'
import { PublicQuoteActions } from '@/components/quote/public-quote-actions'
import type { QuoteItem } from '@/types/quote'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR')

const statusMessage: Record<string, { label: string; color: string }> = {
  APPROVED: { label: 'Orçamento aprovado',   color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  DECLINED: { label: 'Orçamento recusado',   color: 'text-red-700 bg-red-50 border-red-200'             },
  EXPIRED:  { label: 'Orçamento expirado',   color: 'text-gray-600 bg-gray-100 border-gray-200'         },
  DRAFT:    { label: 'Rascunho (não enviado)', color: 'text-blue-700 bg-blue-50 border-blue-200'         },
}

type Params = { params: Promise<{ slug: string }> }

export default async function PublicQuotePage({ params }: Params) {
  const { slug } = await params
  const data = await getPublicQuote(slug)

  if (!data) notFound()

  await incrementQuoteViews(slug).catch(() => {})

  const total      = data.items.reduce((sum, item: QuoteItem) => sum + item.total, 0)
  const canRespond = data.status === 'SENT'
  const statusInfo = statusMessage[data.status]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Prestador */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{data.prestador.name}</p>
            {data.prestador.occupation && (
              <p className="text-sm text-gray-500">{data.prestador.occupation}</p>
            )}
          </div>
          {data.prestador.whatsapp && (
            <a
              href={`https://wa.me/${data.prestador.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 hover:underline"
            >
              {data.prestador.whatsapp}
            </a>
          )}
        </div>

        {/* Status banner (se não for SENT) */}
        {!canRespond && statusInfo && (
          <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.label}
            {data.approvedAt && ` — ${formatDate(data.approvedAt)}`}
            {data.declinedAt && ` — ${formatDate(data.declinedAt)}`}
          </div>
        )}

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Orçamento para</p>
            <p className="text-xl font-bold text-gray-900">{data.clientName}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                Criado em {formatDate(data.createdAt)}
              </span>
              {data.validUntil && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  Válido até {formatDate(data.validUntil)}
                </span>
              )}
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 font-medium text-gray-600">Descrição</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 w-24">Qtd</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600 w-28">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item: QuoteItem, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-500">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {formatBRL(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={2} className="px-6 py-4 text-right font-semibold text-gray-700">
                  Total
                </td>
                <td className="px-6 py-4 text-right font-bold text-lg text-gray-900">
                  {formatBRL(total)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Notes */}
          {data.notes && (
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Observações
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{data.notes}</p>
            </div>
          )}
        </div>

        {/* Client message (after decision) */}
        {data.clientMessage && (
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Sua mensagem
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{data.clientMessage}</p>
          </div>
        )}

        {/* Approve / decline actions */}
        {canRespond && <PublicQuoteActions slug={slug} />}

        <p className="text-center text-xs text-gray-400 pb-4">
          Powered by Desk · Client Workspace
        </p>
      </div>
    </div>
  )
}
