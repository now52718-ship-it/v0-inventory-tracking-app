export const PRODUCTS = [
  { id: 1, name: '769XR XPON Router', cat: 'Router', serials: ['XPONDD87A2D2', 'XPONDD87A3A2', 'XPONDD87A432'], stock: 8, status: 'In Stock' as const },
  { id: 2, name: 'Nokia ONU', cat: 'ONU', serials: ['NK-ONU-001', 'NK-ONU-002'], stock: 10, status: 'In Stock' as const },
  { id: 3, name: 'Mikrotik 951', cat: 'Router', serials: ['HKB0AMS5SH3', 'HKB0AVX59HR'], stock: 2, status: 'Low Stock' as const },
  { id: 4, name: 'Black ONT', cat: 'ONT', serials: ['ALCLF9DE9961'], stock: 1, status: 'Low Stock' as const },
  { id: 5, name: 'Fiber Connectors', cat: 'Consumable', serials: [], stock: 60, status: 'In Stock' as const },
  { id: 6, name: 'D-Link Router', cat: 'Router', serials: ['DL-WR001'], stock: 0, status: 'Out of Stock' as const },
  { id: 7, name: 'Sig. Connect ONT 122XR', cat: 'ONT', serials: ['SC-122XR-001', 'SC-122XR-002'], stock: 2, status: 'Low Stock' as const },
]

export const STAFF = ['Mr Isaac', 'Susan', 'Fred', 'Foday', 'OJOE', 'Emmanuel']
export const CATEGORIES = ['Installation', 'Replacement', 'Connectors', 'General']
export const CONDITIONS = ['Good Condition', 'Faulty', 'Damaged', 'New in Box', 'New in Pack']
export const PRODUCT_CATEGORIES = ['All', 'Router', 'ONU', 'ONT', 'Consumable']

export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'In Field' | 'Returned' | 'Received' | 'Faulty' | 'Damaged'

export interface Product {
  id: number
  name: string
  cat: string
  serials: string[]
  stock: number
  status: ProductStatus
}

export interface User {
  id: string
  username: string
  name: string
  role: 'admin' | 'staff'
  token: string
}

export interface ActivityItem {
  id: number
  type: 'issue' | 'return' | 'stock'
  product: string
  staff: string
  date: string
  quantity: number
  serial?: string
  condition?: string
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 1, type: 'issue', product: '769XR XPON Router', serial: 'XPONDD87A2D2', staff: 'Fred', date: '12 Mar', quantity: 1 },
  { id: 2, type: 'return', product: 'Tender Router', serial: '230368950110005593', staff: 'Foday', date: '13 Mar', quantity: 1, condition: 'Faulty' },
  { id: 3, type: 'stock', product: 'Fiber Connectors', staff: 'Mr Isaac', date: '12 Mar', quantity: 50 },
  { id: 4, type: 'return', product: 'Black ONT', serial: 'ALCLF9DE9961', staff: 'Foday', date: '13 Mar', quantity: 1, condition: 'Good Condition' },
]
