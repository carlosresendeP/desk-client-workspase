export type ServiceUnit = 'un' | 'hr' | 'm2' | 'day' | 'project' | 'visit'

export interface Service {
  id:          string
  userId:      string
  name:        string
  description: string | null
  basePrice:   number
  unit:        ServiceUnit | string
  active:      boolean
  createdAt:   string
  updatedAt:   string
}
