export type LeadStatus = 'novo' | 'contatado' | 'qualificado' | 'perdido'

export interface Lead {
  id:        string
  name:      string
  phone:     string | null
  email:     string | null
  website:   string | null
  source:    string | null
  niche:     string | null
  city:      string | null
  status:    LeadStatus
  notes:     string | null
  createdAt: string
  updatedAt: string
}
