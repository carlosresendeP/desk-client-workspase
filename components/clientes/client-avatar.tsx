interface ClientAvatarProps {
  name: string
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export function ClientAvatar({ name, className }: ClientAvatarProps) {
  return (
    <div
      className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-base border border-border shrink-0 ${className ?? ''}`}
    >
      {getInitials(name)}
    </div>
  )
}
