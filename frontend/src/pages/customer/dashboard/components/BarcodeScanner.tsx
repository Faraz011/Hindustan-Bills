import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import Quagga from "@ericblade/quagga2";
import toast from "react-hot-toast";

// Use configured API base (VITE_API_URL) when available (production).
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
interface ScannedProduct {
  _id: string;
  barcode: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  taxRate: number;
  imageUrl?: string;
}

interface BarcodeScannerProps {
  onProductDetected: (product: ScannedProduct) => void;
  onError?: (error: string) => void;
  shopId?: string;
}

export default function BarcodeScanner({
  onProductDetected,
  onError,
  shopId,
}: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const scannedBarcodesRef = useRef<Set<string>>(new Set()); // Prevent duplicate scans

  // Handle detected barcode
  const handleBarcodeDetected = useCallback(async (result: any) => {
    if (!result || !result.codeResult) return;

    const barcode = result.codeResult.code;

    // Skip if already scanned recently (prevent duplicates)
    if (scannedBarcodesRef.current.has(barcode)) {
      return;
    }

    console.log("📱 Barcode detected:", barcode);
    setDetectedBarcode(barcode);

    // Mark as scanned for 2 seconds to prevent duplicates
    scannedBarcodesRef.current.add(barcode);
    setTimeout(() => {
      scannedBarcodesRef.current.delete(barcode);
    }, 2000);

    // Fetch product from backend
    await fetchProductByBarcode(barcode);
  }, []);

  // Initialize Quagga Scanner
  useLayoutEffect(() => {
    if (!scanning || !videoRef.current) return;

    // Delay initialization to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (!videoRef.current || videoRef.current.clientWidth === 0) return;

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 },
              facingMode: "environment", // Use back camera
              aspectRatio: { ideal: 4 / 3 },
            },
            target: videoRef.current, // Mount camera stream here
          },
          decoder: {
            readers: [
              "code_128_reader", // Most common in retail
              "ean_reader", // EAN-13 (European barcode)
              "ean_8_reader", // EAN-8 (compact)
              "upc_reader", // UPC-A (US standard)
              "upc_e_reader", // UPC-E (compact)
              "codabar_reader", // Codabar
            ],
            debug: {
              showCanvas: true, // Show detection overlay
              showPatches: false,
              showFoundPatches: false,
              showSkeleton: false,
              showLabels: false,
              showPatchLabels: false,
              showRemainingPatchLabels: false,
              boxFromPatches: {
                showTransformed: false,
                showTransformedBox: false,
                showBB: false,
              },
            },
          },
          locate: true, // Auto-locate barcode in frame
        },
        (err) => {
          if (err) {
            console.error("Quagga init error:", err);
            toast.error("Camera access failed. Try manual entry below.");
            onError?.(
              "Camera initialization failed - try manual barcode entry"
            );
            setScanning(false);
            setIsInitialized(false);
            return;
          }

          console.log("✅ Quagga initialized successfully");
          setIsInitialized(true);
          Quagga.start();

          // Listen for barcode detections
          Quagga.onDetected(handleBarcodeDetected);
        }
      );
    }, 100);

    return () => {
      clearTimeout(timer);
      Quagga.stop();
      Quagga.offDetected(handleBarcodeDetected);
    };
  }, [scanning, handleBarcodeDetected]);

  // Fetch product from backend by barcode
  const fetchProductByBarcode = async (barcode: string) => {
    setIsLoading(true);
    try {
      console.log(`🔍 Fetching product for barcode: ${barcode}`);

      const relative = shopId
        ? `/api/barcode/scan/${barcode}?shopId=${shopId}`
        : `/api/barcode/scan/${barcode}`;

      const response = await fetch(`${API_BASE}${relative}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hb_token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const product = await response.json();

      console.log("✅ Product found:", product);

      // Show success notification with product details
      toast.success(`Found: ${product.name} - ₹${product.price}`);

      // Notify parent component to add to cart
      onProductDetected({
        _id: product._id,
        barcode: product.barcode,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        taxRate: product.taxRate || 0,
        imageUrl: product.imageUrl,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Product not found");
      onError?.(`Barcode ${barcode} not found`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual barcode entry
  const handleManualScan = async (barcode: string) => {
    if (scannedBarcodesRef.current.has(barcode)) {
      toast.error("Barcode already scanned recently");
      return;
    }

    console.log(" Manual barcode entry:", barcode);
    setDetectedBarcode(""); // Clear input field

    // Mark as scanned for 2 seconds to prevent duplicates
    scannedBarcodesRef.current.add(barcode);
    setTimeout(() => {
      scannedBarcodesRef.current.delete(barcode);
    }, 2000);

    // Fetch product from backend
    await fetchProductByBarcode(barcode);
  };

  // Toggle camera on/off
  const toggleScanning = () => {
    if (scanning) {
      Quagga.stop();
    } else {
      if (isInitialized) {
        Quagga.start();
      } else {
        toast.error("Camera not initialized. Please refresh and try again.");
        return;
      }
    }
    setScanning(!scanning);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Camera Feed Container */}
      <div
        ref={videoRef}
        id="quagga-container"
        className="relative w-full bg-gray-900 rounded-2xl overflow-hidden aspect-video border-4 border-blue-400 shadow-2xl"
      >
        {!scanning && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-white text-lg font-medium">Camera is paused</p>
            <p className="text-gray-300 text-sm mt-1">
              Click start scanning to begin
            </p>
          </div>
        )}

        {/* Scanning overlay */}
        {scanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 border-4 border-white border-t-transparent rounded-full animate-spin opacity-50"></div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                Point camera at barcode
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detection Status */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Scanner Status</h3>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              scanning
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {scanning ? "🟢 Active" : "🔴 Paused"}
          </div>
        </div>

        {detectedBarcode && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Last detected:</p>
            <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono block">
              {detectedBarcode}
            </code>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Looking up product...
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={toggleScanning}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg ${
            scanning
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          }`}
        >
          {scanning ? "⏸️ Stop Scanning" : "▶️ Start Scanning"}
        </button>
      </div>

      {/* Manual Barcode Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔢</span>
          Manual Entry
        </h3>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Enter barcode manually"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={detectedBarcode || ""}
            onChange={(e) => setDetectedBarcode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && detectedBarcode?.trim()) {
                handleManualScan(detectedBarcode.trim());
              }
            }}
          />
          <button
            onClick={() =>
              detectedBarcode?.trim() &&
              handleManualScan(detectedBarcode.trim())
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg"
            disabled={!detectedBarcode?.trim() || isLoading}
          >
            {isLoading ? "🔍" : "Add"}
          </button>
        </div>
      </div>

      {/* Test Products */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border border-yellow-200">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🧪</span>
          Test Products
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => handleManualScan("123456789012")}
            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 hover:scale-105 shadow-lg"
            disabled={isLoading}
          >
            <div className="flex items-center justify-between">
              <span>🥤 Coca Cola 500ml</span>
              <span className="font-bold">₹45</span>
            </div>
          </button>
          <button
            onClick={() => handleManualScan("987654321098")}
            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 hover:scale-105 shadow-lg"
            disabled={isLoading}
          >
            <div className="flex items-center justify-between">
              <span>🍟 Lays Classic</span>
              <span className="font-bold">₹20</span>
            </div>
          </button>
          <button
            onClick={() => handleManualScan("555666777888")}
            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 hover:scale-105 shadow-lg"
            disabled={isLoading}
          >
            <div className="flex items-center justify-between">
              <span>🥛 Amul Milk 1L</span>
              <span className="font-bold">₹65</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
