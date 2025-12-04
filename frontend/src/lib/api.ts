import api from '../api/axios'

// -------------------- Types --------------------
interface User {
  id: string
  name: string
  email: string
  role: string
}

interface LoginResponse {
  token: string
  user: User
}

interface RegisterResponse {
  user: User
}

interface Product {
  id: string
  name: string
  price: number
  description?: string
  category?: string
}

// -------------------- API Functions --------------------

// 🧍 Register
export const registerUser = async (data: {
  name: string
  email: string
  password: string
  role: 'customer' | 'retailer'
}): Promise<User> => {
  const res = await api.post<RegisterResponse>('/users/register', data)
  return res.data.user
}

// 🔐 Login
export const loginUser = async (data: { email: string; password: string }): Promise<User> => {
  const res = await api.post<LoginResponse>('/users/login', data)
  const { token, user } = res.data

  localStorage.setItem('hb_token', token)
  localStorage.setItem('hb_role', user.role)

  return user
}

// 🧾 Get Products
export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get<Product[]>('/products')
  return res.data
}

// ➕ Add Product (retailer only)
export const addProduct = async (data: {
  name: string
  price: number
  description?: string
  category?: string
}): Promise<Product> => {
  const res = await api.post<Product>('/products/add', data)
  return res.data
}

// 🧹 Delete Product
export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/products/${id}`)
  return res.data
}
