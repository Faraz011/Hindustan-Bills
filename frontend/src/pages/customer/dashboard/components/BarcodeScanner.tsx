import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import Quagga from "@ericblade/quagga2";
import toast from "react-hot-toast";


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

interface BarcodeDetection {
  code: string;
  confidence: number;
  timestamp: number;
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
  const [debugInfo, setDebugInfo] = useState<{
    lastConfidence: number;
    framesProcessed: number;
  }>({ lastConfidence: 0, framesProcessed: 0 });

  const videoRef = useRef<HTMLDivElement>(null);
  
  
  const detectionHistoryRef = useRef<BarcodeDetection[]>([]);
  
  
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedBarcodeRef = useRef<string | null>(null);
  const lastProcessedTimeRef = useRef<number>(0);
  
  
  const lastProcessedFrameRef = useRef<number>(0);
  const FRAME_PROCESS_INTERVAL = 100; // ms (10 FPS)
  
  
  const MIN_CONFIDENCE = 0.85; 
  const TEMPORAL_WINDOW = 500; 
  const REQUIRED_CONSISTENT_READS = 3; 
  const DEBOUNCE_WINDOW = 1000; 
  
  const shouldProcessFrame = useCallback((): boolean => {
    const now = Date.now();
    if (now - lastProcessedFrameRef.current < FRAME_PROCESS_INTERVAL) {
      return false;
    }
    lastProcessedFrameRef.current = now;
    return true;
  }, []);

  
  const validateConfidence = useCallback((confidence: number): boolean => {
    return confidence >= MIN_CONFIDENCE;
  }, []);

 
  const getConsistentBarcode = useCallback(
    (newCode: string, confidence: number): string | null => {
      const now = Date.now();

     
      detectionHistoryRef.current.push({
        code: newCode,
        confidence,
        timestamp: now,
      });

      
      detectionHistoryRef.current = detectionHistoryRef.current.filter(
        (d) => now - d.timestamp < TEMPORAL_WINDOW
      );

      
      const recentCodes = detectionHistoryRef.current;
      if (recentCodes.length === 0) return null;

     
      const lastN = recentCodes.slice(-REQUIRED_CONSISTENT_READS);

     
      const allMatch = lastN.length === REQUIRED_CONSISTENT_READS &&
        lastN.every((d) => d.code === newCode);

      if (allMatch) {
        
        const avgConfidence =
          lastN.reduce((sum, d) => sum + d.confidence, 0) / lastN.length;
        
        setDebugInfo((prev) => ({
          ...prev,
          lastConfidence: Math.round(avgConfidence * 100),
        }));

        console.log(
          ` STABLE: Barcode '${newCode}' detected ${REQUIRED_CONSISTENT_READS}x with avg confidence ${Math.round(avgConfidence * 100)}%`
        );
        return newCode;
      }

      return null;
    },
    []
  );

 
  const shouldProcessBarcode = useCallback((barcode: string): boolean => {
    const now = Date.now();

    
    if (processingTimeoutRef.current !== null) {
      return false;
    }

    if (
      lastProcessedBarcodeRef.current === barcode &&
      now - lastProcessedTimeRef.current < DEBOUNCE_WINDOW
    ) {
      console.log(
        `Debouncing: '${barcode}' already processed ${now - lastProcessedTimeRef.current}ms ago`
      );
      return false;
    }

    return true;
  }, []);

  
  const handleBarcodeDetected = useCallback(
    async (result: any) => {
      // Frame rate limiting
      if (!shouldProcessFrame()) {
        return;
      }

      if (!result || !result.codeResult) return;

      const barcode = result.codeResult.code;
      const confidence = result.codeResult.confidence || 0;

      // STABILIZATION: Confidence check
      if (!validateConfidence(confidence)) {
        console.log(
          `⚠️  Low confidence (${Math.round(confidence * 100)}%): ignoring '${barcode}'`
        );
        setDebugInfo((prev) => ({
          ...prev,
          lastConfidence: Math.round(confidence * 100),
        }));
        return;
      }

      // STABILIZATION: Temporal smoothing
      const consistentBarcode = getConsistentBarcode(barcode, confidence);
      if (!consistentBarcode) {
        return; // Not yet consistent
      }

      // STABILIZATION: Debounce check
      if (!shouldProcessBarcode(consistentBarcode)) {
        return;
      }

      console.log(`📱 Processing barcode: ${consistentBarcode}`);
      setDetectedBarcode(consistentBarcode);

      
      processingTimeoutRef.current = setTimeout(() => {
        processingTimeoutRef.current = null;
      }, DEBOUNCE_WINDOW);

      
      lastProcessedBarcodeRef.current = consistentBarcode;
      lastProcessedTimeRef.current = Date.now();

      await fetchProductByBarcode(consistentBarcode);
    },
    [shouldProcessFrame, validateConfidence, getConsistentBarcode, shouldProcessBarcode]
  );

  
  useLayoutEffect(() => {
    if (!scanning || !videoRef.current) return;

    const timer = setTimeout(() => {
      if (!videoRef.current || videoRef.current.clientWidth === 0) return;

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 },
              facingMode: "environment",
              aspectRatio: { ideal: 4 / 3 },
            },
            target: videoRef.current,
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "upc_reader",
              "upc_e_reader",
              "codabar_reader",
            ],
            debug: {
              showCanvas: false, 
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
          locate: true,
          
          locator: {
            patchSize: "medium", 
            halfSample: true, 
          },
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

          console.log("Quagga initialized with stabilization enabled");
          setIsInitialized(true);
          Quagga.start();

          Quagga.onDetected(handleBarcodeDetected);
        }
      );
    }, 100);

    return () => {
      clearTimeout(timer);
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      Quagga.stop();
      Quagga.offDetected(handleBarcodeDetected);
      detectionHistoryRef.current = [];
    };
  }, [scanning, handleBarcodeDetected]);

  
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

      console.log(" Product found:", product);

      toast.success(`Found: ${product.name} - ₹${product.price}`);

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

      
      detectionHistoryRef.current = [];
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Product not found");
      onError?.(`Barcode ${barcode} not found`);
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleManualScan = async (barcode: string) => {
    if (!barcode.trim()) {
      toast.error("Please enter a barcode");
      return;
    }

    if (!shouldProcessBarcode(barcode.trim())) {
      toast.error("Barcode already scanned recently");
      return;
    }

    console.log("📝 Manual barcode entry:", barcode);
    setDetectedBarcode("");

    
    processingTimeoutRef.current = setTimeout(() => {
      processingTimeoutRef.current = null;
    }, DEBOUNCE_WINDOW);

    lastProcessedBarcodeRef.current = barcode.trim();
    lastProcessedTimeRef.current = Date.now();

    await fetchProductByBarcode(barcode.trim());
  };

 
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

        {/* Scanning overlay with focus guide */}
        {scanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Center focus box */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-48 h-24 border-4 border-green-400 rounded-lg opacity-70"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-green-400 text-xs font-semibold">
                  ALIGN BARCODE
                </div>
              </div>
            </div>

            {/* Spinner */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin opacity-50"></div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-xs">
                Keep barcode steady and centered
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

        {/* Debug Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Last Confidence: {debugInfo.lastConfidence}%</p>
          <p>
            Temporal History: {detectionHistoryRef.current.length} detections
          </p>
          <p className="text-gray-400">
            (Requires {REQUIRED_CONSISTENT_READS} consistent reads)
          </p>
        </div>

        {isLoading && (
          <div className="mt-3 flex items-center text-blue-600">
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
            {isLoading ? "Scanning" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}