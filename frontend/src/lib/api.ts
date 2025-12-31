// frontend/src/lib/api.ts
import api from '../api/axios'

// Types
export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Shop {
  _id: string
  name: string
  address?: string
  latitude?: number
  longitude?: number
  distance?: number
}

export interface Product {
  _id?: string
  name: string
  price: number
  barcode?: string
  sku?: string
  category?: string
  description?: string
  stock?: number
  imageUrl?: string
  shopId?: string
}

export interface Order {
  _id: string
  items: Array<{ product: Product; quantity: number; price: number }>
  total: number
  status: string
  createdAt: string
}

// -------------------- Auth --------------------
export const login = async (data: { email: string; password: string }) => {
  const res = await api.post('/auth/login', data)
  return res.data
}

export const register = async (data: { name: string; email: string; password: string; role?: string }) => {
  const res = await api.post('/auth/register', data)
  return res.data
}

// -------------------- Shops --------------------
export const getNearbyShops = async (lat: number, lng: number): Promise<Shop[]> => {
  const res = await api.get<{ shops: Shop[] }>(`/shops/nearby?lat=${lat}&lng=${lng}`)
  return res.data.shops || []
}

export const listShops = async (): Promise<Shop[]> => {
  const res = await api.get<{ shops: Shop[] }>('/shops')
  return res.data.shops || []
}

// -------------------- Products --------------------
export const getProducts = async (shopId?: string): Promise<Product[]> => {
  const url = shopId ? `/products?shopId=${shopId}` : '/products'
  const res = await api.get<{ products?: Product[] } | Product[]>(url)

  const data = res.data as any
  if (Array.isArray(data)) return data
  return data.products ?? []
}


export const getProductByBarcode = async (barcode: string): Promise<Product> => {
  const res = await api.get<{ product?: Product }>(`/products/barcode/${encodeURIComponent(barcode)}`)
  return (res.data as any).product ?? (res.data as any)
}

export const addProduct = async (data: Partial<Product>) => {
  const res = await api.post('/products', data)
  return res.data
}

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const res = await api.put(`/products/${id}`, data)
  return res.data
}

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`)
  return res.data
}

// -------------------- Cart (barcode routes) --------------------
export const addToCart = async (barcodeOrProductId: string, quantity = 1) => {
  const res = await api.post('/barcode/cart/add', { barcode: barcodeOrProductId, quantity })
  return res.data
}

export const getCart = async () => {
  const res = await api.get<{ cart?: any; items?: any[] }>('/barcode/cart')
  // backend may return { cart: {...} } or { items: [...] }
  if ((res.data as any).cart) return (res.data as any).cart
  return res.data
}

export const removeFromCart = async (productId: string) => {
  const res = await api.post('/barcode/cart/remove', { productId })
  return res.data
}

export const updateCartItem = async (productId: string, quantity: number) => {
  const res = await api.post('/barcode/cart/update', { productId, quantity })
  return res.data
}

// -------------------- Orders --------------------
export const placeOrder = async () => {
  const res = await api.post('/orders/order')
  return res.data
}

export const getOrders = async () => {
  const res = await api.get<{ orders?: Order[] }>('/orders')
  return res.data.orders ?? []
}

export const getOrdersHistory = async (params?: { status?: string; startDate?: string; endDate?: string }) => {
  const query = new URLSearchParams()
  if (params?.status) query.set('status', params.status)
  if (params?.startDate) query.set('startDate', params.startDate)
  if (params?.endDate) query.set('endDate', params.endDate)
  const res = await api.get<{ orders?: Order[] }>(`/orders/history?${query.toString()}`)
  return res.data.orders || []
}

// -------------------- Payments (optional) --------------------
export const createPayment = async (data: any) => {
  const res = await api.post('/payments/create', data)
  return res.data
}

export default {}
