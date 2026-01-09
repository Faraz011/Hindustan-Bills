import React, { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

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

interface BarcodeScannerScanbotProps {
  onProductDetected: (product: ScannedProduct) => void;
  onError?: (error: string) => void;
  shopId?: string;
  licenseKey?: string; // Optional - leave blank for 60-min free sessions
}

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// License key provided by user
const LICENSE_KEY = `KeFRCnUhhYFUXbgMovfF5f+nfHiDif52ktDeYb++EyMvELKf8VnAipcybsRJjOYErut/oJ4py+twYuHmLkqxufK8M+0kMeqi+54vVJrb15z2fBtOzXn1tbpB2euxWkBZAPJyRzqQUDh27KGkdbtAH3wUj3HmlqipvQ38VDxcIfnYffhiSU6j/e73tyt3lzOcjpVMyeyfLRED4/sE3vHTgrrCi2RrifbLZCVnRnLL8ohuaEh/nZ47Cxs5kWPYMpHRtvZwzIWZ14skh9YxOqjogK7OWN4RPURY0gRH3VmQWTjsdl6S4gUUXDH9kuhLEpXX81OMeJZvv+J1QUupCS7CHA==
U2NhbmJvdFNESwpsb2NhbGhvc3R8aGluZHVzdGFuLWJpbGxzLXgxYWIudmVyY2VsLmFwcAoxNzY4NTIxNTk5CjgzODg2MDcKOA==
`;


export default function BarcodeScannerScanbot({
  onProductDetected,
  onError,
  shopId,
  licenseKey = LICENSE_KEY, // Use provided license key
}: BarcodeScannerScanbotProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [scannerStatus, setScannerStatus] = useState<
    "idle" | "initializing" | "ready" | "scanning" | "error"
  >("idle");

  const lastProcessedBarcodeRef = useRef<string | null>(null);
  const lastProcessedTimeRef = useRef<number>(0);
  const DEBOUNCE_WINDOW = 1000; // ms

  /**
   * Initialize Scanbot SDK
   * This happens once on component mount
   */
  useEffect(() => {
    const initializeScanbotSDK = async () => {
      if (isInitialized || scannerStatus === "initializing") return;

      setScannerStatus("initializing");

      try {
        // Dynamically import ScanbotSDK
        const module = await import("scanbot-web-sdk/ui");
        const ScanbotSDK = module.default;

        // Initialize the SDK
        await ScanbotSDK.initialize({
          licenseKey: licenseKey, // Use provided license key
          enginePath: "/wasm/", // Path to WASM binaries (must be in public folder)
        });

        console.log("✅ Scanbot SDK initialized successfully with license key");
        setIsInitialized(true);
        setScannerStatus("ready");
      } catch (error) {
        console.error("❌ Scanbot SDK initialization error:", error);
        toast.error("Failed to initialize scanner. Check console.");
        onError?.("Scanner initialization failed");
        setScannerStatus("error");
      }
    };

    initializeScanbotSDK();
  }, [isInitialized, licenseKey, onError]);

  /**
   * Check if barcode should be processed (debounce)
   */
  const shouldProcessBarcode = useCallback((barcode: string): boolean => {
    const now = Date.now();

    if (
      lastProcessedBarcodeRef.current === barcode &&
      now - lastProcessedTimeRef.current < DEBOUNCE_WINDOW
    ) {
      console.log(
        `⏳ Debouncing: '${barcode}' already processed ${
          now - lastProcessedTimeRef.current
        }ms ago`
      );
      return false;
    }

    return true;
  }, []);

  /**
   * Fetch product from backend using barcode
   */
  const fetchProductByBarcode = async (barcode: string) => {
    setIsLoading(true);
    try {
      const url = shopId
        ? `${API_BASE}/api/barcode/scan/${barcode}?shopId=${shopId}`
        : `${API_BASE}/api/barcode/scan/${barcode}`;

      const response = await fetch(url, {
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

      toast.success(`Found: ${product.name} - ₹${product.price}`);

      // Notify parent to add to cart
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

  /**
   * Start the scanner UI
   * Scanbot handles all the camera, barcode detection, and UI
   */
  const startScanner = useCallback(async () => {
    if (!isInitialized) {
      toast.error("Scanner not initialized yet. Please wait...");
      return;
    }

    try {
      setIsScanning(true);
      setScannerStatus("scanning");

      // Dynamically import ScanbotSDK for scanner
      const module = await import("scanbot-web-sdk/ui");
      const ScanbotSDK = module.default;

      // Create barcode scanner configuration
      const config =
        new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();

      // UI Customization
      config.palette = config.palette || {};
      config.palette.sbColorPrimary = "#2180A0"; // Teal
      config.palette.sbColorSecondary = "#32B8C6"; // Light teal
      config.topBar = config.topBar || {};
      config.topBar.mode = "GRADIENT";

      // User guidance - safely set with fallbacks
      config.userGuidance = config.userGuidance || {};
      config.userGuidance.title = config.userGuidance.title || {};
      (config.userGuidance.title as any).text = "Hold barcode at center";
      (config.userGuidance as any).subtitle =
        (config.userGuidance as any).subtitle || {};
      ((config.userGuidance as any).subtitle as any).text =
        "Scanning will start automatically";

      // Enable single barcode scanning (closes after scan)
      const useCase = new ScanbotSDK.UI.Config.SingleScanningMode();
      config.useCase = useCase;

      console.log("📱 Opening Scanbot barcode scanner...");

      try {
        // Launch the scanner
        const result = await ScanbotSDK.UI.createBarcodeScanner(config);

        console.log("🔍 Scan result:", result);

        if (!result) {
          console.log("❌ No scan result returned");
          return;
        }

        // Check if result has items array
        if (
          !result.items ||
          !Array.isArray(result.items) ||
          result.items.length === 0
        ) {
          console.log("❌ No items in scan result");
          return;
        }

        const firstItem = result.items[0];
        console.log("🔍 First item:", firstItem);

        if (!firstItem) {
          console.log("❌ First item is null/undefined");
          return;
        }

        // Handle different possible result structures
        let scannedBarcode: string | null = null;
        let barcodeType: string = "unknown";

        // Try different ways to extract the barcode
        if (
          firstItem.barcode &&
          typeof firstItem.barcode === "object" &&
          firstItem.barcode.text
        ) {
          scannedBarcode = String(firstItem.barcode.text);
          barcodeType = firstItem.barcode.format || "unknown";
        } else if (firstItem.text) {
          scannedBarcode = String(firstItem.text);
          barcodeType = firstItem.format || "unknown";
        } else if (typeof firstItem === "string") {
          scannedBarcode = firstItem;
        } else if (firstItem.rawBytes && firstItem.rawBytes.length > 0) {
          // Fallback: try to decode as string
          try {
            scannedBarcode = new TextDecoder().decode(
              new Uint8Array(firstItem.rawBytes)
            );
          } catch (decodeError) {
            console.error("❌ Could not decode raw bytes:", decodeError);
          }
        }

        if (scannedBarcode && scannedBarcode.trim()) {
          console.log(
            `✅ Barcode scanned: ${scannedBarcode} (Type: ${barcodeType})`
          );

          setLastScannedBarcode(scannedBarcode);

          // Check debounce window
          if (shouldProcessBarcode(scannedBarcode)) {
            lastProcessedBarcodeRef.current = scannedBarcode;
            lastProcessedTimeRef.current = Date.now();

            // Fetch product from backend
            await fetchProductByBarcode(scannedBarcode);
          } else {
            toast.error("Barcode already scanned recently");
          }
        } else {
          console.error(
            "❌ Could not extract barcode text from result:",
            firstItem
          );
          toast.error("Failed to read barcode. Please try again.");
        }
      } catch (scanError) {
        console.error("❌ Scanner execution error:", scanError);
        toast.error("Scanner failed. Please try again.");
        setScannerStatus("error");
      }

      setScannerStatus("ready");
    } catch (error) {
      console.error("Scanner error:", error);
      toast.error("Scanner error. Please try again.");
      onError?.("Scanner error");
      setScannerStatus("error");
    } finally {
      setIsScanning(false);
    }
  }, [isInitialized, shouldProcessBarcode, onProductDetected, onError]);

  /**
   * Handle manual barcode input
   */
  const handleManualEntry = async (barcode: string) => {
    if (!barcode.trim()) {
      toast.error("Please enter a barcode");
      return;
    }

    if (!shouldProcessBarcode(barcode.trim())) {
      toast.error("Barcode already scanned recently");
      return;
    }

    console.log("📝 Manual barcode entry:", barcode);

    lastProcessedBarcodeRef.current = barcode.trim();
    lastProcessedTimeRef.current = Date.now();

    await fetchProductByBarcode(barcode.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Scanner Status Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Scanner Status</h3>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              scannerStatus === "ready"
                ? "bg-green-100 text-green-800"
                : scannerStatus === "scanning"
                ? "bg-blue-100 text-blue-800"
                : scannerStatus === "initializing"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {scannerStatus === "ready"
              ? "🟢 Ready"
              : scannerStatus === "scanning"
              ? "🔵 Scanning..."
              : scannerStatus === "initializing"
              ? "🟡 Initializing..."
              : "🔴 Error"}
          </div>
        </div>

        {lastScannedBarcode && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Last scanned:</p>
            <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono block">
              {lastScannedBarcode}
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

      {/* Main Scanner Button */}
      <button
        onClick={startScanner}
        disabled={
          !isInitialized ||
          isScanning ||
          scannerStatus === "initializing" ||
          scannerStatus === "error"
        }
        className={`w-full px-6 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
          isInitialized && scannerStatus !== "error"
            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {scannerStatus === "initializing" ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Initializing...
          </span>
        ) : scannerStatus === "error" ? (
          "❌ Scanner Error"
        ) : isScanning ? (
          "🔄 Scanning..."
        ) : (
          "📱 Start Scanning"
        )}
      </button>

      {/* Features Info */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Why Scanbot?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Handles motion blur & shaky hands</li>
          <li>✅ Works in low-light conditions</li>
          <li>✅ Scans damaged barcodes</li>
          <li>✅ Industry-grade reliability</li>
          <li>✅ Licensed for unlimited use</li>
        </ul>
      </div>

      {/* Manual Entry */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔢</span>
          Manual Entry
        </h3>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Enter barcode manually"
            id="manual-barcode-input"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const input = e.currentTarget as HTMLInputElement;
                handleManualEntry(input.value);
                input.value = "";
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById(
                "manual-barcode-input"
              ) as HTMLInputElement;
              if (input && input.value.trim()) {
                handleManualEntry(input.value.trim());
                input.value = "";
              }
            }}
            disabled={isLoading || !isInitialized}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg"
          >
            {isLoading ? "..." : "Add"}
          </button>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-sm">
        <p className="text-green-900 font-medium mb-2">✅ Setup Complete:</p>
        <ul className="text-green-800 space-y-1">
          <li>✅ Scanbot SDK installed and configured</li>
          <li>✅ License key applied for unlimited use</li>
          <li>✅ WASM files copied to public/wasm folder</li>
          <li>✅ Professional-grade barcode scanning</li>
        </ul>
      </div>
    </div>
  );
}
