import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { getShopBySlug, guestLogin } from "../../../../lib/api";

interface JwtPayload {
  id: string;
  role: string;
  name: string;
  email: string;
  profileCompleted: boolean;
}

const ShopRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAutoRedirect = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        let token = localStorage.getItem("hb_token");

        // 1. If no token, perform auto guest login
        if (!token || token.length < 10) {
          const storedGuestId = localStorage.getItem("hb_guest_id");
          const response = await guestLogin(storedGuestId);
          const { token: newToken, guestId } = response as any;

          if (!newToken) throw new Error("Automatic login failed");

          localStorage.setItem("hb_token", newToken);
          if (guestId) localStorage.setItem("hb_guest_id", guestId);

          const decodedToken = jwtDecode<JwtPayload>(newToken);
          const userData = {
            id: decodedToken.id,
            role: decodedToken.role,
            name: decodedToken.name,
            email: decodedToken.email,
          };
          localStorage.setItem("user", JSON.stringify(userData));
          token = newToken;
        }

        // 2. Fetch shop details by slug
        const shop = await getShopBySlug(slug);

        // 3. Set selected shop in localStorage
        localStorage.setItem("selectedShop", JSON.stringify(shop));
        localStorage.setItem("selectedShopId", (shop as any)._id);

        toast.success(`Welcome to ${shop.name}!`);

        // 4. Redirect to shopping page
        navigate("/customer/dashboard/shopping", { replace: true });
      } catch (error: any) {
        console.error("Auto-redirect error:", error);
        toast.error(error.response?.data?.message || "Failed to access shop");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    handleAutoRedirect();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Entering store...</p>
      </div>
    );
  }

  return null;
};

export default ShopRedirect;
