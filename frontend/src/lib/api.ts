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
  if (token && config.headers) {
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
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

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
    upiId?: string;
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
  image?: string;
  shopId?: string;
  isAvailable?: boolean;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  customer?: {
    name: string;
    email: string;
  };
  customerName?: string;
  customerPhone?: string;
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
  products?: Array<{
    product: string | Product;
    quantity: number;
    price: number;
  }>;
  total?: number;
  totalAmount?: number;
  status: string;
  paymentStatus?: string;
  tableNumber?: string;
  createdAt: string;
  updatedAt?: string;
  shop?: string;
}


export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  [key: string]: any;
}


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

export const guestLogin = async (guestId?: string | null) => {
  return api.post("/api/auth/guest-login", { guestId });
};

export const getShopBySlug = async (slug: string): Promise<Shop> => {
  const res = await api.get(`/api/shop/s/${slug}`);
  return res as unknown as Shop;
};


export const getShopDetails = async (): Promise<Shop> => {
  const res = await api.get("/api/shop/details");
  return res as unknown as Shop;
};

export const updateShopDetails = async (data: Partial<Shop>): Promise<Shop> => {
  const res = await api.put("/api/shop/details", data);
  return res as unknown as Shop;
};

export const getShopProducts = async (): Promise<Product[]> => {
  const res = await api.get("/api/products");
  return res as unknown as Product[];
};

export const getShopOrders = async (): Promise<Order[]> => {
  const res = await api.get("/api/shop/orders");
  return res as unknown as Order[];
};

export const getNearbyShops = async (
  lat: number,
  lng: number
): Promise<Shop[]> => {
  const res = await api.get(`/shops/nearby?lat=${lat}&lng=${lng}`);
  return res as unknown as Shop[];
};

export const listShops = async (): Promise<Shop[]> => {
  const res = await api.get("api/shops");
  return res as unknown as Shop[];
};

export const getAvailableShops = async (): Promise<Shop[]> => {
  const res = await api.get("/api/shop/available");
  const data = res as any;
 
  return data.shops || (Array.isArray(data) ? data : []);
};


export const getProducts = async (shopId?: string): Promise<Product[]> => {
  const url = shopId ? `api/products/shop/${shopId}` : "/products";
  const res = await api.get(url);
  const data = res as any;

  if (Array.isArray(data)) return data;
  return data.products || [];
};

export const getProductByBarcode = async (
  barcode: string
): Promise<Product> => {
  const res = await api.get(
    `/api/products/barcode/${encodeURIComponent(barcode)}`
  );
  const data = res as any;
  return data.product || data;
};

export const addProduct = async (data: Partial<Product>) => {
  return api.post("/api/products", data);
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  return api.put(`api/products/${id}`, data);
};

export const deleteProduct = async (id: string) => {
  return api.delete(`api/products/${id}`);
};


// Menu Cart APIs
export const addToCart = async (productId: string, quantity = 1, shopId?: string) => {
  const requestBody: any = {
    productId,
    quantity,
  };
  
  if (shopId) {
    requestBody.shopId = shopId;
  }
  
  return api.post("/api/menu/add-to-cart", requestBody);
};

export const getCart = async () => {
  const res = await api.get("/api/menu/cart");
  return res as any;
};

export const removeFromCart = async (productId: string) => {
  return api.delete(`/api/menu/cart/${productId}`);
};

export const updateCartItem = async (productId: string, quantity: number) => {
  return api.put(`/api/menu/cart/${productId}`, { quantity });
};

export const updateTableNumber = async (tableNumber: string) => {
  return api.put("/api/menu/table-number", { tableNumber });
};

// Retail Cart APIs (Regular Shop)
export const getRetailCart = async () => {
  const res = await api.get("/api/cart");
  return res as any;
};

export const addToRetailCart = async (productId: string, quantity = 1) => {
  return api.post("/api/cart", { productId, quantity });
};

export const updateRetailCartItem = async (productId: string, quantity: number) => {
  return api.put(`/api/cart/${productId}`, { quantity });
};

export const removeFromRetailCart = async (productId: string) => {
  return api.delete(`/api/cart/${productId}`);
};

export const placeOrder = async () => {
  return api.post("/api/orders/order");
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  return api.put(`/api/orders/${orderId}/status`, { status });
};

export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get("/api/shop/orders");
  const data = res as any;
  return data.orders || (Array.isArray(data) ? data : []);
};

export const getOrdersHistory = async (params?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Order[]> => {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.startDate) query.set("startDate", params.startDate);
  if (params?.endDate) query.set("endDate", params.endDate);

  const res = await api.get(`/api/orders/history?${query.toString()}`);
  const data = res as any;
  return data.orders || (Array.isArray(data) ? data : []);
};


export const createPayment = async (data: any) => {
  return api.post("/api/payments/create", data);
};

export default api;
