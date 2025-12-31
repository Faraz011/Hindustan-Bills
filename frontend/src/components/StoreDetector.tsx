// frontend/src/components/StoreDetector.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

interface Shop {
  _id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  metadata?: Record<string, any>;
}

export default function StoreDetector({ onSelect }: { onSelect?: (shop: Shop | null) => void }) {
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    detect();
  }, []);

  const detect = async () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not available in this browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          // call backend to find nearby shops (backend should expose /shops/nearby?lat=..&lng=..)
          type NearbyShopsResponse = {
            shops: {
                _id: string;
                name: string;
                latitude?: number;
                longitude?: number;
                address?: string;
                distance?: number;
        }[];
        };

          const res = await api.get<NearbyShopsResponse>(`/shops/nearby?lat=${lat}&lng=${lng}`);
          const nearest = res.data?.shops && res.data.shops.length > 0 ? res.data.shops[0] : null;
          setShop(nearest);
          if (onSelect) onSelect(nearest);
          if (nearest) toast.success(`Detected store: ${nearest.name}`);
          else toast("No nearby store detected.");
        } catch (err:any) {
          console.error(err);
          toast.error("Failed to query nearby stores.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        toast.error("Location access denied or unavailable.");
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60_000 }
    );
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-3">
        <button
          onClick={detect}
          className="px-3 py-1 text-sm rounded bg-primary-600 text-white"
          aria-disabled={loading}
        >
          {loading ? "Detecting…" : "Detect Store"}
        </button>
        {shop ? (
          <div className="text-sm text-gray-700">
            <div className="font-medium">{shop.name}</div>
            {shop.address && <div className="text-xs text-gray-500">{shop.address}</div>}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No store detected</div>
        )}
      </div>
    </div>
  );
}