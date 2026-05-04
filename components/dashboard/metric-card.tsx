import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string
  subtitle: string
  icon: LucideIcon
  mono?: boolean
}

export function MetricCard({ label, value, subtitle, icon: Icon, mono = false }: MetricCardProps) {
  return (
    <Card className="flex-1">
      <CardContent className="pt-4 pb-5 px-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
            {label}
          </p>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <p className={`text-2xl font-semibold text-foreground leading-none mb-1.5 ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
