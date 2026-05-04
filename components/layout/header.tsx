import { ReactNode } from 'react'

interface HeaderProps {
  title: string
  action?: ReactNode
}

export function Header({ title, action }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      {action}
    </div>
  )
}
