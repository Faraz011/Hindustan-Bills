import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  Info, 
  ChevronRight,
  Smartphone,
  QrCode,
  ExternalLink,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../api/axios";

interface MenuCartData {
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  shopUpiId?: string;
}

export default function UpiPaymentPage() {
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState<MenuCartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMode, setPaymentMode] = useState<'intent' | 'collect'>('intent');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/api/menu/cart");
      setCart(response as any);
    } catch (error) {
      console.error("Failed to fetch menu cart:", error);
      toast.error("Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  const generateIntentLink = () => {
    if (!cart?.shopUpiId || !cart?.total) return "";
    const merchantName = encodeURIComponent("Hindustan Bills Merchant");
    const amount = cart.total.toFixed(2);
    const transactionNote = encodeURIComponent(`Order_HB_${Date.now()}`);
    return `upi://pay?pa=${cart.shopUpiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${transactionNote}`;
  };

  const handleIntentPay = async () => {
    const link = generateIntentLink();
    if (!link) {
      toast.error("Retailer UPI details missing");
      return;
    }

    // Submit order first so retailer sees it
    setIsProcessing(true);
    try {
      await api.post("/api/orders/create-from-cart", { upiId: cart?.shopUpiId, paymentMode: 'intent' });
      
      // Attempt to open UPI App
      window.location.href = link;
      
      toast.success("Opening UPI App...");
      // Wait a bit then redirect to orders
      setTimeout(() => {
        navigate("/customer/dashboard/orders");
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCollectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    setIsProcessing(true);
    try {
      await api.post("/api/orders/create-from-cart", { upiId, paymentMode: 'collect' });
      toast.success("Payment Request Sent!");
      navigate("/customer/dashboard/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment request failed");
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
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <section className="flex items-center justify-between px-2">
        <button 
          onClick={() => navigate("/customer/dashboard/menu-cart")}
          className="group flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#561485] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Review Cart
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure Flow</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Payment Options */}
        <section className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">Checkout</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Powered by Hindustan Bills P2P Flow</p>
          </div>

          {/* Mode Selector */}
          <div className="flex bg-gray-50 p-1.5 rounded-[1.5rem] border border-gray-100">
            <button 
              onClick={() => setPaymentMode('intent')}
              className={`flex-1 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${paymentMode === 'intent' ? 'bg-white shadow-xl shadow-black/5 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Express Intent
            </button>
            <button 
              onClick={() => setPaymentMode('collect')}
              className={`flex-1 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${paymentMode === 'collect' ? 'bg-white shadow-xl shadow-black/5 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Collect Request
            </button>
          </div>

          <AnimatePresence mode="wait">
            {paymentMode === 'intent' ? (
              <motion.div
                key="intent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'PhonePe', color: 'bg-[#5f259f]' },
                    { name: 'GPay', color: 'bg-[#4285F4]' },
                    { name: 'Paytm', color: 'bg-[#00BAF2]' }
                  ].map((app) => (
                    <div key={app.name} className="flex flex-col items-center gap-3">
                      <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/5`}>
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{app.name}</span>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <QrCode className="w-32 h-32" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Safe & Direct</p>
                        <p className="text-base font-black tracking-tight">Pay via UPI App</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 font-medium leading-relaxed">
                      This will open your default UPI app to pay directly to the retailer. No extra fees, instant settlement.
                    </p>
                  </div>
                  <button
                    onClick={handleIntentPay}
                    disabled={isProcessing || !cart?.shopUpiId}
                    className="w-full py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-white/5"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Pay ₹{cart?.total.toFixed(0)} <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="collect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCollectSubmit}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 font-black">Your UPI Identifier</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                      <Zap className={`w-5 h-5 transition-colors ${upiId.includes('@') ? 'text-[#561485]' : 'text-gray-300'}`} />
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full pl-16 pr-6 py-6 bg-white border-2 border-gray-100 rounded-[2rem] text-lg font-black tracking-tight focus:border-[#561485] focus:ring-4 focus:ring-[#561485]/5 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="p-6 bg-[#561485]/5 rounded-2xl border border-[#561485]/10 flex gap-4">
                  <Info className="w-5 h-5 text-[#561485] flex-shrink-0" />
                  <p className="text-[10px] font-bold text-[#561485]/60 uppercase leading-relaxed tracking-wide">
                    Retailer will send a collect request to this ID. You'll need to open your app and approve it.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !upiId.trim()}
                  className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-black/10 hover:bg-[#561485] transition-all"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send Request <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </section>

        {/* Summary Card */}
        <section className="space-y-8">
          <div className="bg-white rounded-[3rem] border border-gray-50 p-10 shadow-xl shadow-[#561485]/5 flex flex-col gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order Summary</h3>
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {cart?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-400">0{idx + 1}</span>
                      <span className="font-bold text-gray-600 uppercase tracking-tight">{item.name} <span className="text-[10px] text-gray-400">x{item.quantity}</span></span>
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
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">Net Total</span>
                <span className="text-3xl font-black text-[#561485] tracking-tighter">₹{cart?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Guaranteed Safety</p>
              <p className="text-xs font-bold text-emerald-600/60 uppercase tracking-tighter leading-none">Verified Merchant Account</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
