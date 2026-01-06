import { useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CheckoutResponse = {
  receiptId: string;
  totalAmount: number;
  qr: string;
};

interface CheckoutProps {
  cart: CartItem[];
}

const Checkout: React.FC<CheckoutProps> = ({ cart }) => {
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    try {
      setLoading(true);
      const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data: CheckoutResponse = await res.json();
      setQr(data.qr);
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold">Checkout Page Loaded</h1>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
      <button
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded"
        onClick={checkout}
      >
        Confirm (Mock Payment)
      </button>

      {qr && <img src={qr} alt="QR Code" className="mt-6 w-48" />}
    </div>
  );
};

export default Checkout;
