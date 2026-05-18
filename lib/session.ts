import { auth } from './auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function getSessionOrUnauthorized() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return {
      userId: null,
      error: NextResponse.json({ error: 'Não autenticado' }, { status: 401 }),
    }
  }
  return { userId: session.user.id, error: null }
}

export async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}
