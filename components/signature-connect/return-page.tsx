"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { type Product, STAFF, CONDITIONS } from '@/lib/constants'
import { Avatar } from './ui-components'
import { ArrowLeft } from 'lucide-react'
import { returnItem } from '@/lib/itemService'

interface ReturnPageProps {
  product: Product
  onNavigate: (page: string) => void
  onSubmit: (type: string, data: Record<string, unknown>) => Promise<void>
  onToast: (message: string) => void
}

function FormLabel({ text }: { text: string }) {
  return <div className="text-xs text-[#888] mb-1.5 mt-3.5">{text}</div>
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 px-3.5 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-[#111] appearance-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}

export function ReturnPage({ product, onNavigate, onSubmit, onToast }: ReturnPageProps) {
  const { user } = useAuth()
  const [returnedBy, setReturnedBy] = useState(STAFF[2])
  const [receivedBy, setReceivedBy] = useState(STAFF[0])
  const [condition, setCondition] = useState(CONDITIONS[0])
  const [loading, setLoading] = useState(false)

  const isBadCondition = ['Faulty', 'Damaged'].includes(condition)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Get serial number from product
      const serialNumber = product.serials && product.serials.length > 0 
        ? product.serials[0] 
        : `SN-${Date.now()}`

      // Return item in Supabase
      await returnItem(
        serialNumber,
        String(product.id),
        user?.id || '',
        user?.username || 'Unknown',
        condition
      )

      await onSubmit('return', {
        productId: product.id,
        productName: product.name,
        returnedBy,
        receivedBy,
        condition,
        serialNumber,
        timestamp: new Date().toISOString()
      })
      onToast('Return logged successfully!')
      onNavigate('dashboard')
    } catch (error) {
      console.error('Error returning item:', error)
      onToast('Failed to return item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F4F4] flex flex-col">
      {/* Header */}
      <div className="p-3 px-5 flex items-center bg-[#F4F4F4] shrink-0">
        <button 
          onClick={() => onNavigate('detail')}
          className="bg-transparent border-none cursor-pointer text-2xl text-[#111] p-1 leading-none"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center text-base font-bold text-[#111]">Return Item</div>
        <div className="w-7" />
      </div>

      {/* Product Summary */}
      <div className="mx-5 mb-0.5 bg-white rounded-[14px] p-3 px-3.5 border border-[#EBEBEB] flex items-center gap-2.5 shrink-0">
        <Avatar name={product.name} size={40} />
        <div>
          <div className="text-sm font-bold text-[#111]">{product.name}</div>
          <div className="text-[11px] text-[#888]">{product.serials[0] || 'No serial'}</div>
        </div>
      </div>

      {/* Form */}
      <div className="px-5 flex-1">
        <FormLabel text="Returned By *" />
        <SelectField value={returnedBy} onChange={setReturnedBy} options={STAFF} />

        <FormLabel text="Received By *" />
        <SelectField value={receivedBy} onChange={setReceivedBy} options={STAFF} />

        <FormLabel text="Condition *" />
        <div className="flex flex-wrap gap-2 mt-1">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCondition(c)}
              className="px-3.5 py-2 rounded-full text-xs cursor-pointer transition-colors"
              style={{
                border: condition === c ? '2px solid #AAEF35' : '1.5px solid #E0E0E0',
                background: condition === c ? 'rgba(170, 239, 53, 0.13)' : '#fff',
                color: condition === c ? '#1A2C00' : '#555',
                fontWeight: condition === c ? 700 : 400
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Faulty/Damaged Warning */}
        {isBadCondition && (
          <div className="bg-[#FFF8E1] rounded-xl p-3 px-3.5 mt-3 border border-[#FFD54F]">
            <div className="text-[13px] font-bold text-[#E65100]">Faulty / Damaged</div>
            <div className="text-xs text-[#BF360C] mt-0.5 leading-relaxed">
              Admin will be prompted to update the Faulty Units column in Google Sheets.
            </div>
          </div>
        )}

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl border-none bg-primary text-primary-foreground font-extrabold text-base cursor-pointer mt-5 mb-4 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? 'Processing...' : 'Submit → Log to Sheets'}
        </button>
      </div>
    </div>
  )
}
