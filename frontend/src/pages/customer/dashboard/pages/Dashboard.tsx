// frontend/src/pages/customer/dashboard/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  CreditCard,
  TrendingUp,
  Store,
} from "lucide-react";
import { getOrdersHistory } from "../../../../lib/api";

interface Order {
  _id: string;
  totalAmount?: number;
  total?: number;
  status: string;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const orders = await getOrdersHistory();
      setRecentOrders(orders.slice(0, 5)); // Get last 5 orders

      // Calculate stats
      const totalOrders = orders.length;
      const totalSpent = orders.reduce(
        (sum: number, order: Order) => sum + (order.totalAmount || order.total || 0),
        0
      );
      const pendingOrders = orders.filter(
        (order: Order) => order.status === "pending"
      ).length;
      const completedOrders = orders.filter(
        (order: Order) => order.status === "completed"
      ).length;

      setStats({
        totalOrders,
        totalSpent,
        pendingOrders,
        completedOrders,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#561485]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#561485] rounded-full"></div>
          <div className="w-3 h-3 bg-[#3C47BA] rounded-full"></div>
          <div className="w-3 h-3 bg-[#A13266] rounded-full"></div>
        </div>
      </div>

      {/* Start Shopping Card */}
      <div className="bg-gradient-to-r from-[#561485] to-[#3C47BA] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Ready to Shop?</h2>
            <p className="text-white/90 mb-6 text-lg">
              Select a shop and start scanning products with your camera
            </p>
            <Link
              to="/customer/dashboard/select-shop"
              className="inline-flex items-center px-6 py-3 bg-white text-[#561485] font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Store className="h-5 w-5 mr-3" />
              Select Shop & Start Shopping
            </Link>
          </div>
          <div className="hidden lg:block ml-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Store className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-xl shadow-lg">
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-[#3C47BA] to-[#561485] rounded-xl shadow-lg">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600">
                Total Spent
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{stats.totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-[#A13266] to-[#561485] rounded-xl shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600">
                Pending Orders
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-[#561485] to-[#A13266] rounded-xl shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600">
                Completed Orders
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completedOrders}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-lg flex items-center justify-center mr-3">
              <Package className="h-4 w-4 text-white" />
            </div>
            Recent Orders
          </h2>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2 font-medium">No orders yet</p>
              <p className="text-gray-400">
                Start shopping to see your orders here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 hover:border-[#561485] bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""} •{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">
                      ₹{(order.totalAmount || order.total || 0).toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
