import { redirect } from 'next/navigation'
import { getUserId } from '@/lib/session'
import LandingPage from '@/components/landing/LandingPage'

export default async function Home() {
  const userId = await getUserId()
  if (userId) redirect('/dashboard')
  return <LandingPage />
}
