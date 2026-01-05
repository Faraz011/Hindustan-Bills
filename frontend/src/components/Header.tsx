// import { useState } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { Menu, X } from 'lucide-react'

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const location = useLocation()
//   const navigate = useNavigate()

//   const navItems = [
//     { name: 'Home', path: '/' },
//     { name: 'How It Works', path: '/how-it-works' },
//     { name: 'Products', path: '/products' },
//     { name: 'Contact Us', path: '/contact' },
//   ]

//   const handleNavigation = (path: string) => {
//     if (path.startsWith('#')) {
//       // Handle anchor links
//       if (location.pathname === '/') {
//         // If already on home page, just scroll
//         setTimeout(() => {
//           const element = document.querySelector(path)
//           if (element) {
//             element.scrollIntoView({ behavior: 'smooth' })
//           }
//         }, 100)
//       } else {
//         // Navigate to home page first, then scroll
//         navigate('/')
//         setTimeout(() => {
//           const element = document.querySelector(path)
//           if (element) {
//             element.scrollIntoView({ behavior: 'smooth' })
//           }
//         }, 500)
//       }
//     } else {
//       // Regular navigation
//       navigate(path)
//     }
//     setIsMenuOpen(false)
//   }

//   return (
//     <motion.header
//       className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="container-custom">
//         <div className="flex items-center justify-between py-4">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
//               <span className="text-white font-bold text-lg">HB</span>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 font-poppins">HINDUSTAN BILLS</h1>
//               <div className="flex space-x-1">
//                 <div className="w-4 h-0.5 bg-primary-500"></div>
//                 <div className="w-4 h-0.5 bg-primary-500"></div>
//               </div>
//               <p className="text-xs text-gray-600 font-koh">हिंदुस्तान बिल्स</p>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => handleNavigation(item.path)}
//                 className={`text-sm font-medium transition-colors duration-200 ${
//                   location.pathname === item.path
//                     ? 'text-primary-600'
//                     : 'text-gray-700 hover:text-primary-600'
//                 }`}
//               >
//                 {item.name}
//               </button>
//             ))}
//             <Link
//               to="/login"
//               className="btn-primary text-sm"
//             >
//               Log In
//             </Link>
//           </nav>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden border-t border-gray-200"
//           >
//             <div className="py-4 space-y-4">
//               {navItems.map((item) => (
//                 <button
//                   key={item.name}
//                   onClick={() => handleNavigation(item.path)}
//                   className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200 ${
//                     location.pathname === item.path
//                       ? 'text-primary-600 bg-primary-50'
//                       : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   {item.name}
//                 </button>
//               ))}
//               <div className="px-4 pt-4">
//                 <Link
//                   to="/login"
//                   className="btn-primary w-full text-center block"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Log In
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.header>
//   )
// }

// export default Header

// import { useState } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { Menu, X } from 'lucide-react'

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const location = useLocation()
//   const navigate = useNavigate()

//   const navItems = [
//     { name: 'Home', path: '/' },
//     { name: 'How It Works', path: '#how' },
//     { name: 'Products', path: '/products' },
//     { name: 'Contact Us', path: '/contact' },
//   ]

//   const handleNavigation = (path: string) => {
//     if (path.startsWith('#')) {
//       // Handle anchor links
//       if (location.pathname === '/') {
//         // If already on home page, just scroll
//         setTimeout(() => {
//           const element = document.querySelector(path)
//           if (element) {
//             element.scrollIntoView({ behavior: 'smooth' })
//           }
//         }, 100)
//       } else {
//         // Navigate to home page first, then scroll
//         navigate('/')
//         setTimeout(() => {
//           const element = document.querySelector(path)
//           if (element) {
//             element.scrollIntoView({ behavior: 'smooth' })
//           }
//         }, 500)
//       }
//     } else {
//       // Regular navigation
//       navigate(path)
//     }
//     setIsMenuOpen(false)
//   }

//   return (
//     <motion.header
//       id = "how it works"
//       className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="container-custom">
//         <div className="flex items-center justify-between py-4">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
//               <span className="text-white font-bold text-lg">HB</span>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 font-poppins">HINDUSTAN BILLS</h1>
//               <div className="flex space-x-1">
//                 <div className="w-4 h-0.5 bg-primary-500"></div>
//                 <div className="w-4 h-0.5 bg-primary-500"></div>
//               </div>
//               <p className="text-xs text-gray-600 font-koh">हिंदुस्तान बिल्स</p>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => handleNavigation(item.path)}
//                 className={`text-sm font-medium transition-colors duration-200 ${
//                   location.pathname === item.path
//                     ? 'text-primary-600'
//                     : 'text-gray-700 hover:text-primary-600'
//                 }`}
//               >
//                 {item.name}
//               </button>
//             ))}
//             <Link
//               to="/login"
//               className="btn-primary text-sm"
//             >
//               Log In
//             </Link>
//           </nav>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden border-t border-gray-200"
//           >
//             <div className="py-4 space-y-4">
//               {navItems.map((item) => (
//                 <button
//                   key={item.name}
//                   onClick={() => handleNavigation(item.path)}
//                   className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200 ${
//                     location.pathname === item.path
//                       ? 'text-primary-600 bg-primary-50'
//                       : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   {item.name}
//                 </button>
//               ))}
//               <div className="px-4 pt-4">
//                 <Link
//                   to="/login"
//                   className="btn-primary w-full text-center block"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Log In
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.header>
//   )
// }

// export default Header
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  role: string;
  exp: number;
  iat: number;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hb_token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserRole(decoded.role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hb_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "#home" },
    { name: "How It Works", path: "#howitworks" },
    { name: "Why Us?", path: "#features" },
    { name: "Contact Us", path: "/contact" },
  ];

  const smoothScroll = (selector: string) => {
    const element =
      document.querySelector(selector) ||
      document.querySelector("#how-it-works"); // fallback id
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (selector === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      // Anchor navigation
      if (location.pathname === "#home" || location.pathname === "/") {
        setTimeout(() => smoothScroll(path), 150);
      } else {
        navigate("/");
        setTimeout(() => smoothScroll(path), 600);
      }
    } else {
      // Regular page navigation
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-[#FBD7FF] backdrop-blur-md shadow-sm border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => handleNavigation("#home")}
              className="flex items-center focus:outline-none"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/FUTUREOFBUSINESS.png"
                  alt="Hindustan Bills Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  HINDUSTAN BILLS
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  हिंदुस्तान बिल्स
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-2">
            <nav className="flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="ml-4 flex items-center md:ml-6">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  {userRole === "retailer" && (
                    <Link
                      to="/retailer-dashboard"
                      className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <User size={16} className="mr-1.5" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut size={16} className="mr-1.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigation(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.path
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="space-y-3 px-4">
                    {userRole === "retailer" && (
                      <Link
                        to="/retailer/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
                      >
                        <User className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-base font-medium text-red-600 rounded-md hover:bg-red-50"
                    >
                      <LogOut className="flex-shrink-0 h-5 w-5 text-red-500 mr-3" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="px-4">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
