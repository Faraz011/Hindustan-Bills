import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";

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

  // Calculate totals
  useEffect(() => {
    let subtotal = 0;
    let tax = 0;

    items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      const itemTax = itemSubtotal * item.taxRate;
      subtotal += itemSubtotal;
      tax += itemTax;
    });

    setSummary({
      subtotal,
      tax,
      total: subtotal + tax,
    });
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-2xl p-12 text-center border border-gray-200">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ShoppingCart className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Your cart is empty
        </h3>
        <p className="text-gray-600 mb-8 text-lg">
          Start scanning products to add them to your cart
        </p>
        <div className="text-6xl animate-bounce">🛒</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Cart Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <ShoppingCart className="h-7 w-7 mr-3" />
          Shopping Cart
        </h2>
        <p className="text-green-100 mt-1">
          {items.length} item{items.length !== 1 ? "s" : ""} in cart
        </p>
      </div>

      {/* Cart Items */}
      <div className="p-6">
        <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
          {items.map((item) => {
            const itemSubtotal = item.price * item.quantity;
            const itemTax = itemSubtotal * item.taxRate;
            const itemTotal = itemSubtotal + itemTax;

            return (
              <div
                key={item._id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{item.price.toFixed(2)} each
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onRemoveItem(item._id);
                      toast.success(`${item.name} removed`);
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-white rounded-lg border border-gray-300">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item._id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-3 py-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-l-lg transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-800 border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item._id, item.quantity + 1)
                      }
                      className="px-3 py-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-r-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">
                      ₹{itemTotal.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      incl. ₹{itemTax.toFixed(2)} tax
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (GST):</span>
            <span className="font-medium">₹{summary.tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">
                ₹{summary.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <span className="flex items-center justify-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Proceed to Payment
          </span>
        </button>
      </div>
    </div>
  );
}
