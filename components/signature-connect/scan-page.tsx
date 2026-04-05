"use client"

import { useState } from 'react'
import { PRODUCTS } from '@/lib/constants'
import { Camera, QrCode, Flashlight, X } from 'lucide-react'

interface ScanPageProps {
  onNavigate: (page: string) => void
  onToast: (message: string) => void
  onSelectProduct: (product: typeof PRODUCTS[0]) => void
}

export function ScanPage({ onNavigate, onToast, onSelectProduct }: ScanPageProps) {
  const [serial, setSerial] = useState('')
  const [action, setAction] = useState<'issue' | 'return' | ''>('')
  const [flashOn, setFlashOn] = useState(false)

  const handleScan = () => {
    if (!serial) {
      onToast('Please enter a serial number')
      return
    }
    
    if (!action) {
      onToast('Please select an action')
      return
    }

    // Find product with this serial
    const product = PRODUCTS.find(p => 
      p.serials.some(s => s.toLowerCase() === serial.toLowerCase())
    )

    if (product) {
      onSelectProduct(product)
      onToast(`Found: ${product.name}`)
      setTimeout(() => onNavigate(action), 800)
    } else {
      onToast('Serial number not found')
    }
  }

  // Simulate QR scan (demo)
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
        <button 
          onClick={() => setFlashOn(!flashOn)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors ${
            flashOn ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
          }`}
        >
          <Flashlight className="w-5 h-5" />
        </button>
      </div>

      {/* Camera View Placeholder */}
      <div 
        onClick={simulateScan}
        className="w-full aspect-square bg-card rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center mb-5 cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden"
      >
        {/* Scanning animation overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        {/* Corner markers */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-3 border-t-3 border-primary rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-3 border-t-3 border-primary rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-3 border-b-3 border-primary rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-3 border-b-3 border-primary rounded-br-lg" />
        
        <Camera className="w-12 h-12 text-muted-foreground mb-3" />
        <span className="text-sm text-muted-foreground">Tap to simulate scan</span>
        <span className="text-xs text-muted-foreground/60 mt-1">(Camera access would be here)</span>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center border-none cursor-pointer"
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
            className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 cursor-pointer transition-all ${
              action === 'issue' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-card text-foreground border-border hover:border-primary/50'
            }`}
          >
            Issue Item
          </button>
          <button 
            onClick={() => setAction('return')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 cursor-pointer transition-all ${
              action === 'return' 
                ? 'bg-[#5AC8FA] text-white border-[#5AC8FA]' 
                : 'bg-card text-foreground border-border hover:border-[#5AC8FA]/50'
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
        className="w-full py-4 rounded-2xl border-none font-bold text-base cursor-pointer bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity mt-auto"
      >
        Proceed
      </button>
    </div>
  )
}
