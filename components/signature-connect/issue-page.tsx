"use client"

import { useState } from 'react'
import { type Product, STAFF, CATEGORIES } from '@/lib/constants'
import { FormLabel, SelectField, Avatar } from './ui-components'
import { ArrowLeft, Minus, Plus } from 'lucide-react'

interface IssuePageProps {
  product: Product
  onNavigate: (page: string) => void
  onSubmit: (type: string, data: Record<string, unknown>) => Promise<void>
  onToast: (message: string) => void
}

export function IssuePage({ product, onNavigate, onSubmit, onToast }: IssuePageProps) {
  const [staff, setStaff] = useState('')
  const [category, setCategory] = useState('')
  const [serial, setSerial] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!staff || !category) {
      onToast('Please fill in required fields')
      return
    }
    
    if (quantity > product.stock) {
      onToast('Not enough stock available')
      return
    }

    setLoading(true)
    try {
      await onSubmit('issue', {
        productId: product.id,
        productName: product.name,
        staff,
        category,
        serial,
        quantity,
        notes,
        timestamp: new Date().toISOString()
      })
      onToast('Item issued successfully')
      onNavigate('products')
    } catch {
      onToast('Failed to issue item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#F4F4F4]">
      {/* Header */}
      <div className="p-5 pb-0">
        <button 
          onClick={() => onNavigate('detail')}
          className="flex items-center gap-2 text-foreground bg-transparent border-none cursor-pointer mb-4 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-2xl font-extrabold text-foreground mb-1">Issue Item</div>
        <div className="text-sm text-muted-foreground">Fill in the details to issue this item</div>
      </div>

      {/* Product Summary */}
      <div className="mx-5 mt-4 bg-white rounded-2xl p-4 flex items-center gap-3">
        <Avatar name={product.name} size={44} className="bg-[#F4F4F4] text-primary" />
        <div className="flex-1">
          <div className="font-semibold text-foreground">{product.name}</div>
          <div className="text-xs text-muted-foreground">Available: {product.stock} units</div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
        <div className="bg-white rounded-2xl p-4">
          <FormLabel text="Staff Member *" />
          <SelectField 
            value={staff} 
            onChange={setStaff} 
            options={STAFF}
            placeholder="Select staff member"
          />

          <FormLabel text="Category *" />
          <SelectField 
            value={category} 
            onChange={setCategory} 
            options={CATEGORIES}
            placeholder="Select category"
          />

          {product.serials.length > 0 && (
            <>
              <FormLabel text="Serial Number" />
              <SelectField 
                value={serial} 
                onChange={setSerial} 
                options={product.serials}
                placeholder="Select serial (optional)"
              />
            </>
          )}

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
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-12 h-12 rounded-xl border-2 border-border bg-white flex items-center justify-center cursor-pointer hover:bg-[#F4F4F4] transition-colors"
            >
              <Plus className="w-5 h-5 text-foreground" />
            </button>
          </div>

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
          className="w-full py-4 rounded-2xl border-none font-bold text-base cursor-pointer bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? 'Processing...' : 'Confirm Issue'}
        </button>
      </div>
    </div>
  )
}
