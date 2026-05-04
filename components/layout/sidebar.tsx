'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Columns2, FolderOpen, Users, Target, Settings, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Kanban', href: '/kanban', icon: Columns2 },
  { label: 'Projetos', href: '/projetos', icon: FolderOpen },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Leads', href: '/leads', icon: Target },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="px-4 pt-5 pb-4">
        <div className="mb-4">
          <p className="text-sm font-semibold text-sidebar-foreground leading-none">Desk</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Client Workspace</p>
        </div>
        <Link href="/projetos/novo" className={cn(buttonVariants({ size: 'sm' }), 'w-full justify-center')}>
          <Plus className="size-3.5 mr-1.5" />
          Novo projeto
        </Link>
      </div>

      <nav className="flex-1 px-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors relative',
                active
                  ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-accent" />
              )}
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 pb-4">
        <Separator className="mb-2" />
        <Link
          href="/configuracoes"
          className={cn(
            'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
            pathname === '/configuracoes'
              ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
          )}
        >
          <Settings className="size-4 shrink-0" />
          Configurações
        </Link>
      </div>
    </aside>
  )
}
