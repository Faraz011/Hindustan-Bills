import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, CheckCircle, ChevronRight, Calendar, CreditCard, X } from "lucide-react";
import { getOrdersHistory } from "../../../../lib/api";

interface Order {
  _id: string;
  totalAmount?: number;
  total?: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await getOrdersHistory();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" };
      case "pending":
        return { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" };
      case "sent out":
        return { icon: Package, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" };
      default:
        return { icon: Package, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-100" };
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
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            Your Orders
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manage and track your shopping history</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-50 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Orders</p>
            <p className="text-xl font-black text-gray-900 leading-none tracking-tighter">{orders.length}</p>
          </div>
          <div className="w-10 h-10 bg-[#561485] rounded-xl flex items-center justify-center text-white">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="space-y-4">
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] border border-gray-50 shadow-sm"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-gray-100 text-gray-200">
              <Package className="h-12 w-12" />
            </div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No order history found</h3>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order, i) => {
              const config = getStatusConfig(order.status);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedOrder(order)}
                  className="group relative bg-white rounded-[2.5rem] border border-gray-50 p-6 md:p-8 hover:shadow-2xl hover:shadow-[#561485]/5 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${config.bg} ${config.color} border ${config.border} shadow-inner`}>
                      <config.icon className="w-8 h-8" />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-black text-[#561485] uppercase tracking-widest bg-[#561485]/5 px-3 py-1 rounded-full mb-2 inline-block">
                        Order #{order._id.slice(-6)}
                      </p>
                      <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        {order.items.length} Items Purchased
                      </h3>
                      <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                        <Calendar className="w-3 h-3 text-gray-300" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Amount</p>
                      <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{(order.totalAmount || order.total || 0).toFixed(0)}</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-2 text-right">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${config.bg} ${config.color} ${config.border}`}>
                        {order.status}
                      </span>
                      {order.paymentStatus && (
                        <span className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          <CreditCard className="w-2 h-2" />
                          {order.paymentStatus}
                        </span>
                      )}
                    </div>
                    <div className="hidden md:flex w-10 h-10 bg-gray-50 rounded-xl items-center justify-center text-gray-300 group-hover:bg-[#561485] group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Order Details Modal (Modern Backdrop) */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-br from-[#561485] to-[#3C47BA] text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Order Summary</h3>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Order Ref: {selectedOrder._id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Placement Date</p>
                    <p className="text-sm font-black text-gray-900 tracking-tight uppercase">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fulfillment</p>
                    <p className="text-sm font-black text-gray-900 tracking-tight uppercase">{selectedOrder.status}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-[#561485] uppercase tracking-widest px-1">Purchased Items ({selectedOrder.items.length})</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#561485]/5 rounded-xl flex items-center justify-center text-[#561485] font-black text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 tracking-tight uppercase">{item.product.name}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                              Qty: {item.quantity} × ₹{item.product.price}
                            </p>
                          </div>
                        </div>
                        <p className="text-base font-black text-gray-900 tracking-tighter">₹{(item.product.price * item.quantity).toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Total */}
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl shadow-black/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">Grand Total (Incl Tax)</p>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Payment {selectedOrder.paymentStatus || 'Verified'}</p>
                    </div>
                  </div>
                  <p className="text-3xl font-black tracking-tighter text-white">
                    ₹{(selectedOrder.totalAmount || selectedOrder.total || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-center">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-4 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-colors"
                >
                  Dismiss Summary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
