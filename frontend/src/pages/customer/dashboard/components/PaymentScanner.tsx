import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

interface PaymentScannerProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
  licenseKey?: string;
}

const LICENSE_KEY = `KeFRCnUhhYFUXbgMovfF5f+nfHiDif52ktDeYb++EyMvELKf8VnAipcybsRJjOYErut/oJ4py+twYuHmLkqxufK8M+0kMeqi+54vVJrb15z2fBtOzXn1tbpB2euxWkBZAPJyRzqQUDh27KGkdbtAH3wUj3HmlqipvQ38VDxcIfnYffhiSU6j/e73tyt3lzOcjpVMyeyfLRED4/sE3vHTgrrCi2RrifbLZCVnRnLL8ohuaEh/nZ47Cxs5kWPYMpHRtvZwzIWZ14skh9YxOqjogK7OWN4RPURY0gRH3VmQWTjsdl6S4gUUXDH9kuhLEpXX81OMeJZvv+J1QUupCS7CHA==
U2NhbmJvdFNESwpsb2NhbGhvc3R8aGluZHVzdGFuLWJpbGxzLXgxYWIudmVyY2VsLmFwcAoxNzY4NTIxNTk5CjgzODg2MDcKOA==
`;

export default function PaymentScanner({
  onScanSuccess,
  onClose,
  licenseKey = LICENSE_KEY,
}: PaymentScannerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeScanbotSDK = async () => {
      console.log("Initializing Scanbot SDK for Payment Scanner...");
      try {
        const module = await import("scanbot-web-sdk/ui");
        const ScanbotSDK = module.default;

        // Check if already initialized to avoid re-init errors
        // Scanbot usually keeps status in its internal state, we can try to catch or check a global
        // For web sdk UI, initialize is safe to call but we add a check just in case.
        if ((window as any).scanbotInitialized) {
          console.log("Scanbot already initialized (from window)");
          setIsInitialized(true);
          return;
        }

        await ScanbotSDK.initialize({
          licenseKey: licenseKey,
          enginePath: "/wasm/",
        });

        (window as any).scanbotInitialized = true;
        console.log("Scanbot SDK initialized successfully");
        setIsInitialized(true);
      } catch (err: any) {
        console.error("Scanbot SDK initialization error:", err);
        setError("Failed to initialize scanner: " + err.message);
        toast.error("Failed to initialize scanner");
      }
    };

    initializeScanbotSDK();
  }, [licenseKey]);

  const startScanner = useCallback(async () => {
    if (!isInitialized || isLaunching) return;

    console.log("Attempting to launch scanner...");
    setIsLaunching(true);
    try {
      const module = await import("scanbot-web-sdk/ui");
      const ScanbotSDK = module.default;

      const config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
      
      // Safe configuration (aligning with BarcodeScanner.tsx)
      config.palette = config.palette || {};
      config.palette.sbColorPrimary = "#561485";
      config.palette.sbColorSecondary = "#3C47BA";
      
      config.topBar = config.topBar || {};
      config.topBar.mode = "GRADIENT";
      
      config.userGuidance = config.userGuidance || {};
      config.userGuidance.title = config.userGuidance.title || {};
      (config.userGuidance.title as any).text = "Scan Merchant QR Code";
      
      const useCase = new ScanbotSDK.UI.Config.SingleScanningMode();
      config.useCase = useCase;

      console.log("Launching Scanbot UI...");
      const result = await ScanbotSDK.UI.createBarcodeScanner(config);

      console.log("Scanner closed, result:", result);

      if (result && result.items && result.items.length > 0) {
        const firstItem = result.items[0] as any;
        let scannedText = "";

        if (firstItem.barcode?.text) {
          scannedText = firstItem.barcode.text;
        } else if (firstItem.text) {
          scannedText = firstItem.text;
        }

        if (scannedText) {
          console.log("Scan success:", scannedText);
          onScanSuccess(scannedText);
        } else {
          toast.error("Could not read QR code");
        }
      }
      
      onClose();
    } catch (err: any) {
      console.error("Scanner launch error:", err);
      toast.error("Scanner failed to start");
      setError("Scanner launch failed: " + err.message);
      setIsLaunching(false);
    }
  }, [isInitialized, isLaunching, onScanSuccess, onClose]);

  // Try to auto-start once initialized
  useEffect(() => {
    if (isInitialized && !isLaunching) {
      startScanner();
    }
  }, [isInitialized, isLaunching, startScanner]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center space-y-8 shadow-2xl">
        <div className="space-y-4">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Payment Scanner</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Please scan the merchant's physical QR code to complete the transaction.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          {!isInitialized && !error && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Initializing SDK...</p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-red-500 uppercase tracking-tight">{error}</p>
              <button 
                onClick={onClose}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600"
              >
                Close Scanner
              </button>
            </div>
          )}

          {isInitialized && !error && (
            <button
              onClick={startScanner}
              disabled={isLaunching}
              className="w-full py-5 bg-[#561485] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#561485]/20 active:scale-95 transition-all"
            >
              {isLaunching ? "Launching Camera..." : "Start Scanning"}
            </button>
          )}
        </div>

        {!isLaunching && (
          <button 
            onClick={onClose}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
          >
            Cancel Payment
          </button>
        )}
      </div>
    </div>
  );
}
