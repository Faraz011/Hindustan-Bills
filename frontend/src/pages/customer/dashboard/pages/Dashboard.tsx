import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  CreditCard,
  TrendingUp,
  Store,
  ChevronRight,
  ArrowUpRight,
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
      setRecentOrders(orders.slice(0, 5));

      const totalSpent = orders.reduce(
        (sum: number, order: Order) => sum + (order.totalAmount || order.total || 0),
        0
      );

      setStats({
        totalOrders: orders.length,
        totalSpent,
        pendingOrders: orders.filter((o: Order) => o.status === "pending").length,
        completedOrders: orders.filter((o: Order) => o.status === "completed").length,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#561485] via-[#3C47BA] to-[#A13266] p-8 md:p-12 text-white shadow-2xl shadow-[#561485]/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none uppercase">
                Ready to Shop?
              </h1>
              <p className="text-white/80 text-lg font-medium max-w-md mb-8 tracking-tight">
                Select a store, scan your items, and experience the future of checkout-free billing.
              </p>
              <Link
                to="/customer/dashboard/select-shop"
                className="inline-flex items-center px-8 py-4 bg-white text-[#561485] font-black rounded-2xl hover:bg-gray-50 transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-tighter text-sm"
              >
                Start Scanning
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 flex items-center justify-center shadow-inner"
          >
            <Store className="w-24 h-24 md:w-32 md:h-32 text-white/40" />
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#A13266]/20 rounded-full blur-2xl"></div>
      </section>

      {/* Stats Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Your Activity Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", val: stats.totalOrders, icon: Package, color: "#561485" },
            { label: "Amount Spent", val: `₹${stats.totalSpent.toFixed(0)}`, icon: CreditCard, color: "#3C47BA" },
            { label: "Pending", val: stats.pendingOrders, icon: ShoppingCart, color: "#A13266" },
            { label: "Completed", val: stats.completedOrders, icon: TrendingUp, color: "#10B981" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: stat.color + '20', color: stat.color }}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">{stat.val}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Recent Orders</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Order History Tracker</p>
          </div>
          <Link 
            to="/customer/dashboard/orders" 
            className="text-xs font-black text-[#561485] uppercase tracking-tighter px-4 py-2 bg-[#561485]/5 rounded-xl hover:bg-[#561485]/10 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="p-4 md:p-8">
          {recentOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No recent activity detected</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/customer/dashboard/orders`}
                  className="flex items-center justify-between p-5 rounded-3xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#561485]/10 group-hover:text-[#561485] transition-all">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 tracking-tighter uppercase text-base">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900 tracking-tighter">
                      ₹{(order.totalAmount || order.total || 0).toFixed(2)}
                    </p>
                    <span 
                      className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        order.status === 'completed' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
