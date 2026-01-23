import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  Search,
  Plus,
  Minus,
  Star,
  Clock,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { getProducts, addToCart as addToCartAPI, Product, getCart, updateCartItem, removeFromCart } from "../../../../lib/api";

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dbCart, setDbCart] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const selectedShopString = localStorage.getItem("selectedShop");
      if (!selectedShopString) {
        navigate("/customer/dashboard/select-shop");
        return;
      }

      const selectedShop = JSON.parse(selectedShopString);
      const [productsData, cartData] = await Promise.all([
        getProducts(selectedShop._id),
        getCart(),
      ]);

      setProducts(productsData);
      setDbCart(cartData);
      
      const quantities: { [key: string]: number } = {};
      if (cartData && cartData.items) {
        cartData.items.forEach((item: any) => {
          quantities[item.productId] = item.quantity;
        });
      }
      setCartQuantities(quantities);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category || "Uncategorized"))
    );
    return ["All", ...uniqueCategories.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = String(p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = async (productId: string) => {
    try {
      const selectedShopString = localStorage.getItem("selectedShop");
      if (!selectedShopString) return;
      const selectedShop = JSON.parse(selectedShopString);

      await addToCartAPI(productId, 1, selectedShop._id);
      setCartQuantities((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));

      const updatedCart = await getCart();
      setDbCart(updatedCart);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add");
    }
  };

  const handleUpdateQuantity = async (productId: string, delta: number) => {
    try {
      const currentQty = cartQuantities[productId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === currentQty) return;

      if (delta > 0) {
        const selectedShopString = localStorage.getItem("selectedShop");
        if (!selectedShopString) return;
        const selectedShop = JSON.parse(selectedShopString);
        await addToCartAPI(productId, 1, selectedShop._id);
      } else {
        if (newQty === 0) {
          await removeFromCart(productId);
        } else {
          await updateCartItem(productId, newQty);
        }
      }

      setCartQuantities((prev) => ({ ...prev, [productId]: newQty }));
      const updatedCart = await getCart();
      setDbCart(updatedCart);
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#561485]/10 border-t-[#561485] rounded-full animate-spin"></div>
          <ChefHat className="absolute inset-0 m-auto text-[#561485] w-6 h-6 animate-pulse" />
        </div>
      </div>
    );
  }

  const selectedShop = JSON.parse(localStorage.getItem("selectedShop") || "{}");

  return (
    <div className="min-h-screen bg-white pb-32 overflow-x-hidden relative">
      {/* Premium Hero Banner */}
      <section className="relative h-72 md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://res.cloudinary.com/dvui49kut/image/upload/v1768389417/gettyimages-1372697005-612x612_pqzjsl.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-16 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-2 md:space-y-4"
          >
            <button 
              onClick={() => navigate("/customer/dashboard/select-shop")}
              className="group flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-widest hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Change Outlet
            </button>
            <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none break-words max-w-full">
              {selectedShop.name || "The Kitchen"}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/80">
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl shadow-emerald-500/20">
                4.8 <Star className="w-3 h-3 fill-current" />
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A13266]" /> 10-15 Mins
              </span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span>{selectedShop.address?.city || "Downtown"}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Search & Discovery */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-3xl border-b border-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-[#561485] transition-colors" />
          <input
            type="text"
            placeholder="Craving something specific?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] md:rounded-[2rem] focus:border-[#561485]/10 focus:bg-white transition-all text-xs md:text-sm font-bold tracking-tight outline-none"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-[88px] z-30 bg-white/90 backdrop-blur-xl border-b border-gray-50 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white shadow-xl shadow-black/10"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-4xl mx-auto px-2 md:px-6 mt-8 md:mt-12 space-y-12 md:space-y-16">
        <header className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-50"></div>
        </header>

        <div className="grid gap-12">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start group w-full max-w-full overflow-hidden"
            >
              <div className="flex-1 space-y-4 order-2 md:order-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#561485] p-0.5 rounded flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#561485] rounded-full"></div>
                  </div>
                  <span className="text-[9px] font-black text-[#561485] uppercase tracking-widest">{product.category || "Main Course"}</span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter group-hover:text-[#561485] transition-colors uppercase leading-none mb-2 break-words">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-gray-400 leading-relaxed line-clamp-2">
                    {product.description || "A masterfully prepared dish using the finest seasonal ingredients and traditional techniques."}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-gray-900 tracking-tighter">₹{product.price}</span>
                  {product.stock && product.stock < 10 && product.stock > 0 && (
                    <span className="text-[8px] md:text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded">
                      Only {product.stock} left
                    </span>
                  )}
                </div>
              </div>

              <div className="relative order-1 md:order-2 w-full md:w-auto flex-shrink-0">
                <div className="w-full h-48 md:w-44 md:h-44 max-w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 group-hover:shadow-[#561485]/10 transition-all duration-500">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {(!(product.stock && product.stock > 0) || product.isAvailable === false) && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 text-center">
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest border-2 border-gray-900 px-3 py-1 rounded-full">
                        {product.isAvailable === false ? "Not Available Now" : "Out of Stock"}
                      </span>
                    </div>
                  )}
                </div>

                {/* ADD Controls */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 pb-2">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-center overflow-hidden min-w-[120px]">
                    {(cartQuantities[product._id!] || 0) > 0 ? (
                      <div className="flex-1 flex items-center justify-between p-1">
                        <button
                          onClick={() => handleUpdateQuantity(product._id!, -1)}
                          className="w-8 h-8 flex items-center justify-center text-[#561485] hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-gray-900">{cartQuantities[product._id!]}</span>
                        <button
                          onClick={() => handleUpdateQuantity(product._id!, 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#561485] hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!(product.stock && product.stock > 0) || product.isAvailable === false}
                        onClick={() => handleAddToCart(product._id!)}
                        className="w-full py-3 text-xs font-black text-[#561485] uppercase tracking-widest hover:bg-[#561485] hover:text-white transition-all disabled:opacity-20 active:scale-95"
                      >
                        {product.isAvailable === false ? "Unavailable" : "Add"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <AnimatePresence>
        {dbCart && dbCart.items && dbCart.items.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg z-50"
          >
            <button
              onClick={() => navigate("/customer/dashboard/menu-cart")}
              className="w-full bg-gray-900 text-white p-6 rounded-[2.5rem] shadow-2xl shadow-black/40 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#561485] transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">
                    {dbCart.items.length} Culinary Items
                  </p>
                  <p className="text-xl font-black tracking-tighter leading-none">
                    ₹{(dbCart.total || dbCart.subtotal || 0).toFixed(0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-colors">
                View Bag
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty States */}
      {filteredProducts.length === 0 && (
        <div className="py-32 text-center space-y-4">
          <ChefHat className="w-16 h-16 text-gray-100 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No delicacies found</h3>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Refine your search parameters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
