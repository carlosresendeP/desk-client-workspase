import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'

type Params = {
  params:      Promise<{ slug: string }>
  searchParams: Promise<{ acao?: string }>
}

export default async function ObrigadoPage({ params, searchParams }: Params) {
  const { slug }  = await params
  const { acao }  = await searchParams
  const approved  = acao === 'aprovado'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-md w-full p-8 text-center">
        {approved ? (
          <>
            <CheckCircle className="size-14 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Orçamento aprovado!</h1>
            <p className="text-sm text-gray-500">
              Obrigado pela confirmação. O prestador foi notificado e entrará em contato em breve.
            </p>
          </>
        ) : (
          <>
            <XCircle className="size-14 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Orçamento recusado</h1>
            <p className="text-sm text-gray-500">
              Sua resposta foi registrada. O prestador foi notificado.
            </p>
          </>
        )}

        <Link
          href={`/orcamento/${slug}`}
          className="mt-6 inline-block text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
        >
          Ver orçamento
        </Link>
      </div>
    </div>
  )
}
