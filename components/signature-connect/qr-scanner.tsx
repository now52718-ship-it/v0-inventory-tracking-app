'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScannerConfig } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (serialNumber: string) => void;
  onScanError?: (error: Error) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isScanning) {
      const config: Html5QrcodeScannerConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      scannerRef.current = new Html5QrcodeScanner('qr-reader', config, false);

      scannerRef.current.render(
        (result) => {
          if (result) {
            setIsScanning(false);
            onScanSuccess(result);
          }
        },
        (error) => {
          // Ignore error logs during scanning
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {
          // Ignore cleanup errors
        });
        scannerRef.current = null;
      }
    };
  }, [isScanning, onScanSuccess]);

  const handleStartScanning = () => {
    setError(null);
    setIsScanning(true);
  };

  const handleStopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isScanning && (
        <div className="w-full space-y-4">
          <div id="qr-reader" className="w-full" />
          <button
            onClick={handleStopScanning}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Stop Scanning
          </button>
        </div>
      )}

      {!isScanning && (
        <button
          onClick={handleStartScanning}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Start Scanning QR Code
        </button>
      )}
    </div>
  );
}
