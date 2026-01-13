import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from "../../../../lib/api";
import { toast } from 'react-hot-toast';
import { Order } from "../../../../lib/api";
import { Package, Clock, CheckCircle, Eye, XCircle } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Orders</h1>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderNumber || order._id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customer?.name || 'Guest'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.total?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  #{order.orderNumber || order._id.substring(0, 8)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                  statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Customer Info */}
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Customer</p>
              <p className="text-sm text-gray-900">
                {order.customer?.name || 'Guest'}
              </p>
              <p className="text-xs text-gray-500">
                {order.customer?.email || 'No email'}
              </p>
            </div>

            {/* Order Details */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Items</p>
                <p className="text-sm text-gray-900">
                  {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)} items
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-700 mb-1">Total</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{order.total?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              onClick={() => setSelectedOrder(order)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </button>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-sm text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Order Details</h3>
                    <p className="text-blue-100 text-sm">
                      #{selectedOrder.orderNumber || selectedOrder._id.slice(-8)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-700">
                      Order Date
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-700">
                      Customer
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">
                      {selectedOrder.customer?.name || 'Guest'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.customer?.email || 'No email'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-700">
                    Status
                  </p>
                </div>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
                    statusColors[selectedOrder.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                  } shadow-sm`}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.product?.name || 'Unknown Product'}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹{item.product?.price?.toFixed(2) || '0.00'} × {item.quantity || 0}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{((item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900">
                      Total Amount
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{(selectedOrder.total || selectedOrder.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}