import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/90 backdrop-blur-xl border-b-2 border-gray-100 shadow-sm" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/FUTUREOFBUSINESS.png" 
                alt="Future of Business" 
                className="h-10 w-auto object-contain"
              />
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
                Hindustan Bills
              </h1>
            </Link>
          </motion.div>

          {/* Desktop navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="hidden md:flex items-center gap-8"
          >
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-sm text-slate-600 hover:text-[#561485] transition-colors font-bold uppercase tracking-widest text-[10px]"
              >
                {link.name}
              </a>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex items-center gap-5"
          >
            <Link 
              to="/login"
              className="text-sm text-slate-700 hover:text-[#561485] transition-colors font-bold uppercase tracking-widest text-[10px]"
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className="px-6 py-3 bg-gradient-to-r from-[#561485] to-[#A13266] text-white text-[10px] rounded-xl font-black uppercase tracking-[0.15em] shadow-lg shadow-[#561485]/20 hover:shadow-xl hover:shadow-[#561485]/30 transition-all hover:translate-y-[-2px] active:scale-95"
            >
              Start Free Trial
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-6 border-t border-slate-100 overflow-hidden"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-xs font-black text-slate-600 hover:text-[#561485] transition-colors uppercase tracking-widest"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                  <Link 
                    to="/login"
                    className="text-xs font-black text-slate-700 hover:text-[#561485] transition-colors uppercase tracking-widest py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#561485] to-[#A13266] text-white text-xs rounded-2xl font-black uppercase tracking-[0.2em] text-center shadow-lg shadow-[#561485]/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;
