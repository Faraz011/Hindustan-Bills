import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const initScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const cameraId = cameras.length > 1 ? cameras[1].id : cameras[0].id;
          
          await scanner.start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
              onScan(decodedText);
              stopScanner();
              onClose();
            },
            (errorMessage) => {
              if (!errorMessage.includes('No QR code found')) {
                console.error('QR scan error:', errorMessage);
              }
            }
          );
          
          setIsScanning(true);
        } else {
          throw new Error('No cameras found');
        }
      } catch (error) {
        console.error('Scanner initialization error:', error);
        toast.error('Failed to initialize scanner. Please check camera permissions.');
      }
    };

    const stopScanner = () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
        scannerRef.current = null;
        setIsScanning(false);
      }
    };

    initScanner();

    return () => {
      stopScanner();
    };
  }, [isOpen, onClose, onScan]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-600"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">QR Scanner</h3>
                <p className="text-sm text-gray-600">
                  {isScanning ? 'Scan a QR code' : 'Initializing scanner...'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close scanner"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scanner Area */}
          <div className="relative p-4">
            <div id="qr-reader" className="w-full h-64 md:h-96 relative">
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse text-gray-500">
                    Loading scanner...
                  </div>
                </div>
              )}
              
              {/* Scanner frame overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-64 h-64 border-2 border-primary-500 rounded-lg">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary-500 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary-500 rounded-br-lg"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 text-center text-sm text-gray-600 rounded-b-lg">
              Position the QR code within the frame to scan
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
