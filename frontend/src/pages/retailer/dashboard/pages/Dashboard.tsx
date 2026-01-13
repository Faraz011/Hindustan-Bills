import { useEffect, useState } from "react";
import {
  getShopDetails,
  getShopProducts,
  getShopOrders,
} from "../../../../lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  Package, 
  ClipboardList, 
  TrendingUp, 
  Store, 
  ChevronRight, 
  Zap,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  isActive?: boolean;
}

interface Product {
  _id?: string;
  name: string;
  price: number;
  stock?: number;
  createdAt?: string;
}

interface Order {
  _id: string;
  total?: number;
  totalAmount?: number;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin"></div>
      </div>
    );
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  
  const currentMonthRevenue = orders
    .filter(o => new Date(o.createdAt) >= thirtyDaysAgo && (o.status === 'paid' || o.status === 'sent out'))
    .reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
  const previousMonthRevenue = orders
    .filter(o => {
      const date = new Date(o.createdAt);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo && (o.status === 'paid' || o.status === 'sent out');
    })
    .reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
  const revenueGrowth = calculateGrowth(currentMonthRevenue, previousMonthRevenue);

  // Order Stats
  const currentMonthOrders = orders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo).length;
  const previousMonthOrders = orders.filter(o => {
    const date = new Date(o.createdAt);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo;
  }).length;
  const orderGrowth = calculateGrowth(currentMonthOrders, previousMonthOrders);

  // Product Stats (Catalog Growth)
  const totalProducts = products.length;
  const newProductsThisMonth = (products as any[]).filter(p => new Date(p.createdAt) >= thirtyDaysAgo).length;
  const productGrowth = (totalProducts > 0) ? (newProductsThisMonth / totalProducts) * 100 : 0;

  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'sent out')
    .reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
  const recentOrders = orders.slice(0, 5);

  const containerStats = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemStats = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const stats = [
    { 
      label: 'Products Catalog', 
      val: totalProducts, 
      growth: productGrowth, 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      prefix: ''
    },
    { 
      label: 'Total Orders', 
      val: orders.length, 
      growth: orderGrowth, 
      icon: ClipboardList, 
      color: 'text-[#A13266]', 
      bg: 'bg-[#A13266]/5',
      prefix: ''
    },
    { 
      label: 'Net Revenue', 
      val: totalRevenue.toFixed(0), 
      growth: revenueGrowth, 
      icon: TrendingUp, 
      color: 'text-[#561485]', 
      bg: 'bg-[#561485]/5',
      prefix: '₹'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#561485] via-[#3C47BA] to-[#A13266] rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-[#561485]/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
              Manager View
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
              Scale Your <br /> <span className="text-white/50">Business.</span>
            </h1>
            <p className="text-sm font-bold text-white/60 uppercase tracking-widest max-w-md">
              Control your outlet, manage inventory, and track orders in real-time with premium tools.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/retailer/dashboard/products")}
              className="px-8 py-4 bg-white text-[#561485] rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button 
              onClick={() => navigate("/retailer/dashboard/orders")}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all flex items-center gap-2"
            >
              Recent Orders <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/20 rounded-full blur-[60px]" />
      </motion.section>

      {/* Stats Grid */}
      <motion.section 
        variants={containerStats}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemStats}
            className="group bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                stat.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {stat.growth >= 0 ? <Zap className="w-3 h-3" /> : <div className="w-3 h-3 border-2 border-current rounded-full flex items-center justify-center text-[6px]">V</div>} 
                Growth {stat.growth >= 0 ? '+' : ''}{stat.growth.toFixed(0)}%
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.prefix}{stat.val}</h3>
          </motion.div>
        ))}
      </motion.section>

      {/* outlet Info & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-white rounded-[2.5rem] border border-gray-50 p-8 space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#561485] rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-[#561485]/20">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#561485] uppercase tracking-widest">Store Profile</p>
              <h4 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">{shop?.name || "HB Store"}</h4>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</span>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{shop?.businessType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
              <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${shop?.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${shop?.isActive ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                {shop?.isActive ? 'Active Now' : 'Offline'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => navigate("/retailer/dashboard/shop")}
            className="w-full py-4 px-6 bg-gray-50 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            Manage Shop Details <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-50 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Activity</h3>
            <button 
              onClick={() => navigate("/retailer/dashboard/orders")}
              className="text-[10px] font-black text-[#561485] uppercase tracking-widest hover:underline"
            >
              View All Orders
            </button>
          </div>

          <div className="space-y-6">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="group flex items-center justify-between p-2 hover:bg-gray-50 rounded-2xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#561485] transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-gray-900 uppercase tracking-tight">Order #{order._id.slice(-8)}</h5>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">₹{(order.total || order.totalAmount || 0).toFixed(0)}</p>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      (order.status === 'paid' || order.status === 'sent out') ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <ClipboardList className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No activity yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
