export interface Client {
  id:           string
  name:         string
  email:        string | null
  phone:        string | null
  sector:       string | null
  notes:        string | null
  projectCount: number
  createdAt:    string
  updatedAt:    string
}
