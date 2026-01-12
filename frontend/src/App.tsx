import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleCallback from "./pages/GoogleCallback";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DashboardLayout from "./pages/customer/dashboard/Layout";
import RetailerLayout from "./pages/retailer/dashboard/Layout";
import DashboardPage from "./pages/retailer/dashboard/pages/Dashboard";
import ProductsPage from "./pages/retailer/dashboard/pages/products";
import OrdersPage from "./pages/retailer/dashboard/pages/Orders";
import ShopDetailsPage from "./pages/retailer/dashboard/pages/ShopDetails";
import CustomerDashboardPage from "./pages/customer/dashboard/pages/Dashboard";
import CustomerOrdersPage from "./pages/customer/dashboard/pages/Orders";
import ShoppingPage from "./pages/customer/dashboard/pages/Shopping";
import ShoppingOrMenuPage from "./pages/customer/dashboard/components/ShoppingOrMenuPage";
import Cart from "./pages/customer/dashboard/pages/Cart";
import ShopSelectionPage from "./pages/customer/dashboard/pages/ShopSelection";
import MenuCartPage from "./pages/customer/dashboard/pages/MenuCart";
import UpiPaymentPage from "./pages/customer/dashboard/pages/UpiPayment";
import History from "./pages/History";
import Receipt from "./pages/Receipt";
import Checkout from "./pages/Checkout";

const dummyCart = [
  {
    productId: "1",
    name: "Soap",
    price: 40,
    quantity: 2,
  },
  {
    productId: "2",
    name: "Rice",
    price: 60,
    quantity: 1,
  },
];

function App() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith("/retailer/dashboard") ||
    location.pathname.startsWith("/customer/dashboard");

  return (
    <div className="min-h-screen bg-white">
      {!isDashboardRoute && <Header />}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/products" element={<Products />} />

          {/* <Route path="/receipt/:id" element={<Receipt />} /> */}
          {/* Retailer Dashboard Routes */}
          <Route
            path="/retailer/dashboard"
            element={
              <ProtectedRoute role="retailer">
                <RetailerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="shop" element={<ShopDetailsPage />} />
          </Route>

          {/* Customer Dashboard Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute role="customer">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerDashboardPage />} />
            <Route path="select-shop" element={<ShopSelectionPage />} />
            <Route path="shopping" element={<ShoppingOrMenuPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="menu-cart" element={<MenuCartPage />} />
            <Route path="upi-payment" element={<UpiPaymentPage />} />
            <Route path="orders" element={<CustomerOrdersPage />} />
          </Route>
          <Route path="/history" element={<History />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/checkout" element={<Checkout cart={dummyCart} />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </motion.main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default App;
