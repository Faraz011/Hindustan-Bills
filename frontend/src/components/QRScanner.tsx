import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, QrCode, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (result: string) => void
}

const QRScanner = ({ isOpen, onClose, onScan }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile
        } 
      })
      setHasPermission(true)
      setIsScanning(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setHasPermission(false)
      toast.error('Camera access denied. Please allow camera permission.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  const simulateQRScan = () => {
    // Simulate QR code detection
    const mockQRData = 'https://hindustanbills.com/scan?product=123&store=456'
    onScan(mockQRData)
    toast.success('QR Code scanned successfully!')
    handleClose()
  }

  if (!isOpen) return null

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
                <QrCode className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">QR Scanner</h3>
                <p className="text-sm text-gray-600">Scan a QR code to continue</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scanner Area */}
          <div className="p-6">
            {hasPermission === false ? (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h4>
                <p className="text-gray-600 mb-6">
                  Please allow camera permission to scan QR codes
                </p>
                <button
                  onClick={startCamera}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                  {isScanning ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Camera starting...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scanner Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-primary-500 rounded-xl relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary-500 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary-500 rounded-br-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Position the QR code within the frame
                  </p>
                  
                  {/* Simulate Scan Button for Demo */}
                  <button
                    onClick={simulateQRScan}
                    className="btn-primary flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Simulate Scan (Demo)
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QRScanner
