import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../api/axios";

interface MenuCartData {
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function UpiPaymentPage() {
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState<MenuCartData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/api/menu/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch menu cart:", error);
      toast.error("Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }

    if (!upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    // Check if cart data is available
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty. Please add items before proceeding.");
      navigate("/customer/dashboard/menu-cart");
      return;
    }

    setIsProcessing(true);

    try {
      // Log the data being sent
      const requestData = { upiId };
      console.log("Sending order creation request:", requestData);
      console.log("Cart data:", cart);

      const response = await api.post("/api/orders/create-from-cart", requestData);

      console.log("Order creation response:", response.data);
      toast.success("Order created successfully!");
      navigate("/customer/dashboard/orders");
    } catch (error: any) {
      console.error("Payment failed:", error);
      
      // Enhanced error logging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        
        // Handle HTML error responses (like from Express error handler)
        let errorMessage = "Payment failed. Please try again.";
        
        if (typeof error.response.data === 'string') {
          // Parse HTML error response
          const htmlContent = error.response.data;
          const preMatch = htmlContent.match(/<pre>([\s\S]*?)<\/pre>/);
          if (preMatch) {
            const errorText = preMatch[1];
            // Extract the actual error message
            const errorMatch = errorText.match(/Error: (.+?)<br>/);
            if (errorMatch) {
              errorMessage = errorMatch[1];
              
              // Provide user-friendly message for stock issues
              if (errorMessage.includes("Insufficient stock")) {
                errorMessage = "One or more items in your cart are out of stock. Please remove them or reduce quantity.";
              }
            }
          }
        } else if (error.response.data) {
          // Handle JSON error responses
          errorMessage = error.response.data?.message || 
                         error.response.data?.error || 
                         error.response.data?.details ||
                         "Payment failed. Please try again.";
        }
        
        toast.error(errorMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Request setup error:", error.message);
        toast.error("Request setup error. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/customer/dashboard/menu-cart")}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">UPI Payment</h1>
              <p className="text-gray-600">
                Enter your UPI ID to complete the payment
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* UPI ID Input */}
            <div>
              <label
                htmlFor="upiId"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#561485] focus:ring-4 focus:ring-[#561485]/10 transition-all duration-200 outline-none"
                  disabled={isProcessing}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <CheckCircle
                    className={`w-5 h-5 ${
                      upiId.includes("@") ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter your UPI ID (e.g., yourname@paytm, yourname@ybl)
              </p>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Summary
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#561485]"></div>
                </div>
              ) : cart ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      ₹{cart.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold text-gray-900">
                      ₹{cart.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900">Total Amount:</span>
                      <span className="text-[#561485]">
                        ₹{cart.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Unable to load cart data
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !upiId.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#A13266] to-[#561485] text-white font-bold text-lg rounded-xl hover:from-[#A13266]/90 hover:to-[#561485]/90 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Payment...
                </div>
              ) : (
                "Pay Now"
              )}
            </button>

            <p className="text-sm text-gray-500 text-center">
              Your payment is secured with bank-level encryption
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
