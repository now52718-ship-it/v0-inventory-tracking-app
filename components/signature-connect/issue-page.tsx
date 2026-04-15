"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { type Product, STAFF, CATEGORIES } from '@/lib/constants'
import { Avatar } from './ui-components'
import { ArrowLeft } from 'lucide-react'
import { issueItem } from '@/lib/itemService'

interface IssuePageProps {
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

export function IssuePage({ product, onNavigate, onSubmit, onToast }: IssuePageProps) {
  const { user } = useAuth()
  const [category, setCategory] = useState(CATEGORIES[0])
  const [quantity, setQuantity] = useState(1)
  const [issuedTo, setIssuedTo] = useState(STAFF[2])
  const [authorizedBy, setAuthorizedBy] = useState(STAFF[0])
  const [customer, setCustomer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!customer) {
      onToast('Please enter customer name')
      return
    }

    setLoading(true)
    try {
      // Get serial number from product (use first available)
      const serialNumber = product.serials && product.serials.length > 0 
        ? product.serials[0] 
        : `SN-${Date.now()}`

      console.log('Issuing item:', { serialNumber, productId: product.id, customer })

      // Issue item in Supabase
      await issueItem(
        serialNumber,
        String(product.id),
        user?.id || '',
        user?.username || 'Unknown',
        customer
      )

      console.log('Item issued successfully')

      await onSubmit('issue', {
        productId: product.id,
        productName: product.name,
        category,
        quantity,
        issuedTo,
        authorizedBy,
        customer,
        serialNumber,
        timestamp: new Date().toISOString()
      })
      onToast('✅ Item issued successfully!')
      onNavigate('dashboard')
    } catch (error: any) {
      console.error('Error issuing item:', error)
      onToast(`Error: ${error?.message || 'Failed to issue item'}`)
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
        <div className="flex-1 text-center text-base font-bold text-[#111]">Issue Item</div>
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
        <FormLabel text="Category *" />
        <SelectField value={category} onChange={setCategory} options={CATEGORIES} />

        <FormLabel text="Quantity *" />
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
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-11 h-11 rounded-xl border-none bg-primary text-[22px] cursor-pointer text-primary-foreground font-bold"
          >
            +
          </button>
        </div>

        <FormLabel text="Issued To *" />
        <SelectField value={issuedTo} onChange={setIssuedTo} options={STAFF} />

        <FormLabel text="Authorized By *" />
        <SelectField value={authorizedBy} onChange={setAuthorizedBy} options={STAFF} />

        <FormLabel text="Customer Name (optional)" />
        <input 
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full p-3 px-3.5 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-[#111] box-border placeholder:text-[#9A9A9A]"
        />

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
