export interface Platform {
  id: string
  name: string
  logo_url: string
  plan_type: string
  features: string[]
  price: number
  original_price: number
  active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Combo {
  id: string
  name: string
  description: string
  platform_names: string[]
  platform_logos: string[]
  price: number
  original_price: number
  badge_text: string
  badge_color: 'purple' | 'magenta' | 'green'
  is_featured: boolean
  active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  updated_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
  active: boolean
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
}
