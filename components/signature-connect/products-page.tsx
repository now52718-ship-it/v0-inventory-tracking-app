"use client"

import { useState } from 'react'
import { PRODUCTS, type Product } from '@/lib/constants'
import { Avatar, StatusDot } from './ui-components'
import { Search } from 'lucide-react'

interface ProductsPageProps {
  onSelectProduct: (product: Product) => void
  onNavigate: (page: string) => void
}

export function ProductsPage({ onSelectProduct, onNavigate }: ProductsPageProps) {
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase())
  })

  const getAvatarColors = (status: string) => {
    if (status === 'Out of Stock') return { bg: '#2A1212', tc: '#FF3B30' }
    if (status === 'Low Stock') return { bg: '#2A2010', tc: '#FF9F0A' }
    return { bg: '#252525', tc: '#AAEF35' }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 pt-3.5 shrink-0">
        <div className="text-[22px] font-extrabold text-foreground mb-3">Products</div>
        
        {/* Search */}
        <div className="bg-card rounded-xl px-3 mb-3.5 flex items-center border border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            placeholder="Search products…" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-foreground py-2.5 px-2 flex-1 text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="px-5 pb-4 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No products found
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((product) => {
              const colors = getAvatarColors(product.status)
              return (
                <div 
                  key={product.id} 
                  onClick={() => {
                    onSelectProduct(product)
                    onNavigate('detail')
                  }}
                  className="bg-card rounded-2xl p-3 px-3.5 flex items-center gap-3 cursor-pointer border border-border hover:bg-secondary transition-colors"
                >
                  <Avatar 
                    name={product.name} 
                    size={44} 
                    className="shrink-0"
                    style={{ backgroundColor: colors.bg, color: colors.tc }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{product.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {product.cat} · {product.serials.length || 'No'} serial{product.serials.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[22px] font-extrabold text-foreground">{product.stock}</div>
                    <div className="flex items-center gap-1 justify-end">
                      <StatusDot status={product.status} />
                      <span className="text-[10px] text-muted-foreground">{product.status}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
