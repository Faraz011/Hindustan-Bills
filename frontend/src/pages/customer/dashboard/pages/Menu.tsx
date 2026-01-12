import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Leaf,
  Flame,
  Plus,
  Minus,
  ShoppingCart,
  ChefHat,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../api/axios";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  dietaryInfo?: string[];
  preparationTime?: number;
  isAvailable: boolean;
}


const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const selectedShopString = localStorage.getItem("selectedShop");
      if (!selectedShopString) {
        navigate("/customer/dashboard/select-shop");
        return;
      }

      const selectedShop = JSON.parse(selectedShopString);
      const response = await api.get(`/api/products/shop/${selectedShop._id}`);
      setProducts(response.data as Product[]);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const selectedShopString = localStorage.getItem("selectedShop");
      if (!selectedShopString) {
        toast.error("Please select a shop first");
        return;
      }

      const selectedShop = JSON.parse(selectedShopString);
      const product = products.find((p) => p._id === productId);
      if (!product) {
        toast.error("Product not found");
        return;
      }

      const quantity = getCartQuantity(productId);
      const response = await fetch(`${API_BASE}/api/menu/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
        },
        body: JSON.stringify({
          productId,
          quantity: quantity,
          shopId: selectedShop._id,
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
        // Reset quantity to 1 after adding to cart
        setCart((prevCart) => ({
          ...prevCart,
          [productId]: 1,
        }));
        toast.success(`${quantity} x ${product.name} added to cart`);
        // Navigate to menu cart page
        navigate("/customer/dashboard/menu-cart");
      } else {
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: 1,
      }));
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: quantity,
      }));
    }
  };

  const getCartQuantity = (productId: string) => {
    return cart[productId] || 1;
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const increaseQuantity = (productId: string) => {
    const currentQuantity = getCartQuantity(productId);
    updateQuantity(productId, currentQuantity + 1);
  };

  const getDietaryIcon = (dietaryInfo?: string[]) => {
    if (!dietaryInfo || dietaryInfo.length === 0) return null;

    if (dietaryInfo.includes("vegetarian"))
      return <Leaf className="w-4 h-4 text-green-500" />;
    if (dietaryInfo.includes("vegan"))
      return <Leaf className="w-4 h-4 text-green-600" />;
    if (dietaryInfo.includes("spicy"))
      return <Flame className="w-4 h-4 text-red-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#561485]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEAEA]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Restaurant Menu
              </h1>
            </div>
            <button
              onClick={() => navigate("/customer/dashboard/menu-cart")}
              className="relative bg-gradient-to-r from-[#561485] to-[#3C47BA] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3 font-semibold"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart ({getTotalItems()})
              {getTotalItems() > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#A13266] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {getTotalItems()}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={product.image || "/placeholder-product.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-bold text-lg bg-[#A13266] px-4 py-2 rounded-full shadow-lg">
                      Unavailable
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1">
                    {product.name}
                  </h3>
                  {getDietaryIcon(product.dietaryInfo || [])}
                </div>

                {product.description && (
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.preparationTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-full">
                      <Clock className="w-4 h-4" />
                      {product.preparationTime} min
                    </div>
                  )}
                </div>

                {product.dietaryInfo && product.dietaryInfo.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.dietaryInfo.map((diet) => (
                      <span
                        key={diet}
                        className="px-3 py-1 bg-gradient-to-r from-green-50 to-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                )}

                {product.isAvailable ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            Math.max(1, getCartQuantity(product._id) - 1)
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={getCartQuantity(product._id) <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="w-16 text-center">
                        <span className="text-xl font-bold text-gray-900">
                          {getCartQuantity(product._id)}
                        </span>
                      </div>
                      <button
                        onClick={() => increaseQuantity(product._id)}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#561485] to-[#3C47BA] hover:from-[#561485]/90 hover:to-[#3C47BA]/90 text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => addToCart(product._id)}
                      className="bg-gradient-to-r from-[#A13266] to-[#561485] text-white px-6 py-3 rounded-xl hover:from-[#A13266]/90 hover:to-[#561485]/90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                    >
                      Add to Cart
                    </button>
                  </div>
                ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
};

export default MenuPage;
