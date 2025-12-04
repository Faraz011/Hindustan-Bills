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
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { name: 'Home', path: '#home' },
    { name: 'How It Works', path: '#howitworks' },
    { name: 'Why Us?', path: '#features' },
    { name: 'Contact Us', path: '/contact' },
  ]

  const smoothScroll = (selector: string) => {
    const element =
      document.querySelector(selector) ||
      document.querySelector('#how-it-works') // fallback id
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else if (selector === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      // Anchor navigation
      if (location.pathname === '#home' || location.pathname === '/') {
        setTimeout(() => smoothScroll(path), 150)
      } else {
        navigate('/')
        setTimeout(() => smoothScroll(path), 600)
      }
    } else {
      // Regular page navigation
      navigate(path)
    }
    setIsMenuOpen(false)
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 bottom-200 z-50 bg-[#FBD7FF] backdrop-blur-md shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container-custom">
        <div className="flex justify-between justify-items-stretch py-up-1">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('#home')}
            className="flex items-center focus:outline-none"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <img 
                src="/FUTUREOFBUSINESS.png"
                alt="Hindustan Bills Logo" 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-[44px] font-ABeeZee font-bold text-gray-900 mb-[-14px]">
                  HINDUSTAN BILLS
              </h1>

              <div className="flex items-center space-x-2">
                  <div className="w-24 h-1 bg-[#D9D9D9]"></div>

                  <p className="text-[22px] font-bold font-playfair-display text-gray-600">हिंदुस्तान बिल्स</p>

                  <div className="w-24 h-1 bg-[#d9d9d9]"></div>
              </div>
          </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`text-[18.5px] font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-[#260434]'
                    : 'text-gray-700 hover:text-[#260434]'
                }`}
              >
                {item.name}
              </button>
            ))}
            <Link to="/login" className="btn-primary text-sm">
              Log In
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="px-4 pt-4">
                <Link
                  to="/login"
                  className="btn-primary w-full text-center block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header
