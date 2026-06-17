export interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  image?: string
  isAlcohol: boolean
  customisations: {
    removed: string[]
    added: { name: string; price: number }[]
  }
  notes: string
}

export interface CartState {
  items: CartItem[]
  venueId: string
  tableNumber: string
  tableId?: string
}
