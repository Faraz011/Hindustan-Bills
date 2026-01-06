import { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
import { useParams } from "react-router-dom";

type ReceiptItem = {
  name: string;
  price: number;
  quantity: number;
};

type ReceiptData = {
  items: ReceiptItem[];
  totalAmount: number;
};

const Receipt = () => {
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/receipt/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch receipt");
        }
        return res.json();
      })
      .then((data) => {
        setReceipt(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Receipt not found or server error");
      });
  }, [id]);

  return (
    <div className="min-h-[70vh] p-10 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Receipt Verification</h1>

      {error && <p className="text-red-600">{error}</p>}

      {!receipt && !error && <p>Loading receipt...</p>}

      {receipt && (
        <>
          <ul className="mb-4">
            {receipt.items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold">
            Total Amount: ₹{receipt.totalAmount}
          </h2>
        </>
      )}
    </div>
  );
};

export default Receipt;
