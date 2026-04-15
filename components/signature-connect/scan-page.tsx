"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PRODUCTS } from '@/lib/constants'
import { QrCode, Flashlight, X, Camera, CameraOff } from 'lucide-react'
import { scanQRCode } from '@/lib/itemService'
import { useRef as useRefLib } from 'react'

interface ScanPageProps {
  onNavigate: (page: string) => void
  onToast: (message: string) => void
  onSelectProduct: (product: typeof PRODUCTS[0]) => void
}

export function ScanPage({ onNavigate, onToast, onSelectProduct }: ScanPageProps) {
  const { user } = useAuth()
  const [serial, setSerial] = useState('')
  const [action, setAction] = useState<'issue' | 'return' | ''>('')
  const [flashOn, setFlashOn] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.log('[v0] Camera error:', err)
      setCameraError('Camera access denied or not available')
      setCameraActive(false)
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    setFlashOn(false)
  }, [])

  // Toggle flash/torch
  const toggleFlash = useCallback(async () => {
    if (!streamRef.current) return
    
    const track = streamRef.current.getVideoTracks()[0]
    if (track) {
      try {
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean }
        if (capabilities.torch) {
          const newFlashState = !flashOn
          await track.applyConstraints({
            advanced: [{ torch: newFlashState } as MediaTrackConstraintSet]
          })
          setFlashOn(newFlashState)
        } else {
          onToast('Torch not available on this device')
        }
      } catch {
        onToast('Unable to toggle flash')
      }
    }
  }, [flashOn, onToast])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  const handleScan = async () => {
    if (!serial) {
      onToast('Please enter a serial number')
      return
    }
    
    if (!action) {
      onToast('Please select an action')
      return
    }

    setIsScanning(true)

    try {
      // Try to fetch from Supabase first
      const scannedItem = await scanQRCode(serial, user?.id || '', user?.username || 'Unknown')
      
      if (scannedItem) {
        onToast(`Item found: ${serial}`)
        // Find matching product for UI
        const product = PRODUCTS.find(p => 
          p.serials.some(s => s.toLowerCase() === serial.toLowerCase())
        )
        if (product) {
          onSelectProduct(product)
        }
        stopCamera()
        setTimeout(() => onNavigate(action), 800)
      } else {
        // Fallback to mock data
        const product = PRODUCTS.find(p => 
          p.serials.some(s => s.toLowerCase() === serial.toLowerCase())
        )

        if (product) {
          onSelectProduct(product)
          onToast(`Found: ${product.name}`)
          stopCamera()
          setTimeout(() => onNavigate(action), 800)
        } else {
          onToast('Serial number not found in inventory')
        }
      }
    } catch (error) {
      console.error('Error scanning QR code:', error)
      // Fallback to mock data
      const product = PRODUCTS.find(p => 
        p.serials.some(s => s.toLowerCase() === serial.toLowerCase())
      )

      if (product) {
        onSelectProduct(product)
        onToast(`Found: ${product.name}`)
        stopCamera()
        setTimeout(() => onNavigate(action), 800)
      } else {
        onToast('Serial number not found')
      }
    } finally {
      setIsScanning(false)
    }
  }

  // Simulate QR scan (for demo purposes)
  const simulateScan = () => {
    const randomProduct = PRODUCTS.find(p => p.serials.length > 0)
    if (randomProduct && randomProduct.serials[0]) {
      setSerial(randomProduct.serials[0])
      onToast('QR code detected')
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-extrabold text-foreground">Scan QR</div>
        <div className="flex gap-2">
          {cameraActive && (
            <button 
              onClick={toggleFlash}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer transition-all active:scale-95 ${
                flashOn ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
              }`}
            >
              <Flashlight className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={cameraActive ? stopCamera : startCamera}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer transition-all active:scale-95 ${
              cameraActive ? 'bg-destructive text-white' : 'bg-card text-muted-foreground'
            }`}
          >
            {cameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div 
        className="w-full aspect-square bg-card rounded-3xl flex flex-col items-center justify-center mb-5 cursor-pointer transition-all relative overflow-hidden"
        onClick={!cameraActive ? simulateScan : undefined}
      >
        {cameraActive ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            {/* Scanning overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner markers */}
              <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-primary rounded-tl-xl" />
              <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-primary rounded-tr-xl" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-primary rounded-bl-xl" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-primary rounded-br-xl" />
              
              {/* Scanning line animation */}
              <div className="absolute left-6 right-6 h-0.5 bg-primary/80 animate-pulse top-1/2" />
            </div>
            
            {/* Tap to capture hint */}
            <div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                simulateScan()
              }}
            >
              Tap to simulate scan
            </div>
          </>
        ) : (
          <>
            {/* Placeholder when camera is off */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            
            {/* Corner markers */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-[3px] border-t-[3px] border-primary rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-[3px] border-t-[3px] border-primary rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-[3px] border-b-[3px] border-primary rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-[3px] border-b-[3px] border-primary rounded-br-lg" />
            
            {cameraError ? (
              <>
                <CameraOff className="w-12 h-12 text-muted-foreground mb-3" />
                <span className="text-sm text-muted-foreground text-center px-4">{cameraError}</span>
                <span className="text-xs text-muted-foreground/60 mt-2">Tap to simulate scan</span>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-muted-foreground mb-3" />
                <span className="text-sm text-muted-foreground">Tap camera icon to start</span>
                <span className="text-xs text-muted-foreground/60 mt-1">or tap here to simulate</span>
              </>
            )}
          </>
        )}
      </div>

      {/* Serial Input */}
      <div className="mb-4">
        <label className="text-xs text-muted-foreground block mb-1.5">Serial Number</label>
        <div className="relative">
          <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            value={serial} 
            onChange={(e) => setSerial(e.target.value)}
            placeholder="Enter or scan serial number"
            className="w-full py-3 pl-11 pr-10 bg-card rounded-xl border-none text-foreground placeholder:text-muted-foreground text-sm"
          />
          {serial && (
            <button 
              onClick={() => setSerial('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center border-none cursor-pointer active:scale-95 transition-transform"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Action Selection */}
      <div className="mb-5">
        <label className="text-xs text-muted-foreground block mb-2">Select Action</label>
        <div className="flex gap-3">
          <button 
            onClick={() => setAction('issue')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 cursor-pointer transition-all active:scale-[0.98] ${
              action === 'issue' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-card text-foreground border-transparent hover:border-primary/30'
            }`}
          >
            Issue Item
          </button>
          <button 
            onClick={() => setAction('return')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 cursor-pointer transition-all active:scale-[0.98] ${
              action === 'return' 
                ? 'bg-[#5AC8FA] text-white border-[#5AC8FA]' 
                : 'bg-card text-foreground border-transparent hover:border-[#5AC8FA]/30'
            }`}
          >
            Return Item
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleScan}
        disabled={!serial || !action}
        className="w-full py-4 rounded-2xl border-none font-bold text-base cursor-pointer bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all mt-auto"
      >
        Proceed
      </button>
    </div>
  )
}
