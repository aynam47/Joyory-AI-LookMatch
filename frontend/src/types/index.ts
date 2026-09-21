export interface Product {
  id: number
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  badge?: string
  shade?: string
  color_family?: string
  undertone?: string
  finish?: string
  texture?: string
  coverage?: string
  skin_types?: string[]
  features?: string[]
  shared_ingredients?: string[]
  savings_percentage?: number
  image: string
}
