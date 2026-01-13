import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ShoppingBag, Receipt } from "lucide-react";

interface CartItem {
  _id: string;
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  taxRate: number;
  productId?: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (scannedProductId: string, quantity: number) => void;
  onRemoveItem: (scannedProductId: string) => void;
  onCheckout: () => void;
}

export default function Cart({
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const [summary, setSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    let subtotal = 0;
    let tax = 0;
    items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      const itemTax = itemSubtotal * item.taxRate;
      subtotal += itemSubtotal;
      tax += itemTax;
    });
    setSummary({ subtotal, tax, total: subtotal + tax });
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-50 p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <ShoppingBag className="h-10 w-10 text-gray-200" />
        </div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Your bag is empty</h3>
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-2">Start scanning to add items</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-xl shadow-[#561485]/5 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-8 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#561485]/5 rounded-xl text-[#561485]">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Your Cart</h2>
          </div>
          <span className="text-[10px] font-black bg-[#561485] text-white px-3 py-1 rounded-full uppercase tracking-widest">
            {items.length} Units
          </span>
        </div>
      </div>

      {/* Items Scroll Area */}
      <div className="flex-1 overflow-y-auto max-h-[400px] p-6 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              layout
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className="group bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-[#561485]/5 border border-transparent hover:border-gray-100 rounded-3xl p-5 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none">{item.name}</h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">₹{item.price.toFixed(2)} / unit</p>
                </div>
                <button
                  onClick={() => {
                    onRemoveItem(item._id);
                    toast.success("Item removed");
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center bg-white rounded-2xl border border-gray-100 p-1 shadow-sm">
                  <button
                    onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-[10px] font-black text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    className="p-2 text-gray-400 hover:text-[#561485] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900 tracking-tighter leading-none">
                    ₹{(item.price * item.quantity * (1 + item.taxRate)).toFixed(2)}
                  </p>
                  <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Incl. Tax</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary & Checkout */}
      <div className="p-8 bg-gray-50/50 border-t border-gray-50 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <span>Subtotal</span>
            <span className="text-gray-900">₹{summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <span>GST / Taxes</span>
            <span className="text-gray-900">₹{summary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#561485]" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-900">Total Payable</span>
            </div>
            <span className="text-xl font-black text-[#561485] tracking-tighter">₹{summary.total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full py-5 bg-gradient-to-r from-[#561485] to-[#3C47BA] text-white rounded-[1.5rem] font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-3 shadow-xl shadow-[#561485]/20 hover:shadow-[#561485]/40 transition-all active:scale-95"
        >
          <CreditCard className="w-4 h-4" />
          Checkout Securely
        </button>
      </div>
    </div>
  );
}
