import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Receipt, 
  CreditCard, 
  ChevronRight,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import toast from "react-hot-toast";
import { getCart, updateCartItem, removeFromCart } from "../../../../lib/api";

interface MenuCartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  description?: string;
  shop?: {
    name: string;
  };
  taxRate: number;
  subtotal: number;
  tax: number;
  total: number;
}

interface MenuCartData {
  items: MenuCartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function MenuCartPage() {
  const [cart, setCart] = useState<MenuCartData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response);
    } catch (err: any) {
      console.error("Failed to fetch menu cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const changeQty = async (productId: string, qty: number) => {
    try {
      if (qty <= 0) {
        await remove(productId);
        return;
      }
      await updateCartItem(productId, qty);
      fetchCart();
    } catch (err: any) {
      toast.error("Update failed");
    }
  };

  const remove = async (productId: string) => {
    try {
      await removeFromCart(productId);
      fetchCart();
      toast.success("Item removed");
    } catch (err: any) {
      toast.error("Remove failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#561485]/10 border-t-[#561485] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-32 px-6 text-center space-y-8">
        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10 text-gray-200" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Your bag is empty</h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Delicious items are waiting for you in the menu</p>
        </div>
        <button
          onClick={() => navigate("/customer/dashboard/menu")}
          className="px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-[#561485] transition-all shadow-xl shadow-black/10 active:scale-95"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Premium Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-4">
          <button 
            onClick={() => navigate("/customer/dashboard/shopping")}
            className="group flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#561485] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </button>
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">Your Bag</h1>
            <p className="text-[10px] font-black text-[#A13266] uppercase tracking-[0.2em] leading-none">
              {cart.items.length} Items • {cart.items[0]?.shop?.name || "Premium Outlet"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</span>
            <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">₹{cart.total.toFixed(0)}</span>
          </div>
          <button 
            onClick={() => navigate("/customer/dashboard/upi-payment")}
            className="bg-gray-900 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-[#561485] transition-all shadow-2xl shadow-black/10 flex items-center gap-3 group"
          >
            Checkout <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item, i) => (
              <motion.div
                layout
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white rounded-[2.5rem] border border-gray-50 p-6 md:p-8 hover:shadow-2xl hover:shadow-[#561485]/5 transition-all flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden bg-gray-50 shadow-inner flex-shrink-0">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-[9px] font-black text-[#A13266] uppercase tracking-widest">{item.category || "Culinary"}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none">{item.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₹{item.price.toFixed(2)} per unit</p>
                </div>

                <div className="flex flex-row md:flex-col items-center gap-6 w-full md:w-auto">
                  <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                    <button
                      onClick={() => changeQty(item.productId, item.quantity - 1)}
                      className="p-3 text-gray-400 hover:text-rose-500 transition-colors disabled:opacity-20"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => changeQty(item.productId, item.quantity + 1)}
                      className="p-3 text-gray-400 hover:text-[#561485] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 md:flex-none text-right">
                    <p className="text-xl font-black text-gray-900 tracking-tighter leading-none">₹{item.total.toFixed(0)}</p>
                    <button 
                      onClick={() => remove(item.productId)}
                      className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline mt-1"
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total Summary Card */}
        <aside className="space-y-8">
          <div className="bg-white rounded-[3rem] border border-gray-50 p-10 shadow-xl shadow-[#561485]/5 space-y-8">
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-[#561485]" />
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Bill Summary</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Items Subtotal</span>
                <span className="text-gray-900">₹{cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Government Taxes</span>
                <span className="text-gray-900">₹{cart.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">Grand Total</span>
                <span className="text-3xl font-black text-[#561485] tracking-tighter">₹{cart.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/customer/dashboard/upi-payment")}
              className="w-full py-6 bg-gradient-to-r from-[#561485] to-[#3C47BA] text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-[#561485]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <CreditCard className="w-5 h-5" />
              Pay Successfully
            </button>

            <div className="flex items-center justify-center gap-2 opacity-30">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">Encrypted Checkout</span>
            </div>
          </div>

          <div 
            onClick={() => navigate("/customer/dashboard/shopping")}
            className="bg-[#561485]/5 rounded-[2.5rem] p-8 border border-dashed border-[#561485]/20 flex items-center gap-4 cursor-pointer group hover:bg-[#561485]/10 transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#561485] group-hover:scale-110 transition-transform">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#561485] uppercase tracking-widest leading-none mb-1">Missed something?</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-none">Add from scanner</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
