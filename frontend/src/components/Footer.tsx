import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'How it Works', path: '/#how-it-works' },
      { name: 'Benefits', path: '/#features' },
      { name: 'Products', path: '/products' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Careers', path: '/careers' },
      { name: 'FAQ', path: '/#faq' },
    ],
    contact: [
      { name: 'support@hindustanbills.com', path: 'mailto:support@hindustanbills.com' },
      { name: '+1 (555) 123-4567', path: 'tel:+15551234567' },
      { name: '456 Business Rd, Melbourne VIC 3000 AU', path: '#' },
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      // Handle anchor links
      if (window.location.pathname === '/') {
        const element = document.querySelector(path)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // Navigate to home page first, then scroll
        window.location.href = `/${path}`
      }
    }
  }

  return (
    <footer className="bg-[#260334] text-white">
      <div className="container-custom">
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <img 
                      src="/FUTUREOFBUSINESS.png"
                      alt="Hindustan Bills Logo" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-poppins">Hindustan Bills</h3>
                  <p className="text-xs text-gray-400 font-koh">हिंदुस्तान बिल्स</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Revolutionizing the retail checkout experience with seamless QR code payments.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    {link.path.startsWith('#') ? (
                      <button
                        onClick={() => handleNavigation(link.path)}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    {link.path.startsWith('#') ? (
                      <button
                        onClick={() => handleNavigation(link.path)}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <a href="mailto:support@hindustanbills.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                    support@hindustanbills.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <a href="tel:+15551234567" className="text-gray-400 hover:text-white transition-colors duration-200">
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-400">
                    456 Business Rd, Melbourne VIC 3000 AU
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Hindustan Bills. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
