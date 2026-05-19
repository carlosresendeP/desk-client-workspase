export type QuoteStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'DECLINED' | 'EXPIRED'

export interface QuoteItem {
  name:        string
  description: string | undefined
  quantity:    number
  unitPrice:   number
  unit:        string
  total:       number
}

export interface Quote {
  id:             string
  slug:           string
  userId:         string
  clientId:       string | null
  projectId:      string | null
  clientName:     string
  clientEmail:    string | null
  clientWhatsapp: string | null
  items:          QuoteItem[]
  notes:          string | null
  validUntil:     string | null
  status:         QuoteStatus
  clientMessage:  string | null
  views:          number
  approvedAt:     string | null
  declinedAt:     string | null
  createdAt:      string
  updatedAt:      string
}
