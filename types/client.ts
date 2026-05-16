export interface Client {
  id:        string
  name:      string
  email:     string | null
  phone:     string | null
  sector:    string | null
  notes:     string | null
  createdAt: string
  updatedAt: string
}
