import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from "../../../../lib/api";
import { toast } from 'react-hot-toast';
import { Order } from "../../../../lib/api";
import { 
  Package, 
  Search,
  ChevronRight,
  Eye,
  X,
  Calendar,
  User,
  Filter,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  paid: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'sent out': 'bg-indigo-50 text-indigo-600 border-indigo-100',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    String(order._id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(order.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(order.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Orders</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage process and track outlet sales</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#561485]/10 w-64 transition-all"
            />
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <motion.tr 
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#561485] transition-colors">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">#{order.orderNumber || order._id.slice(-8)}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#561485]/5 rounded-full flex items-center justify-center text-[#561485]">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{order.customer?.name || 'Guest'}</p>
                      <p className="text-[9px] font-bold text-gray-400 truncate max-w-[150px]">{order.customer?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-gray-900 tracking-tight">₹{order.total?.toFixed(2)}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">{order.items?.length} Items</p>
                </td>
                <td className="px-8 py-6">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#561485]/5 transition-all ${
                      statusColors[order.status as keyof typeof statusColors] || 'bg-gray-50 text-gray-400 border-gray-100'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="sent out">Sent Out</option>
                  </select>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-[#561485] hover:bg-[#561485]/5 rounded-2xl transition-all"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching orders found</p>
          </div>
        )}
      </div>

      {/* Mobile Feed */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.map((order) => (
          <motion.div 
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm space-y-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#561485]/5 rounded-xl flex items-center justify-center text-[#561485]">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 uppercase">#{order.orderNumber || order._id.slice(-8)}</h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                statusColors[order.status as keyof typeof statusColors] || 'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-lg font-black text-gray-900 tracking-tight">₹{order.total?.toFixed(0)}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(order)}
                className="px-6 py-3 bg-[#561485] text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-[#561485]/20 flex items-center gap-2"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modern Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="relative p-8 md:p-12 bg-gradient-to-br from-[#561485] to-[#3C47BA] text-white">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-1.5 bg-white/10 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
                    Order Receipt
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">
                    #{selectedOrder.orderNumber || selectedOrder._id.slice(-8)}
                  </h2>
                  <div className="flex flex-wrap gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/60" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-white/60" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{selectedOrder.customer?.name || 'Guest User'}</span>
                    </div>
                    {selectedOrder.tableNumber && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-black uppercase tracking-widest text-white">
                          Table: {selectedOrder.tableNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 md:p-12 space-y-10">
                {/* Status Bar */}
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${
                      statusColors[selectedOrder.status as keyof typeof statusColors] || 'bg-gray-50 text-gray-400'
                    }`}>
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{selectedOrder.status}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update to:</span>
                    <div className="flex gap-2">
                      {selectedOrder.status !== 'paid' && (
                        <button 
                          onClick={() => handleStatusChange(selectedOrder._id, 'paid')}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Paid
                        </button>
                      )}
                      {selectedOrder.status !== 'sent out' && (
                        <button 
                          onClick={() => handleStatusChange(selectedOrder._id, 'sent out')}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Sent Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-6">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Summary</h5>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl group hover:border-[#561485]/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#561485] transition-colors">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 uppercase">{item.product?.name || 'Unknown Product'}</p>
                            <p className="text-[10px] font-bold text-gray-400">Qty: {item.quantity} × ₹{item.product?.price?.toFixed(0)}</p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-gray-900">₹{((item.product?.price || 0) * (item.quantity || 0)).toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                    <span className="text-sm font-bold">₹{selectedOrder.total?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#561485]">
                    <span className="text-[10px] font-black uppercase tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black tracking-tighter">₹{selectedOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#561485] transition-all flex items-center justify-center gap-3"
                >
                  Close Receipt <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
