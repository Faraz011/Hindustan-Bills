// frontend/src/pages/customer/dashboard/pages/Orders.tsx
import { useState, useEffect } from "react";
import { Eye, Package, Clock, CheckCircle, XCircle } from "lucide-react";
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Package className="h-8 w-8 mr-3 text-blue-600" />
          My Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-xl border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start shopping to see your order history here!
            </p>
            <div className="text-4xl animate-bounce">🛒</div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="h-6 w-6 mr-3 text-blue-600" />
              Order History ({orders.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        • {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                        ₹{(order.totalAmount || order.total || 0).toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            order.status
                          )} shadow-sm`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        {order.paymentStatus && (
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${
                              order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {order.paymentStatus.charAt(0).toUpperCase() +
                              order.paymentStatus.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                      #{selectedOrder._id.slice(-8)}
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
                    {getStatusIcon(selectedOrder.status)}
                    <p className="text-sm font-semibold text-gray-700">
                      Status
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                      selectedOrder.status
                    )} shadow-sm`}
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Order Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
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
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹{item.product.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
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
                    ₹{(selectedOrder.totalAmount || selectedOrder.total || 0).toFixed(2)}
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
