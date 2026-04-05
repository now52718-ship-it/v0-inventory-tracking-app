"use client"

import { useState } from 'react'
import { type Product } from '@/lib/constants'
import { StatusDot } from './ui-components'
import { ArrowLeft, AlertTriangle, ChevronDown } from 'lucide-react'

interface DetailPageProps {
  product: Product
  onNavigate: (page: string) => void
  onAction: (action: 'issue' | 'return') => void
  onToast: (message: string) => void
}

// Generate unique QR pattern based on serial
function generateQRPattern(serial: string) {
  const seed = serial.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const pattern: number[][] = []
  for (let i = 0; i < 15; i++) {
    const row: number[] = []
    for (let j = 0; j < 15; j++) {
      // Fixed QR corners
      if ((i < 5 && j < 5) || (i < 5 && j >= 10) || (i >= 10 && j < 5)) {
        if (i === 0 || i === 4 || j === 0 || j === 4 || (i >= 10 && (i === 10 || i === 14)) || (j >= 10 && (j === 10 || j === 14))) {
          row.push(1)
        } else if ((i === 2 && j === 2) || (i === 2 && j === 12) || (i === 12 && j === 2)) {
          row.push(1)
        } else {
          row.push(0)
        }
      } else {
        // Random data based on seed
        row.push((seed * (i + 1) * (j + 1)) % 3 === 0 ? 1 : 0)
      }
    }
    pattern.push(row)
  }
  return pattern
}

function QRGrid({ serial }: { serial: string }) {
  const pattern = generateQRPattern(serial)
  const cellSize = 5
  
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

// Generate mock serial numbers for a product
function generateSerials(product: Product): { serial: string; specs: string }[] {
  const baseSerials = product.serials.length > 0 ? product.serials : [`${product.name.slice(0, 3).toUpperCase()}001`]
  const items: { serial: string; specs: string }[] = []
  
  for (let i = 0; i < Math.min(8, Math.max(product.stock, baseSerials.length)); i++) {
    const serial = baseSerials[i] || `${product.name.slice(0, 4).toUpperCase()}${String(i + 1).padStart(4, '0')}`
    items.push({
      serial,
      specs: `${product.cat} · Rev ${String.fromCharCode(65 + (i % 3))} · ${2023 + (i % 2)}`
    })
  }
  
  return items
}

export function DetailPage({ product, onNavigate, onAction, onToast }: DetailPageProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const serialItems = generateSerials(product)

  const handleAccordionClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F4F4] flex flex-col">
      {/* Header */}
      <div className="p-3 px-5 flex items-center bg-[#F4F4F4] shrink-0">
        <button 
          onClick={() => onNavigate('products')}
          className="bg-transparent border-none cursor-pointer text-2xl text-[#111] p-1 leading-none active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center text-base font-bold text-[#111]">{product.name}</div>
        <div className="w-7" />
      </div>

      {/* Content */}
      <div className="px-5 pb-5 flex-1">
        {/* Product Summary Card */}
        <div className="bg-white rounded-[18px] p-4 mb-3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-lg font-extrabold text-[#111]">{product.name}</div>
              <div className="text-xs text-[#888]">{product.cat}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot status={product.status} />
              <span className="text-xs font-semibold text-[#111]">{product.status}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-[#F0F0F0]">
            <span className="text-xs text-[#888]">Available Units</span>
            <span className="text-2xl font-extrabold text-[#111]">{product.stock}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mb-3">
          <button 
            onClick={() => {
              onAction('issue')
              onNavigate('issue')
            }}
            disabled={product.stock === 0}
            className="flex-1 py-3.5 rounded-2xl border-none bg-primary text-primary-foreground font-bold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
          >
            Issue Item
          </button>
          <button 
            onClick={() => {
              onAction('return')
              onNavigate('return')
            }}
            className="flex-1 py-3.5 rounded-2xl bg-transparent border-[1.5px] border-[#DEDEDE] text-[#111] font-semibold text-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            Return
          </button>
        </div>

        <button 
          onClick={() => onToast('Faulty flag noted - syncing to Sheets')}
          className="w-full py-3 mb-4 rounded-2xl bg-transparent border-[1.5px] border-[#DEDEDE] text-[#111] font-semibold text-sm cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
        >
          <AlertTriangle className="w-4 h-4 text-[#FF9F0A]" />
          Mark Faulty
        </button>

        {/* Serial Numbers Accordion */}
        <div className="text-[11px] text-[#888] font-bold tracking-[1px] uppercase mb-2">
          Serial Numbers ({serialItems.length})
        </div>
        
        <div className="space-y-2">
          {serialItems.map((item, index) => (
            <div key={item.serial} className="bg-white rounded-[14px] overflow-hidden">
              {/* Accordion Header */}
              <button
                onClick={() => handleAccordionClick(index)}
                className="w-full p-3.5 flex items-center justify-between bg-transparent border-none cursor-pointer text-left active:bg-[#F8F8F8] transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-[#111]">{item.serial}</div>
                  <div className="text-[11px] text-[#888]">{item.specs}</div>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-[#888] transition-transform duration-300 ease-in-out ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {/* Accordion Content */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  expandedIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-3.5 pb-3.5 pt-0 border-t border-[#F0F0F0]">
                    <div className="flex gap-4 items-center pt-3">
                      {/* QR Code */}
                      <div className="rounded-lg overflow-hidden border border-[#F0F0F0] p-2 bg-white">
                        <QRGrid serial={item.serial} />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1">
                        <div className="text-[10px] text-[#888] mb-0.5">Full Serial</div>
                        <div className="text-xs font-mono font-semibold text-[#111] mb-2 break-all">{item.serial}</div>
                        
                        <div className="text-[10px] text-[#888] mb-0.5">Mini Specs</div>
                        <div className="text-xs text-[#555]">{item.specs}</div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard?.writeText(item.serial)
                        onToast('Serial copied to clipboard')
                      }}
                      className="w-full mt-3 py-2.5 rounded-xl bg-[#F4F4F4] text-[#111] text-xs font-semibold border-none cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      Copy Serial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
