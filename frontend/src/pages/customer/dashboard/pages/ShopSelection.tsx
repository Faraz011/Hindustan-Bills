import React, { useState, useEffect } from "react";
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
    localStorage.setItem("selectedShop", JSON.stringify(selectedShop));

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Shop</h1>
        <p className="text-gray-600">
          Choose a shop to start your shopping session
        </p>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No shops available
          </h3>
          <p className="text-gray-600">
            There are currently no shops available for shopping.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {shops.map((shop) => (
            <div
              key={shop._id}
              className={`bg-white rounded-lg shadow-md border-2 transition-all cursor-pointer ${
                selectedShop?._id === shop._id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300"
              }`}
              onClick={() => handleShopSelect(shop)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {shop.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {shop.businessType.replace("_", " ")}
                    </p>
                  </div>
                  {selectedShop?._id === shop._id && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p>{shop.address.street}</p>
                      <p>
                        {shop.address.city}, {shop.address.state} -{" "}
                        {shop.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      {shop.contact?.phone || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Today: {getTodaysHours(shop)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
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
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            selectedShop
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Shopping
        </button>
      </div>
    </div>
  );
}
