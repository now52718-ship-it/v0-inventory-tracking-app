"use client"

import { useState } from 'react'
import { PRODUCTS, PRODUCT_CATEGORIES, CONDITIONS, type Product } from '@/lib/constants'
import { FormLabel, SelectField, Avatar } from './ui-components'
import { ArrowLeft, Minus, Plus } from 'lucide-react'

interface StockPageProps {
  onNavigate: (page: string) => void
  onSubmit: (type: string, data: Record<string, unknown>) => Promise<void>
  onToast: (message: string) => void
}

export function StockPage({ onNavigate, onSubmit, onToast }: StockPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [condition, setCondition] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [serialNumber, setSerialNumber] = useState('')
  const [supplier, setSupplier] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedProduct || !condition) {
      onToast('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      await onSubmit('stock', {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        condition,
        quantity,
        serialNumber,
        supplier,
        notes,
        timestamp: new Date().toISOString()
      })
      onToast('Stock added successfully')
      onNavigate('dashboard')
    } catch {
      onToast('Failed to add stock')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#F4F4F4]">
      {/* Header */}
      <div className="p-5 pb-0">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-foreground bg-transparent border-none cursor-pointer mb-4 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-2xl font-extrabold text-foreground mb-1">Add Stock</div>
        <div className="text-sm text-muted-foreground">Add new inventory to the system</div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
        <div className="bg-white rounded-2xl p-4">
          <FormLabel text="Product *" />
          <SelectField 
            value={selectedProduct?.name || ''} 
            onChange={(name) => {
              const product = PRODUCTS.find(p => p.name === name)
              setSelectedProduct(product || null)
            }} 
            options={PRODUCTS.map(p => p.name)}
            placeholder="Select product"
          />

          {selectedProduct && (
            <div className="mt-3 bg-[#F4F4F4] rounded-xl p-3 flex items-center gap-3">
              <Avatar name={selectedProduct.name} size={40} className="bg-white text-primary" />
              <div>
                <div className="font-semibold text-foreground text-sm">{selectedProduct.name}</div>
                <div className="text-xs text-muted-foreground">Current stock: {selectedProduct.stock}</div>
              </div>
            </div>
          )}

          <FormLabel text="Item Condition *" />
          <SelectField 
            value={condition} 
            onChange={setCondition} 
            options={CONDITIONS}
            placeholder="Select condition"
          />

          <FormLabel text="Quantity" />
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-xl border-2 border-border bg-white flex items-center justify-center cursor-pointer hover:bg-[#F4F4F4] transition-colors"
            >
              <Minus className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-2xl font-extrabold text-foreground min-w-[60px] text-center">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 rounded-xl border-2 border-border bg-white flex items-center justify-center cursor-pointer hover:bg-[#F4F4F4] transition-colors"
            >
              <Plus className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <FormLabel text="Serial Number (if applicable)" />
          <input 
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Enter serial number"
            className="w-full p-3 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-foreground placeholder:text-muted-foreground"
          />

          <FormLabel text="Supplier" />
          <input 
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Enter supplier name"
            className="w-full p-3 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-foreground placeholder:text-muted-foreground"
          />

          <FormLabel text="Notes" />
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            rows={3}
            className="w-full p-3 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-foreground resize-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-5 pt-0">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl border-none font-bold text-base cursor-pointer bg-[#4CD964] text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? 'Processing...' : 'Add Stock'}
        </button>
      </div>
    </div>
  )
}
