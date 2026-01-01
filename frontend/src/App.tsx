import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleCallback from "./pages/GoogleCallback";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RetailerDashboard from "./pages/RetailerDashboard";
import History from "./pages/History";
import Receipt from "./pages/Receipt";
import Cart from "./pages/Cart";
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
  return (
    <div className="min-h-screen bg-white">
      <Header />
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
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/receipt/:id" element={<Receipt />} /> */}
          <Route path="/dashboard" element={<RetailerDashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/checkout" element={<Checkout cart={dummyCart} />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </motion.main>
      <Footer />
    </div>
  );
}

export default App;
