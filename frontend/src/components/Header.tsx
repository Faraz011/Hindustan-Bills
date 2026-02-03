import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  role: string;
  profileCompleted?: boolean;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("hb_token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserRole(decoded.role);
        setIsLoggedIn(true);
      } catch (error) {
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("hb_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const navItems = [
    { name: "How It Works", path: "#howitworks" },
    { name: "Features", path: "#features" },
    { name: "FAQ", path: "#faq" },
  ];

  const smoothScroll = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      if (location.pathname === "/") {
        smoothScroll(path);
      } else {
        navigate("/");
        setTimeout(() => smoothScroll(path), 500);
      }
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isHome = location.pathname === "/";
  const showTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        showTransparent 
          ? "bg-transparent py-8" 
          : "bg-white/95 backdrop-blur-xl border-b border-slate-100 py-3 shadow-md"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <div className={`w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg ${showTransparent ? 'shadow-white/5' : 'shadow-primary-500/20'}`}>
               <img src="/FUTUREOFBUSINESS.png" alt="Hindustan Bills Logo" className="w-10 h-10" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-500 font-poppins ${showTransparent ? 'text-white' : 'text-slate-900'}`}>
              Hindustan<span className={showTransparent ? 'text-primary-300' : 'text-primary-600'}>Bills</span>
            </span>
          </Link>

          {!isAuthPage && (
            <>
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-8">
                <div className="flex items-center gap-8">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className={`text-sm font-bold transition-all duration-300 ${
                        showTransparent ? 'text-primary-100/40 hover:text-white' : 'text-slate-500 hover:text-primary-600'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                <div className={`flex items-center gap-4 border-l pl-4 transition-colors duration-500 ${showTransparent ? 'border-white/10' : 'border-slate-200'}`}>
                  {isLoggedIn ? (
                    <div className="flex items-center gap-3">
                      {userRole === "retailer" && (
                        <Link
                          to="/retailer/dashboard"
                          className={`text-sm font-bold px-5 py-2 rounded-xl transition-all ${
                            showTransparent 
                            ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' 
                            : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                          }`}
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className={`p-2 rounded-xl transition-colors ${showTransparent ? 'text-white/30 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95 ${
                        showTransparent 
                          ? "bg-white/5 text-white border border-white/20 hover:bg-white/10" 
                          : "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20"
                      }`}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </nav>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-colors ${showTransparent ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}

          {isAuthPage && (
             <Link 
               to="/" 
               className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                 location.pathname === "/login" 
                 ? "text-primary-100 bg-white/5 border border-white/10 hover:bg-white/10" 
                 : "text-slate-600 hover:text-primary-600 bg-slate-50"
               }`}
             >
               Back to Site
             </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-4 right-4 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full p-4 text-left text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="w-full p-4 text-left text-red-600 font-bold flex items-center justify-between">
                    Logout <LogOut size={18} />
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold text-center block">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

