import {
  LayoutDashboard,
  Target,
  Users,
  FolderOpen,
  Columns2,
  Briefcase,
  FileText,
  CheckCircle,
  Lightbulb,
} from 'lucide-react'

const workflow = [
  { step: 1, label: 'Cadastre um Lead',     description: 'Alguém demonstrou interesse? Adicione como lead.' },
  { step: 2, label: 'Converta em Cliente',  description: 'Lead virou negócio? Promova para cliente.' },
  { step: 3, label: 'Crie um Projeto',      description: 'Abra um projeto vinculado ao cliente.' },
  { step: 4, label: 'Gere um Orçamento',    description: 'Monte o orçamento com serviços e valores.' },
  { step: 5, label: 'Cliente aprova',       description: 'Envie o link; o cliente aprova ou recusa.' },
  { step: 6, label: 'Execute e entregue',   description: 'Mova o projeto no Kanban até a entrega.' },
]

const modules = [
  {
    icon: LayoutDashboard,
    color: 'bg-primary/10 text-primary',
    name: 'Dashboard',
    description: 'Visão geral do seu negócio. Veja métricas de leads, clientes, projetos e orçamentos em um único lugar.',
    tip: 'Acesse o dashboard toda manhã para ter clareza do que está em andamento.',
  },
  {
    icon: Target,
    color: 'bg-accent/20 text-accent',
    name: 'Leads',
    description: 'Gerencie contatos que ainda não são clientes. Acompanhe cada lead até a conversão ou descarte.',
    tip: 'Anote sempre a origem do lead (indicação, redes sociais etc.) para entender de onde vêm seus negócios.',
  },
  {
    icon: Users,
    color: 'bg-status-concluido/20 text-status-concluido',
    name: 'Clientes',
    description: 'Sua base de clientes ativa. Acesse o histórico de projetos e orçamentos de cada um.',
    tip: 'Mantenha o WhatsApp do cliente cadastrado — ele é usado na notificação automática ao aprovar orçamentos.',
  },
  {
    icon: FolderOpen,
    color: 'bg-status-andamento/20 text-status-andamento',
    name: 'Projetos',
    description: 'Cada trabalho vira um projeto. Defina título, cliente, prazo e status de entrega.',
    tip: 'Vincule sempre um projeto ao cliente para manter o histórico organizado.',
  },
  {
    icon: Columns2,
    color: 'bg-status-backlog/20 text-status-backlog',
    name: 'Kanban',
    description: 'Quadro visual com colunas de status. Arraste projetos entre as colunas conforme o progresso.',
    tip: 'Use as colunas para refletir seu processo real: Ex. "A fazer → Em andamento → Revisão → Entregue".',
  },
  {
    icon: Briefcase,
    color: 'bg-status-entregue/20 text-status-entregue',
    name: 'Serviços',
    description: 'Catálogo dos serviços que você oferece. Cadastre nome, preço-base e unidade (hora, m², projeto…).',
    tip: 'Serviços cadastrados aparecem como atalho na hora de montar orçamentos — economiza tempo.',
  },
  {
    icon: FileText,
    color: 'bg-accent/15 text-accent',
    name: 'Orçamentos',
    description: 'Crie orçamentos profissionais com itens, valores e prazo de validade. Gere um link público para o cliente aprovar online, sem precisar de login.',
    tip: 'Use "Salvar rascunho" para montar o orçamento com calma e "Gerar link" só quando estiver pronto para enviar.',
  },
]

const tips = [
  'Preencha seu WhatsApp e ocupação em Configurações — eles aparecem no orçamento público para o cliente entrar em contato.',
  'O link do orçamento pode ser aberto em qualquer celular ou computador, sem login.',
  'Orçamentos expirados são marcados automaticamente todo dia às 6h.',
  'Você pode reabrir um rascunho e editar antes de enviar.',
]

export default function ComoUsarPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Como usar o Desk</h1>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          O Desk é um espaço de trabalho para freelancers e prestadores de serviço gerenciarem
          clientes, projetos e orçamentos em um único lugar — sem planilhas, sem papel.
        </p>
      </div>

      {/* Fluxo de trabalho */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">Fluxo de trabalho recomendado</h2>
        <div className="space-y-2">
          {workflow.map(({ step, label, description }, i) => (
            <div key={step} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  {step}
                </div>
                {i < workflow.length - 1 && (
                  <div className="w-px h-6 bg-border mt-1" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Módulos */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">Os módulos</h2>
        <div className="space-y-4">
          {modules.map(({ icon: Icon, color, name, description, tip }) => (
            <div key={name} className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`rounded-lg p-2 shrink-0 ${color}`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-card-foreground mb-0.5">{name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  <div className="mt-3 flex items-start gap-2 bg-muted rounded-lg px-3 py-2">
                    <Lightbulb className="size-3.5 text-accent shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dicas rápidas */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">Dicas rápidas</h2>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle className="size-4 text-status-concluido shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="pb-4 text-center text-xs text-muted-foreground">
        Desk · Client Workspace
      </div>
    </div>
  )
}
