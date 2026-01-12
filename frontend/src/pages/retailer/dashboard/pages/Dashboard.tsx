// frontend/src/pages/retailer/dashboard/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import {
  getShopDetails,
  getShopProducts,
  getShopOrders,
} from "../../../../lib/api";
import { toast } from "react-hot-toast";
import { Package, ClipboardList, TrendingUp } from "lucide-react";

interface Shop {
  _id: string;
  name: string;
  businessType: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  isActive: boolean;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock?: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [shopData, productsData, ordersData] = await Promise.all([
          getShopDetails(),
          getShopProducts(),
          getShopOrders(),
        ]);

        setShop(shopData);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your shop.
        </p>
      </div>

      {/* Shop Status */}
      {shop && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {shop.name}
              </h2>
              <p className="text-gray-600">{shop.businessType}</p>
              {shop.address && (
                <p className="text-gray-500 text-sm">
                  {shop.address.city}, {shop.address.state}
                </p>
              )}
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                shop.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {shop.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-blue-700">
                Total Products
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <ClipboardList className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-green-700">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-green-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-yellow-700">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-yellow-900">
                ₹{totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <ClipboardList className="h-6 w-6 mr-3 text-blue-600" />
            Recent Orders
          </h3>
        </div>
        <div className="p-6">
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300 bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ClipboardList className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">
                      ₹{order.totalAmount?.toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No orders yet</p>
              <p className="text-gray-400">
                Orders will appear here once customers start shopping!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
