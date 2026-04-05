"use client"

import { type Product } from '@/lib/constants'
import { StatusDot, Avatar } from './ui-components'
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, QrCode, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface DetailPageProps {
  product: Product
  onNavigate: (page: string) => void
  onAction: (action: 'issue' | 'return') => void
}

export function DetailPage({ product, onNavigate, onAction }: DetailPageProps) {
  const [copiedSerial, setCopiedSerial] = useState<string | null>(null)

  const copySerial = (serial: string) => {
    navigator.clipboard.writeText(serial)
    setCopiedSerial(serial)
    setTimeout(() => setCopiedSerial(null), 2000)
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#F4F4F4]">
      {/* Header */}
      <div className="p-5 pb-0">
        <button 
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 text-foreground bg-transparent border-none cursor-pointer mb-4 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Product Info Card */}
      <div className="mx-5 bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Avatar 
            name={product.name} 
            size={56} 
            className="bg-[#F4F4F4] text-primary"
          />
          <div className="flex-1">
            <div className="text-lg font-bold text-foreground">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.cat}</div>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-[#F0F0F0]">
          <span className="text-sm text-muted-foreground">Status</span>
          <div className="flex items-center gap-2">
            <StatusDot status={product.status} />
            <span className="text-sm font-semibold text-foreground">{product.status}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-[#F0F0F0]">
          <span className="text-sm text-muted-foreground">Stock Quantity</span>
          <span className="text-2xl font-extrabold text-foreground">{product.stock}</span>
        </div>
      </div>

      {/* Serial Numbers */}
      {product.serials.length > 0 && (
        <div className="mx-5 mt-4">
          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wide mb-2">
            Serial Numbers ({product.serials.length})
          </div>
          <div className="bg-white rounded-2xl overflow-hidden">
            {product.serials.map((serial, index) => (
              <div 
                key={serial}
                className={`flex items-center justify-between p-4 ${
                  index > 0 ? 'border-t border-[#F0F0F0]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-mono text-foreground">{serial}</span>
                </div>
                <button 
                  onClick={() => copySerial(serial)}
                  className="p-2 rounded-lg bg-[#F4F4F4] border-none cursor-pointer hover:bg-[#E8E8E8] transition-colors"
                >
                  {copiedSerial === serial ? (
                    <Check className="w-4 h-4 text-[#4CD964]" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto p-5 flex gap-3">
        <button 
          onClick={() => {
            onAction('issue')
            onNavigate('issue')
          }}
          disabled={product.stock === 0}
          className="flex-1 py-4 rounded-2xl border-none font-bold text-base cursor-pointer flex items-center justify-center gap-2 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <ArrowUpRight className="w-5 h-5" />
          Issue Item
        </button>
        <button 
          onClick={() => {
            onAction('return')
            onNavigate('return')
          }}
          className="flex-1 py-4 rounded-2xl border-2 border-border font-bold text-base cursor-pointer flex items-center justify-center gap-2 bg-white text-foreground hover:bg-[#F4F4F4] transition-colors"
        >
          <ArrowDownLeft className="w-5 h-5" />
          Return Item
        </button>
      </div>
    </div>
  )
}
