"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PRODUCTS, CONDITIONS, type Product } from '@/lib/constants'
import { Avatar } from './ui-components'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { logScanQRActivity } from '@/lib/activityLogService'

interface StockPageProps {
  onNavigate: (page: string) => void
  onSubmit: (type: string, data: Record<string, unknown>) => Promise<void>
  onToast: (message: string) => void
}

function FormLabel({ text }: { text: string }) {
  return <div className="text-xs text-[#888] mb-1.5 mt-3.5">{text}</div>
}

function SelectField({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 px-3.5 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-[#111] appearance-none"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}

export function StockPage({ onNavigate, onSubmit, onToast }: StockPageProps) {
  const { user } = useAuth()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [condition, setCondition] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [serialNumber, setSerialNumber] = useState('')
  const [supplier, setSupplier] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedProduct || !condition) {
      onToast('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      // Create transaction record in Supabase
      const transactionData = {
        transaction_id: `TXN-${Date.now()}`,
        serial_number: serialNumber || `AUTO-${Date.now()}`,
        product_id: String(selectedProduct.id), // Convert to string
        action: 'ADD_STOCK',
        user_id: user?.id || null,
        customer_name: supplier || 'Walk-in',
        condition,
        approval_status: 'approved'
      }

      console.log('Adding transaction to Supabase:', transactionData)
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        onToast(`Supabase error: ${error.message || 'Unknown error'}`)
        throw error
      }

      console.log('Transaction created:', data)

      // Log the activity
      if (user?.id) {
        try {
          await logScanQRActivity(
            user.id, 
            user.username || 'Unknown', 
            serialNumber || `AUTO-${Date.now()}`
          )
        } catch (logError) {
          console.error('Error logging activity:', logError)
          // Don't fail if logging fails
        }
      }

      // Call the submission handler
      await onSubmit('stock', {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        condition,
        quantity,
        serialNumber,
        supplier,
        timestamp: new Date().toISOString()
      })
      
      onToast('✅ Stock added successfully!')
      onNavigate('dashboard')
    } catch (error: any) {
      console.error('Error adding stock:', error)
      onToast(`Error: ${error?.message || 'Failed to add stock'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F4F4] flex flex-col">
      {/* Header */}
      <div className="p-3 px-5 flex items-center bg-[#F4F4F4] shrink-0">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="bg-transparent border-none cursor-pointer text-2xl text-[#111] p-1 leading-none"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center text-base font-bold text-[#111]">Add Stock</div>
        <div className="w-7" />
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
          <div className="flex gap-2.5 items-center mt-1">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-11 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-[22px] cursor-pointer text-[#111] font-bold"
            >
              −
            </button>
            <div className="flex-1 text-center text-[26px] font-extrabold text-[#111]">
              {quantity}
            </div>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-11 h-11 rounded-xl border-none bg-primary text-[22px] cursor-pointer text-primary-foreground font-bold"
            >
              +
            </button>
          </div>

          <FormLabel text="Serial Number (if applicable)" />
          <input 
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Enter serial number"
            className="w-full p-3 px-3.5 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-[#111] placeholder:text-[#9A9A9A]"
          />

          <FormLabel text="Supplier" />
          <input 
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Enter supplier name"
            className="w-full p-3 px-3.5 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-[#111] placeholder:text-[#9A9A9A]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-5 pt-0">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl border-none font-extrabold text-base cursor-pointer bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? 'Processing...' : 'Submit → Log to Sheets'}
        </button>
      </div>
    </div>
  )
}
