import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { QrCode, Smartphone } from "lucide-react";
import QRScanner from "./QRScanner";

const Hero = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleQRScan = (result: string) => {
    console.log("QR Code scanned:", result);
    // Handle the scanned QR code result
    // This could navigate to a product page or show product details
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

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
                Streamline Your
                <br />
                <span className="text-[#8246A6]">Checkout Experience</span>
                <br />
                with Hindustan Bills
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Hindustan Bills revolutionizes the way you shop by offering a
                quick and efficient QR-based billing solution. Say goodbye to
                long queues and hello to instant digital receipts right on your
                phone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan Me
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Get Started
                </button>
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

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
              <p className="text-gray-600 mt-2">
                Sign in with Google to continue
              </p>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="w-full mt-4 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
