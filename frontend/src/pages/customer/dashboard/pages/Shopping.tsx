import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanLine, Store, RefreshCw, ChevronLeft, LayoutGrid, Info } from "lucide-react";
import BarcodeScanner from "../components/BarcodeScanner";
import Cart from "./Cart";
import toast from "react-hot-toast";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

interface ScannedProduct {
  _id: string;
  barcode: string;
  name: string;
  price: number;
  stock: number;
  taxRate: number;
}

interface CartItem extends ScannedProduct {
  quantity: number;
  productId?: string;
}

interface SelectedShop {
  _id: string;
  name: string;
  businessType: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export default function ScannerPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sessionCode, setSessionCode] = useState<string>("");
  const [selectedShop, setSelectedShop] = useState<SelectedShop | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const shopData = localStorage.getItem("selectedShop");
    if (!shopData) {
      toast.error("Please select a shop before shopping");
      navigate("/customer/dashboard/select-shop");
      return;
    }

    try {
      const shop = JSON.parse(shopData);
      setSelectedShop(shop);
    } catch (error) {
      console.error("Error parsing selected shop:", error);
      toast.error("Invalid shop selection");
      navigate("/customer/dashboard/select-shop");
      return;
    }

    initializeSession();
  }, [navigate]);

  useEffect(() => {
    if (sessionCode) {
      loadSessionProducts();
    }
  }, [sessionCode]);

  const loadSessionProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/barcode/session/${sessionCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("hb_token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        const products = data.products.map((item: any) => ({
          _id: item._id,
          productId: item.product._id,
          barcode: item.product.barcode,
          name: item.product.name,
          price: item.product.price,
          stock: item.product.stock,
          taxRate: item.product.taxRate || 0,
          quantity: item.quantity,
        }));
        setCartItems(products);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const initializeSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/cart/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSessionCode(data.sessionCode);
      }
    } catch (error) {
      console.error("Error initializing session:", error);
      toast.error("Session failed to start");
    }
  };

  const handleProductDetected = async (product: ScannedProduct) => {
    try {
      const response = await fetch(`${API_BASE}/api/barcode/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
        },
        body: JSON.stringify({
          barcode: product.barcode,
          sessionCode,
          quantity: 1,
          shopId: selectedShop?._id,
        }),
      });
      if (response.ok) {
        await loadSessionProducts();
        toast.success(`${product.name} added`);
      }
    } catch (error) {
      toast.error("Scan failed");
    }
  };

  const updateQuantity = async (scannedProductId: string, quantity: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/barcode/session/${sessionCode}/${scannedProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
        },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        setCartItems(cartItems.map(item => item._id === scannedProductId ? { ...item, quantity } : item));
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const removeItem = async (scannedProductId: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/barcode/session/${sessionCode}/${scannedProductId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("hb_token")}` },
      });
      if (response.ok) {
        setCartItems(cartItems.filter(item => item._id !== scannedProductId));
        toast.success("Removed");
      }
    } catch (error) {
      toast.error("Remove failed");
    }
  };

  const handleCheckout = async () => {
    try {
      const convertRes = await fetch(`${API_BASE}/api/cart/convert-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
        },
        body: JSON.stringify({ sessionCode }),
      });
      if (!convertRes.ok) throw new Error("Conversion failed");

      const checkoutRes = await fetch(`${API_BASE}/api/orders/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
        },
      });
      if (checkoutRes.ok) {
        toast.success("Order Placed!");
        navigate("/customer/dashboard/orders");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Mini Breadcrumb Header */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => navigate("/customer/dashboard/select-shop")}
          className="group flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#561485] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Store Selection
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Shopping Session</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
        {/* Scanner & Store Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Store Card (Minimal) */}
          {selectedShop && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#561485]/10 rounded-2xl flex items-center justify-center text-[#561485]">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none">{selectedShop.name}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {selectedShop.address.city}, {selectedShop.address.state}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session ID</p>
                <code className="text-[10px] font-bold text-[#561485] bg-[#561485]/5 px-2 py-1 rounded-lg">
                  {sessionCode || "Initializing..."}
                </code>
              </div>
            </motion.section>
          )}

          {/* Scanner UI */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <ScanLine className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm">Product Scanner</h3>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
              </div>
            </div>
            <div className="p-4 md:p-8 aspect-video relative">
              <BarcodeScanner
                onProductDetected={handleProductDetected}
                onError={(err) => toast.error(err)}
                shopId={selectedShop?._id}
              />
              {/* Scan Overlay Hints */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-64 h-64 border-2 border-dashed border-white/20 rounded-3xl mb-4"></div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Align barcode within frame</p>
              </div>
            </div>
            <div className="p-6 bg-white/5 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white/40">
                <Info className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Auto Flash Enabled</span>
              </div>
              <div className="flex items-center gap-2 text-white/40">
                <LayoutGrid className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Resolution HD</span>
              </div>
            </div>
          </motion.section>

          {/* Help/Support (Minimal) */}
          <div className="p-8 bg-white rounded-[2rem] border border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Connection Stable</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Real-time sync active</p>
              </div>
            </div>
            <button className="text-[10px] font-black text-[#561485] uppercase tracking-tighter bg-[#561485]/5 px-4 py-2 rounded-xl">Need Support?</button>
          </div>
        </div>

        {/* Live Cart Summary */}
        <div className="lg:col-span-5 h-full">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-28"
          >
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={handleCheckout}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
