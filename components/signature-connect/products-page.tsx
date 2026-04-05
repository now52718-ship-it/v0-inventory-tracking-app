"use client"

import { useState } from 'react'
import { PRODUCTS, PRODUCT_CATEGORIES, type Product } from '@/lib/constants'
import { Avatar, StatusDot, Pill } from './ui-components'
import { Search } from 'lucide-react'

interface ProductsPageProps {
  onSelectProduct: (product: Product) => void
  onNavigate: (page: string) => void
}

export function ProductsPage({ onSelectProduct, onNavigate }: ProductsPageProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.cat === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-5">
      {/* Header */}
      <div className="text-[22px] font-extrabold text-foreground mb-3">Products</div>
      
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          placeholder="Search products..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-10 pr-4 bg-card rounded-xl border-none text-foreground placeholder:text-muted-foreground text-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {PRODUCT_CATEGORIES.map((cat) => (
          <Pill 
            key={cat} 
            label={cat} 
            active={category === cat} 
            onClick={() => setCategory(cat)} 
          />
        ))}
      </div>

      {/* Products List */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No products found
          </div>
        ) : (
          filtered.map((product) => (
            <div 
              key={product.id} 
              onClick={() => {
                onSelectProduct(product)
                onNavigate('detail')
              }}
              className="bg-card p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-secondary transition-colors"
            >
              <Avatar 
                name={product.name} 
                size={44} 
                className="bg-secondary text-primary"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground truncate">{product.name}</div>
                <div className="text-[11px] text-muted-foreground">{product.cat}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-foreground">{product.stock}</div>
                <div className="flex items-center gap-1 justify-end">
                  <StatusDot status={product.status} />
                  <span className="text-[10px] text-muted-foreground">{product.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
