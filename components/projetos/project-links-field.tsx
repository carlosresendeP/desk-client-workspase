'use client'

import { useFieldArray, type Control } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProjectFormValues } from './project-form'

interface ProjectLinksFieldProps {
  control: Control<ProjectFormValues>
}

export function ProjectLinksField({ control }: ProjectLinksFieldProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'links' })

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            {...control.register(`links.${index}.label`)}
            placeholder="Label (ex: Figma)"
            className="w-32 flex-shrink-0"
          />
          <Input
            {...control.register(`links.${index}.url`)}
            placeholder="URL"
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
              'text-muted-foreground hover:text-destructive',
            )}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ label: '', url: '' })}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'self-start text-muted-foreground',
        )}
      >
        <Plus className="size-3.5 mr-1" />
        Adicionar link
      </button>
    </div>
  )
}
