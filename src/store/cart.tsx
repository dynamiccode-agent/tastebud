'use client'
import { createContext, useContext, useReducer, ReactNode } from 'react'
import { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  venueId: string
  tableNumber: string
  tableId: string
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_TABLE'; venueId: string; tableNumber: string; tableId: string }

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setTable: (venueId: string, tableNumber: string, tableId: string) => void
  total: number
  subtotal: number
  itemCount: number
  hasAlcohol: boolean
}

const CartContext = createContext<CartContextType | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + action.item.quantity } : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.item] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map(i => (i.id === action.id ? { ...i, quantity: action.quantity } : i)),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'SET_TABLE':
      return { ...state, venueId: action.venueId, tableNumber: action.tableNumber, tableId: action.tableId }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    venueId: '',
    tableNumber: '',
    tableId: '',
  })

  const subtotal = state.items.reduce((sum, item) => {
    const extrasTotal = item.customisations.added.reduce((s, a) => s + a.price, 0)
    return sum + (item.price + extrasTotal) * item.quantity
  }, 0)

  const total = subtotal
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const hasAlcohol = state.items.some(item => item.isAlcohol)

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
        removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
        updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        setTable: (venueId, tableNumber, tableId) =>
          dispatch({ type: 'SET_TABLE', venueId, tableNumber, tableId }),
        total,
        subtotal,
        itemCount,
        hasAlcohol,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
