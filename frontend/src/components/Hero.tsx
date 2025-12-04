import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { QrCode, Smartphone } from 'lucide-react'
import QRScanner from './QRScanner'

const Hero = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  const handleQRScan = (result: string) => {
    console.log('QR Code scanned:', result)
    // Handle the scanned QR code result
    // This could navigate to a product page or show product details
  }

  return (
    <>
      <section className="bg-[#f4f4f4] section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Streamline Your<br />
                <span className="text-[#8246A6]">Checkout Experience</span><br />
                with Hindustan Bills
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Hindustan Bills revolutionizes the way you shop by offering a quick and efficient QR-based billing solution. Say goodbye to long queues and hello to instant digital receipts right on your phone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsScannerOpen(true)}
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan Me
                </button>
                <Link to="/register" className="btn-secondary inline-flex items-center justify-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Get Started
                </Link>
              </div>
            </motion.div>

            {/* Right Content - QR Code */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <motion.div
                  className="w-64 h-64 bg-white rounded-3xl shadow-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-48 h-48 bg-gray-900 rounded-2xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="bg-[#8246A6] text-white px-6 py-2 rounded-full font-semibold text-sm">
                    SCAN ME
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQRScan}
      />
    </>
  )
}

export default Hero
