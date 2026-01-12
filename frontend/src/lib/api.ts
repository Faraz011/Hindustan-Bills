// frontend/src/lib/api.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hb_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hb_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Shop {
  _id: string;
  name: string;
  businessType: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact?: {
    phone: string;
    email: string;
  };
  businessHours?: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  metadata?: {
    fssaiLicense?: string;
    gstNumber?: string;
  };
  owner: {
    name: string;
    email: string;
  } | null;
}

export interface Product {
  _id?: string;
  name: string;
  price: number;
  barcode?: string;
  sku?: string;
  category?: string;
  description?: string;
  stock?: number;
  imageUrl?: string;
  shopId?: string;
}

export interface Order {
  _id: string;
  customerName?: string;
  customerPhone?: string;
  products: Array<{
    product: string | Product;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt?: string;
  shop?: string;
}

export interface Order {
  _id: string;
  items: Array<{ product: Product; quantity: number; price: number }>;
  total: number;
  status: string;
  createdAt: string;
}

// -------------------- Auth --------------------
export const login = async (data: { email: string; password: string }) => {
  return api.post("/api/auth/login", data);
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  return api.post("/api/auth/register", data);
};

// -------------------- Shops --------------------
export const getShopDetails = async (): Promise<Shop> => {
  return api.get("/api/shop/details");
};

export const updateShopDetails = async (data: Partial<Shop>): Promise<Shop> => {
  return api.put("/api/shop/details", data);
};

export const getShopProducts = async (): Promise<Product[]> => {
  return api.get("/api/products");
};

export const getShopOrders = async (): Promise<Order[]> => {
  return api.get("/api/orders");
};

export const getNearbyShops = async (
  lat: number,
  lng: number
): Promise<Shop[]> => {
  return api.get(`/api/shops/nearby?lat=${lat}&lng=${lng}`);
};

export const listShops = async (): Promise<Shop[]> => {
  return api.get("/api/shops");
};

// -------------------- Products --------------------
export const getProducts = async (shopId?: string): Promise<Product[]> => {
  const url = shopId ? `/api/products?shopId=${shopId}` : "/api/products";
  const res = await api.get<{ products?: Product[] } | Product[]>(url);

  const data = res as any;
  if (Array.isArray(data)) return data;
  return data.products ?? [];
};

export const getProductByBarcode = async (
  barcode: string
): Promise<Product> => {
  const res = await api.get<{ product?: Product }>(
    `/api/products/barcode/${encodeURIComponent(barcode)}`
  );
  return (res as any).product ?? (res as any);
};

export const addProduct = async (data: Partial<Product>) => {
  return api.post("/api/products", data);
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  return api.put(`/api/products/${id}`, data);
};

export const deleteProduct = async (id: string) => {
  return api.delete(`/api/products/${id}`);
};

// -------------------- Cart (barcode routes) --------------------
export const addToCart = async (productId: string, quantity = 1) => {
  return api.post("/api/cart", {
    productId,
    quantity,
  });
};

export const getCart = async () => {
  const res = await api.get<{ cart?: any; items?: any[] }>("/api/cart");
  // backend may return { cart: {...} } or { items: [...] }
  if ((res as any).cart) return (res as any).cart;
  return res;
};

export const removeFromCart = async (productId: string) => {
  return api.delete(`/api/cart/${productId}`);
};

export const updateCartItem = async (productId: string, quantity: number) => {
  return api.post("/api/barcode/cart/update", { productId, quantity });
};

// -------------------- Orders --------------------
export const placeOrder = async () => {
  return api.post("/api/orders/order");
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  return api.put(`/api/orders/${orderId}/status`, { status });
};

export const getOrders = async () => {
  const res = await api.get<{ orders?: Order[] }>("/api/shop/orders");
  return res.orders ?? res ?? [];
};

export const getOrdersHistory = async (params?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.startDate) query.set("startDate", params.startDate);
  if (params?.endDate) query.set("endDate", params.endDate);
  const res = await api.get<{ orders?: Order[] }>(
    `/api/orders/history?${query.toString()}`
  );
  return res.orders || [];
};

// -------------------- Shops --------------------
export const getAvailableShops = async () => {
  const res = await api.get<{ shops: Shop[]; count: number }>(
    "/api/shop/available"
  );
  return res.shops || [];
};

// -------------------- Payments (optional) --------------------
export const createPayment = async (data: any) => {
  return api.post("/api/payments/create", data);
};

export default {};
