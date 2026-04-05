"use client"

import { type Product } from '@/lib/constants'
import { StatusDot, Avatar } from './ui-components'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

interface DetailPageProps {
  product: Product
  onNavigate: (page: string) => void
  onAction: (action: 'issue' | 'return') => void
  onToast: (message: string) => void
}

// QR Code Grid Component
function QRGrid() {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,1,0,1,1,0,1,1],
    [0,1,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,1,0,0],
    [1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0],
    [0,1,0,1,1,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,1,0,0,1,1],
    [1,0,1,1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,1,0,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,1,0,1,1,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,1,0,0,1,1],
  ]
  const cellSize = 7
  
  return (
    <svg width={pattern[0].length * cellSize} height={pattern.length * cellSize} className="block">
      <rect width="100%" height="100%" fill="white"/>
      {pattern.map((row, ri) =>
        row.map((cell, ci) =>
          cell ? (
            <rect 
              key={`${ri}-${ci}`} 
              x={ci * cellSize} 
              y={ri * cellSize} 
              width={cellSize} 
              height={cellSize} 
              fill="#111"
            />
          ) : null
        )
      )}
    </svg>
  )
}

export function DetailPage({ product, onNavigate, onAction, onToast }: DetailPageProps) {
  const serial = product.serials[0] || 'N/A'

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F4F4] flex flex-col">
      {/* Header */}
      <div className="p-3 px-5 flex items-center bg-[#F4F4F4] shrink-0">
        <button 
          onClick={() => onNavigate('products')}
          className="bg-transparent border-none cursor-pointer text-2xl text-[#111] p-1 leading-none"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center text-base font-bold text-[#111]">Details</div>
        <div className="w-7" />
      </div>

      {/* Content */}
      <div className="px-5 pb-5 flex-1">
        {/* Product Info Card */}
        <div className="bg-white rounded-[18px] p-4 mb-3 border border-[#EBEBEB]">
          <div className="text-xl font-extrabold text-[#111] mb-3">{product.name}</div>
          <div className="flex gap-3 mb-1">
            <div className="flex-1">
              <div className="text-[11px] text-[#888] mb-0.5">Serial Number</div>
              <div className="text-xs font-semibold text-[#111] break-all">{serial}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#888] mb-0.5">Category</div>
              <div className="text-xs font-semibold text-[#111]">{product.cat}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#888] mb-0.5">Status</div>
              <div className="flex items-center gap-1">
                <StatusDot status={product.status} />
                <span className="text-xs font-semibold text-[#111]">{product.status}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#F0F0F0] flex justify-between items-center">
            <span className="text-xs text-[#888]">Outstanding Balance</span>
            <span className="text-lg font-extrabold text-[#111]">{product.stock} pcs</span>
          </div>
        </div>

        {/* Issue Button */}
        <button 
          onClick={() => {
            onAction('issue')
            onNavigate('issue')
          }}
          disabled={product.stock === 0}
          className="w-full py-4 rounded-2xl border-none bg-primary text-primary-foreground font-extrabold text-base cursor-pointer mb-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Issue Item
        </button>

        {/* Secondary Buttons */}
        <div className="flex gap-2.5 mb-3.5">
          <button 
            onClick={() => {
              onAction('return')
              onNavigate('return')
            }}
            className="flex-1 py-3.5 rounded-2xl bg-transparent border-[1.5px] border-[#DEDEDE] text-[#111] font-semibold text-sm cursor-pointer hover:bg-white transition-colors"
          >
            ↩ Return
          </button>
          <button 
            onClick={() => onToast('Faulty flag noted - update Sheets')}
            className="flex-1 py-3.5 rounded-2xl bg-transparent border-[1.5px] border-[#DEDEDE] text-[#111] font-semibold text-sm cursor-pointer hover:bg-white transition-colors flex items-center justify-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            Mark Faulty
          </button>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-[18px] p-4 pt-4.5 border border-[#EBEBEB] text-center">
          <div className="text-xs text-[#888] mb-3">↓ Download QR Code</div>
          <div className="flex justify-center mb-2.5">
            <div className="rounded-[10px] overflow-hidden border border-[#F0F0F0]">
              <QRGrid />
            </div>
          </div>
          <div className="text-[11px] text-[#999] font-mono">{serial}</div>
        </div>
      </div>
    </div>
  )
}
