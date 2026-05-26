import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { Toaster } from 'sonner'
import { ServiceCard } from './service-card'

const meta: Meta<typeof ServiceCard> = {
  title: 'Service/ServiceCard',
  component: ServiceCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
        <Toaster />
      </div>
    ),
  ],
  args: {
    onEdit: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Ativo: Story = {
  args: {
    service: {
      id: '1',
      userId: 'user-1',
      name: 'Consultoria em TI',
      description: 'Serviço de consultoria técnica para empresas.',
      basePrice: 350,
      unit: 'hr',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  },
}

export const Inativo: Story = {
  args: {
    service: {
      id: '2',
      userId: 'user-1',
      name: 'Desenvolvimento de Site',
      description: 'Criação de site institucional completo.',
      basePrice: 4500,
      unit: 'project',
      active: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  },
}

export const SemDescricao: Story = {
  args: {
    service: {
      id: '3',
      userId: 'user-1',
      name: 'Visita Técnica',
      description: null,
      basePrice: 120,
      unit: 'visit',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  },
}

export const NomeLongo: Story = {
  args: {
    service: {
      id: '4',
      userId: 'user-1',
      name: 'Serviço com um nome muito longo para testar o comportamento do truncate no card',
      description: 'Descrição também longa para verificar o line-clamp de duas linhas funcionando corretamente no layout do card.',
      basePrice: 9999.99,
      unit: 'day',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  },
}
