'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaLightbulb, FaKeyboard } from 'react-icons/fa';

export default function BarcodeScanPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success' | 'error'>('scanning');
  const [manualInput, setManualInput] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use rear camera if available
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('カメラにアクセスできません');
    }
  };

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks();
      
      tracks?.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const toggleFlash = () => {
    // Note: Direct flash control is not reliably supported across browsers
    alert('このデバイスはフラッシュ制御に対応していません');
  };

  const simulateBarcodeScan = () => {
    // Simulated barcode scan for demonstration
    const mockBarcode = '4901234567890';
    setScannedBarcode(mockBarcode);
    setScanStatus('success');

    // Simulate Yahoo product search
    handleYahooProductSearch(mockBarcode);
  };

  const handleYahooProductSearch = (barcode: string) => {
    // TODO: Implement actual Yahoo product search API call
    console.log('Searching Yahoo for barcode:', barcode);
  };

  const handleManualBarcodeInput = () => {
    setManualInput(true);
  };

  const handleBarcodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('manualBarcode') as HTMLInputElement;
    const barcode = input.value;

    if (barcode) {
      setScannedBarcode(barcode);
      setScanStatus('success');
      handleYahooProductSearch(barcode);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {!manualInput ? (
        <div className="flex-grow relative">
          {/* Camera View */}
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror the camera view
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full hidden" 
          />

          {/* Scan Guide Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3/4 h-1/2 border-4 border-white rounded-lg opacity-50"></div>
          </div>

          {/* Control Buttons */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <button 
              onClick={toggleFlash}
              className="p-3 rounded-full bg-white text-gray-700"
            >
              <FaLightbulb />
            </button>
            <button 
              onClick={simulateBarcodeScan}
              className="bg-blue-500 text-white p-3 rounded-full"
            >
              スキャン
            </button>
            <button 
              onClick={handleManualBarcodeInput}
              className="bg-gray-500 text-white p-3 rounded-full"
            >
              <FaKeyboard />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col justify-center flex-grow">
          <h2 className="text-2xl font-bold mb-6 text-center">バーコード手動入力</h2>
          <form onSubmit={handleBarcodeSubmit} className="space-y-4">
            <input 
              type="text" 
              name="manualBarcode"
              placeholder="バーコード番号を入力" 
              className="form-input w-full"
              pattern="\d*"
              required
            />
            <div className="flex space-x-4">
              <button 
                type="button"
                onClick={() => setManualInput(false)}
                className="btn btn-secondary flex-1"
              >
                キャンセル
              </button>
              <button 
                type="submit"
                className="btn btn-primary flex-1"
              >
                検索
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scan Result Area */}
      {scannedBarcode && (
        <div className="bg-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">バーコード番号</p>
              <p className="text-lg">{scannedBarcode}</p>
            </div>
            <div>
              {scanStatus === 'success' && (
                <span className="text-green-500">スキャン成功</span>
              )}
              {scanStatus === 'error' && (
                <span className="text-red-500">スキャン失敗</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
