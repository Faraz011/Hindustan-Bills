import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../../api/axios";

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
  const nav = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/api/menu/cart");
      setCart(response.data);
    } catch (err: any) {
      console.error("Failed to fetch menu cart:", err);
    }
  };

  const changeQty = async (productId: string, qty: number) => {
    try {
      if (qty <= 0) {
        await remove(productId);
        return;
      }
      await api.put(`/api/menu/cart/${productId}`, { quantity: qty });
      fetchCart();
    } catch (err: any) {
      toast.error("Failed to update quantity");
    }
  };

  const remove = async (productId: string) => {
    try {
      await api.delete(`/api/menu/cart/${productId}`);
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err: any) {
      toast.error("Failed to remove item");
    }
  };

  const checkout = () => {
    console.log("Redirecting to UPI payment page");
    nav("/customer/dashboard/upi-payment");
  };

  if (!cart || cart.items.length === 0)
    return (
      <div className="min-h-screen p-6 bg-[#EAEAEA] flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md border border-gray-100">
          <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-5xl">🍽️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your menu cart is empty
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Add some delicious items from the menu!
          </p>
          <button
            onClick={() => nav("/customer/dashboard/menu")}
            className="bg-gradient-to-r from-[#561485] to-[#3C47BA] text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-semibold"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-[#EAEAEA]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🍽️</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Menu Cart</h2>
              </div>
              <p className="text-gray-600 text-lg">
                {cart.items.length} item{cart.items.length !== 1 ? "s" : ""}{" "}
                from {cart.items[0]?.shop?.name || "Restaurant"}
              </p>
            </div>
            <button
              onClick={() => nav("/customer/dashboard/shopping")}
              className="bg-gradient-to-r from-[#561485] to-[#3C47BA] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-semibold animate-pulse"
            >
              Continue Ordering
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Your Order
              </h3>
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 font-medium">
                        ₹{item.price} each
                      </p>
                    </div>

                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          changeQty(
                            item.productId,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-bold text-lg text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          changeQty(item.productId, item.quantity + 1)
                        }
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#561485] to-[#3C47BA] hover:from-[#561485]/90 hover:to-[#3C47BA]/90 text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg"
                      >
                        +
                      </button>
                    </div>

                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        ₹{item.total.toFixed(2)}
                      </p>
                      <button
                        onClick={() => remove(item.productId)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{cart.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600 font-medium">Tax:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{cart.tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-[#561485]">
                      ₹{cart.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={checkout}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#A13266] to-[#561485] text-white font-bold rounded-xl hover:from-[#A13266]/90 hover:to-[#561485]/90 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Proceed to Payment
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
