import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingPage from "../pages/Shopping";
import MenuPage from "../pages/Menu";

const ShoppingOrMenuPage = () => {
  const [shopType, setShopType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkShopType = () => {
      try {
        const selectedShopString = localStorage.getItem("selectedShop");
        if (!selectedShopString) {
          navigate("/customer/dashboard/select-shop");
          return;
        }

        const selectedShop = JSON.parse(selectedShopString);
        setShopType(selectedShop.businessType);
      } catch (error) {
        console.error("Error checking shop type:", error);
        navigate("/customer/dashboard/select-shop");
      } finally {
        setLoading(false);
      }
    };

    checkShopType();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

 
  if (shopType === "restaurant") {
    return <MenuPage />;
  } else {
    return <ShoppingPage />;
  }
};

export default ShoppingOrMenuPage;
