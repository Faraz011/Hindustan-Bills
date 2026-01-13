import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, ShieldCheck, Zap, Info, ChevronRight } from "lucide-react";
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
    if (!upiId.trim() || !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/customer/dashboard/menu-cart");
      return;
    }

    setIsProcessing(true);
    try {
      await api.post("/api/orders/create-from-cart", { upiId });
      toast.success("Order Placed Successfully!");
      navigate("/customer/dashboard/orders");
    } catch (error: any) {
      console.error("Payment failed:", error);
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
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
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <section className="flex items-center justify-between px-2">
        <button 
          onClick={() => navigate("/customer/dashboard/menu-cart")}
          className="group flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#561485] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Review Cart
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure Checkout</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Payment Form */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Checkout</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Enter your payment details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">UPI Identifier</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <Zap className={`w-5 h-5 transition-colors ${upiId.includes('@') ? 'text-[#561485]' : 'text-gray-300'}`} />
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full pl-16 pr-6 py-6 bg-white border-2 border-gray-100 rounded-[2rem] text-lg font-black tracking-tight focus:border-[#561485] focus:ring-4 focus:ring-[#561485]/5 transition-all outline-none"
                  disabled={isProcessing}
                />
                <AnimatePresence>
                  {upiId.includes('@') && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-6 bg-[#561485]/5 rounded-[2rem] border border-[#561485]/10 flex gap-4">
              <Info className="w-5 h-5 text-[#561485] flex-shrink-0" />
              <p className="text-[10px] font-bold text-[#561485]/60 uppercase leading-relaxed tracking-wide">
                Ensure you have the UPI app installed on your phone to approve the payment request once submitted.
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !upiId.trim()}
              className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:bg-[#561485] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Pay ₹{cart?.total.toFixed(0)}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Order Summary Side */}
        <section className="bg-white rounded-[3rem] border border-gray-50 p-10 shadow-xl shadow-[#561485]/5 flex flex-col gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order Summary</h3>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {cart?.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-300">0{idx + 1}</span>
                    <span className="font-bold text-gray-600 uppercase tracking-tight">{item.name} <span className="text-[10px] text-gray-300">x{item.quantity}</span></span>
                  </div>
                  <span className="font-black text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-50">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>₹{cart?.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Taxes</span>
              <span>₹{cart?.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">Net Total</span>
              <span className="text-3xl font-black text-[#561485] tracking-tighter">₹{cart?.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-gray-50 flex items-center justify-between opacity-40">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">Instant Settlement</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
