import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanLine, Store, RefreshCw, Camera } from "lucide-react";
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
  productId?: string; // Product._id for reference
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

  // Check for selected shop on component mount
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
      toast.error("Invalid shop selection. Please select a shop again.");
      navigate("/customer/dashboard/select-shop");
      return;
    }

    initializeSession();
  }, [navigate]);

  // Load session products when session code is available
  useEffect(() => {
    if (sessionCode) {
      loadSessionProducts();
    }
  }, [sessionCode]);

  const loadSessionProducts = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/barcode/session/${sessionCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (response.ok) {
        // Update local cart state with session products
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
      console.error("Error loading session products:", error);
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSessionCode(data.sessionCode);
      console.log(" Session initialized:", data.sessionCode);
    } catch (error) {
      console.error("Error initializing session:", error);
      toast.error(
        "Failed to start shopping session. Please check if the backend server is running."
      );
    }
  };

  const handleProductDetected = async (product: ScannedProduct) => {
    try {
      if (product._id.startsWith("mock")) {
        console.log(" Adding mock product to cart:", product);
        setCartItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item._id === product._id
          );

          if (existingItem) {
            return prevItems.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            // Add new item
            return [...prevItems, { ...product, quantity: 1 }];
          }
        });
        toast.success(`Added ${product.name} to cart!`);
        return;
      }

      // Real API call for non-mock products
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || response.statusText}`
        );
      }

      const data = await response.json();

      if (response.ok) {
        // Reload session products to update cart
        await loadSessionProducts();
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error(data.message || "Failed to scan product");
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Failed to scan product");
    }
  };

  // Update item quantity
  const updateQuantity = async (scannedProductId: string, quantity: number) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/barcode/session/${sessionCode}/${scannedProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (response.ok) {
        setCartItems(
          cartItems.map((item) =>
            item._id === scannedProductId ? { ...item, quantity } : item
          )
        );
      } else {
        const errorText = await response.text();
        toast.error(
          `Failed to update quantity: ${errorText || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Remove item from cart
  const removeItem = async (scannedProductId: string) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/barcode/session/${sessionCode}/${scannedProductId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
          },
        }
      );

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item._id !== scannedProductId));
        toast.success("Item removed from cart");
      } else {
        const errorText = await response.text();
        toast.error(
          `Failed to remove item: ${errorText || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error("Failed to remove item");
    }
  };

  // Proceed to checkout
  const handleCheckout = async () => {
    try {
      // First convert session to cart
      const convertResponse = await fetch(
        `${API_BASE}/api/cart/convert-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
          },
          body: JSON.stringify({
            sessionCode,
          }),
        }
      );

      if (!convertResponse.ok) {
        const errorText = await convertResponse.text();
        throw new Error(
          `Failed to convert session to cart: ${
            errorText || convertResponse.statusText
          }`
        );
      }

      // Now proceed with checkout using the cart
      const checkoutResponse = await fetch(`${API_BASE}/api/orders/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
        },
      });

      if (!checkoutResponse.ok) {
        const errorText = await checkoutResponse.text();
        throw new Error(
          `Checkout failed: ${errorText || checkoutResponse.statusText}`
        );
      }

      const checkoutData = await checkoutResponse.json();

      if (checkoutResponse.ok) {
        toast.success("Order placed successfully!");
        // Clear local cart and redirect to orders page
        setCartItems([]);
        // You might want to redirect to orders page or receipt
        window.location.href = "/customer/dashboard/orders";
      } else {
        throw new Error(checkoutData.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Checkout failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-full flex items-center justify-center shadow-xl">
              <ScanLine className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#561485] to-[#3C47BA] bg-clip-text text-transparent mb-6">
            Smart Shopping
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scan products with your camera and pay instantly
          </p>
        </motion.div>

        {/* Selected Shop Display */}
        {selectedShop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-10 max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-full flex items-center justify-center shadow-lg">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Shopping at: {selectedShop.name}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    {selectedShop.address.street},{" "}
                    {selectedShop.address.city}, {selectedShop.address.state}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/customer/dashboard/select-shop")}
                className="bg-gradient-to-r from-[#A13266] to-[#561485] text-white px-6 py-3 rounded-xl hover:from-[#A13266]/90 hover:to-[#561485]/90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
              >
                Change Shop
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Scanner Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#561485] to-[#3C47BA] p-8">
                <h2 className="text-2xl font-bold text-white flex items-center mb-3">
                  Product Scanner
                </h2>
                <p className="text-white/90 text-lg">
                  Point your camera at a barcode or use manual entry
                </p>
              </div>
              <div className="p-8">
                <BarcodeScanner
                  onProductDetected={handleProductDetected}
                  onError={(err) => toast.error(err)}
                  shopId={selectedShop?._id}
                />
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="sticky top-6">
              <Cart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
              />
            </div>
          </motion.div>
        </div>

        {/* Session Info */}
        {sessionCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
              <RefreshCw className="h-5 w-5 text-[#561485] mr-3" />
              <span className="text-gray-600 mr-3 font-medium">
                Active Session:
              </span>
              <code className="bg-gradient-to-r from-[#561485]/10 to-[#3C47BA]/10 text-[#561485] px-4 py-2 rounded-full text-sm font-mono font-semibold">
                {sessionCode}
              </code>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
