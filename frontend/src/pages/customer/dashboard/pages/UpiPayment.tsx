import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Info, 
  QrCode,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import api from "../../../../api/axios";

interface MenuCartData {
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  upiId?: string;
  shopName?: string;
}

export default function UpiPaymentPage() {
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
      console.log("Fetched Cart Data:", response);
      setCart(response as any);
    } catch (error) {
      console.error("Failed to fetch menu cart:", error);
      toast.error("Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  const handlePayViaApp = () => {
    const upiUri = getUpiUri();
    if (!upiUri) return;

    try {
      const upiLink = document.createElement('a');
      upiLink.href = upiUri;
      upiLink.style.display = 'none';
      document.body.appendChild(upiLink);
      upiLink.click();
      document.body.removeChild(upiLink);
      
      toast.success("Opening UPI App...");
    } catch (e) {
      console.error("Redirection error:", e);
      window.location.href = upiUri;
    }
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      const upiId = cart?.upiId || "9691383552@ybl";
      await api.post("/api/orders/create-from-cart", { upiId, paymentMode: 'collect' });
      toast.success("Order Placed! Please ensure payment is done.");
      navigate("/customer/dashboard/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Order placement failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const getUpiUri = () => {
    if (!cart) return "";
    const shopName = cart.shopName || "Merchant";
    const amount = cart.total;
    const upiId = cart.upiId || "merchant@upi";
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(shopName)}&am=${amount}&cu=INR&tn=Order_from_HindustanBills`;
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
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Safe Checkout</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Payment Main Area */}
        <section className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">Payment</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scan QR to pay via UPI app</p>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 p-10 bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <QrCode className="w-24 h-24" />
              </div>
              
              <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-100 shadow-inner">
                <QRCodeSVG 
                  value={getUpiUri()}
                  size={200}
                  level="H"
                  includeMargin={false}
                  className="rounded-xl"
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-[#561485] font-bold tracking-tighter uppercase">Scan to Pay</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  Pay <span className="text-[#561485]">₹{cart?.total?.toFixed(0)}</span> using any UPI app
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <button
                  onClick={handleConfirmOrder}
                  disabled={isProcessing || !cart}
                  className="py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-black/10 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      I've Paid <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            <div className="p-6 bg-[#561485]/5 rounded-2xl border border-[#561485]/10 flex gap-4">
              <Info className="w-5 h-5 text-[#561485] flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#561485] uppercase tracking-widest">How to play?</p>
                <p className="text-[10px] font-bold text-[#561485]/60 uppercase leading-relaxed tracking-wide">
                  1. Scan the QR code or click 'Open UPI App'.<br/>
                  2. Complete the payment in your bank app.<br/>
                  3. Click 'I've Paid' to finalize your order.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Card */}
        <section className="space-y-8">
          <div className="bg-white rounded-[3rem] border border-gray-50 p-10 shadow-xl shadow-[#561485]/5 flex flex-col gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order Summary</h3>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {cart?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-400">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-gray-600 uppercase tracking-tight">{item.name} <span className="text-[10px] text-gray-400">x{item.quantity}</span></span>
                    </div>
                    <span className="font-black text-gray-900">₹{((item.price || 0) * (item.quantity || 1)).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>₹{cart?.subtotal?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">Net Total</span>
                <span className="text-3xl font-black text-[#561485] tracking-tighter">₹{cart?.total?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Guaranteed Safety</p>
              <p className="text-xs font-bold text-emerald-600/60 uppercase tracking-tighter leading-none">P2P Verified Transaction</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
