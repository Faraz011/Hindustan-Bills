import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, Store, ChevronRight, Search } from "lucide-react";
import toast from "react-hot-toast";
import { getAvailableShops, Shop } from "../../../../lib/api";

export default function ShopSelection() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableShops();
  }, []);

  useEffect(() => {
    const filtered = shops.filter(shop => 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.businessType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredShops(filtered);
  }, [searchQuery, shops]);

  const fetchAvailableShops = async () => {
    try {
      const shops = await getAvailableShops();
      setShops(shops);
      setFilteredShops(shops);
    } catch (error) {
      console.error("Error fetching shops:", error);
      toast.error("Failed to load available shops");
    } finally {
      setLoading(false);
    }
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const handleContinueToShopping = () => {
    if (!selectedShop) {
      toast.error("Please select a shop to continue");
      return;
    }

    localStorage.removeItem("selectedShop");
    localStorage.removeItem("selectedShopId");
    localStorage.setItem("selectedShop", JSON.stringify(selectedShop));
    localStorage.setItem("selectedShopId", selectedShop._id);

    navigate("/customer/dashboard/shopping");
  };

  const getTodaysHours = (shop: Shop) => {
    if (!shop.businessHours) return "From 4pm to 9pm";
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = new Date().getDay();
    const dayName = days[today];
    const hours = shop.businessHours[dayName as keyof typeof shop.businessHours];
    return hours && hours.open && hours.close ? `${hours.open} - ${hours.close}` : "Closed Today";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex p-4 bg-white rounded-3xl shadow-xl shadow-[#561485]/5 border border-gray-50 mb-4"
        >
          <Store className="h-10 w-10 text-[#561485]" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Choose Your Store
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Select a partner store to start billing
        </p>

        {/* Search Box */}
        <div className="max-w-md mx-auto relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search stores by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-[#561485]/10 focus:border-[#561485] transition-all font-bold text-gray-900 group"
          />
        </div>
      </section>

      {/* Grid Section */}
      <section>
        <AnimatePresence mode="popLayout">
          {filteredShops.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-[3rem] border border-gray-50 shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-gray-100 text-gray-300">
                <Store className="h-10 w-10" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching stores found</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop, i) => (
                <motion.div
                  key={shop._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleShopSelect(shop)}
                  className={`relative group bg-white rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${
                    selectedShop?._id === shop._id
                      ? "border-[#561485] shadow-2xl shadow-[#561485]/10 ring-4 ring-[#561485]/5"
                      : "border-gray-50 hover:border-gray-200 shadow-sm hover:shadow-xl"
                  }`}
                >
                  {/* Selection Indicator */}
                  {selectedShop?._id === shop._id && (
                    <div className="absolute top-6 right-6 z-10 w-10 h-10 bg-[#561485] rounded-xl flex items-center justify-center shadow-lg transform rotate-12 scale-110 shadow-[#561485]/20">
                      <ChevronRight className="h-6 w-6 text-white" />
                    </div>
                  )}

                  <div className="p-8 space-y-6">
                    <div>
                      <span className="text-[10px] font-black text-[#561485] uppercase tracking-widest bg-[#561485]/5 px-3 py-1 rounded-full mb-3 inline-block">
                        {shop.businessType.replace("_", " ")}
                      </span>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        {shop.name}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#3C47BA]/5 transition-colors">
                          <MapPin className="h-5 w-5 text-[#3C47BA]" />
                        </div>
                        <div className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors uppercase leading-tight tracking-tight">
                          {shop.address.street}, {shop.address.city}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#A13266]/5 transition-colors">
                          <Clock className="h-5 w-5 text-[#A13266]" />
                        </div>
                        <div className="text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-widest pt-3">
                          {getTodaysHours(shop)}
                        </div>
                      </div>
                    </div>

                    {shop.contact && (
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                        <Phone className="h-3 w-3 text-gray-300" />
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          {shop.contact.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* CTA Section */}
      <footer className="sticky bottom-8 z-20 flex justify-center">
        <button
          onClick={handleContinueToShopping}
          disabled={!selectedShop}
          className={`group relative overflow-hidden px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-tighter transition-all shadow-2xl active:scale-95 ${
            selectedShop
              ? "bg-[#561485] text-white shadow-[#561485]/30 hover:shadow-[#561485]/50 scale-105"
              : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
          }`}
        >
          <span className="relative z-10 flex items-center gap-3">
            start to order 
            <ChevronRight className={`h-5 w-5 transition-transform ${selectedShop ? 'group-hover:translate-x-1' : ''}`} />
          </span>
          {selectedShop && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}
        </button>
      </footer>
    </div>
  );
}
