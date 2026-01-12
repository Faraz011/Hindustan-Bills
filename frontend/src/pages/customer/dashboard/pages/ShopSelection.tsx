import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Phone, Store } from "lucide-react";
import toast from "react-hot-toast";
import { getAvailableShops, Shop } from "/src/lib/api";

export default function ShopSelection() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableShops();
  }, []);

  const fetchAvailableShops = async () => {
    try {
      const shops = await getAvailableShops();
      setShops(shops);
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

    // Clear any existing selected shop and session data
    localStorage.removeItem("selectedShop");
    localStorage.removeItem("selectedShopId");
    localStorage.setItem("selectedShop", JSON.stringify(selectedShop));
    localStorage.setItem("selectedShopId", selectedShop._id);

    navigate("/customer/dashboard/shopping");
  };

  const getTodaysHours = (shop: Shop) => {
    if (!shop.businessHours) return "Hours not available";
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = new Date().getDay();
    const dayName = days[today];
    const hours =
      shop.businessHours[dayName as keyof typeof shop.businessHours];
    return hours && hours.open && hours.close
      ? `${hours.open} - ${hours.close}`
      : "Closed";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#561485]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-full flex items-center justify-center shadow-lg">
            <Store className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Select a Shop</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose a shop to start your shopping session
        </p>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No shops available
          </h3>
          <p className="text-gray-600 text-lg">
            There are currently no shops available for shopping.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {shops.map((shop) => (
            <div
              key={shop._id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer hover:shadow-xl transform hover:-translate-y-1 ${
                selectedShop?._id === shop._id
                  ? "border-[#561485] bg-gradient-to-br from-[#561485]/5 to-[#3C47BA]/5"
                  : "border-gray-100 hover:border-[#561485]/50"
              }`}
              onClick={() => handleShopSelect(shop)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {shop.name}
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[#561485]/10 to-[#3C47BA]/10 rounded-full">
                      <span className="text-sm font-medium text-[#561485] capitalize">
                        {shop.businessType.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  {selectedShop?._id === shop._id && (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{shop.address.street}</p>
                      <p>
                        {shop.address.city}, {shop.address.state} -{" "}
                        {shop.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {shop.contact?.phone || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Today: {getTodaysHours(shop)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Owner: {shop.owner ? shop.owner.name : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleContinueToShopping}
          disabled={!selectedShop}
          className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-200 text-lg shadow-lg transform hover:-translate-y-1 ${
            selectedShop
              ? "bg-gradient-to-r from-[#561485] to-[#3C47BA] text-white hover:shadow-xl"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Shopping
        </button>
      </div>
    </div>
  );
}
