"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PRODUCTS, RECENT_ACTIVITY } from '@/lib/constants'
import { Avatar, StatusDot, Pill } from './ui-components'
import { Plus } from 'lucide-react'

interface DashboardPageProps {
  onNavigate: (page: string) => void
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth()
  const [filter, setFilter] = useState('All')
  
  const inStock = PRODUCTS.filter((p) => p.status === 'In Stock').length
  const lowStock = PRODUCTS.filter((p) => p.status === 'Low Stock').length
  const outOfStock = PRODUCTS.filter((p) => p.status === 'Out of Stock').length
  const totalItems = PRODUCTS.reduce((a, p) => a + p.stock, 0)

  const filteredActivity = RECENT_ACTIVITY.filter((a) => {
    if (filter === 'All') return true
    if (filter === 'In Field') return a.type === 'issue'
    if (filter === 'Returned') return a.type === 'return'
    if (filter === 'Received') return a.type === 'stock'
    return true
  })

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="px-5 pt-3.5 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2.5 items-center">
            <Avatar name={user?.username || 'User'} size={40} />
            <div>
              <div className="text-[11px] text-muted-foreground">
                {user?.role === 'admin' ? 'Store Manager' : 'Staff'}
              </div>
              <div className="text-[15px] font-bold text-foreground">{user?.username}</div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('stock')}
            className="w-9 h-9 rounded-full bg-primary border-none flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity text-[22px] font-bold text-primary-foreground leading-none"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Overview Card with Diagonal Stripes */}
        <div 
          className="rounded-[22px] p-5 mb-3.5 overflow-hidden border border-border"
          style={{
            background: `repeating-linear-gradient(135deg, #1C1C1C 0px, #1C1C1C 14px, #212121 14px, #212121 28px)`
          }}
        >
          <div className="text-[11px] text-muted-foreground mb-1.5 tracking-[1px] uppercase">
            Stock Overview
          </div>
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-[11px] text-muted-foreground">Total Products</div>
              <div className="text-[38px] font-extrabold text-foreground leading-none">{PRODUCTS.length}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground">In Stock</div>
              <div className="text-[38px] font-extrabold text-primary leading-none">{inStock}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-[rgba(255,159,10,0.15)] rounded-xl p-2 px-2.5">
              <div className="text-[10px] text-[#FF9F0A] font-semibold">Low</div>
              <div className="text-xl font-extrabold text-[#FF9F0A]">{lowStock}</div>
            </div>
            <div className="flex-1 bg-[rgba(255,59,48,0.14)] rounded-xl p-2 px-2.5">
              <div className="text-[10px] text-[#FF3B30] font-semibold">Empty</div>
              <div className="text-xl font-extrabold text-[#FF3B30]">{outOfStock}</div>
            </div>
            <div className="flex-1 bg-[rgba(170,239,53,0.12)] rounded-xl p-2 px-2.5">
              <div className="text-[10px] text-primary font-semibold">Items</div>
              <div className="text-xl font-extrabold text-primary">{totalItems}</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-3.5 overflow-x-auto pb-0.5">
          {['All', 'In Field', 'Returned', 'Received'].map((f) => (
            <Pill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-5 pb-4 flex-1">
        <div className="text-[11px] text-muted-foreground font-bold tracking-[1px] uppercase mb-2.5">
          Recent Activity
        </div>
        <div className="space-y-2">
          {filteredActivity.map((activity) => (
            <div 
              key={activity.id}
              onClick={() => onNavigate('products')}
              className="bg-card rounded-2xl p-3 px-3.5 flex items-center gap-3 cursor-pointer border border-border hover:bg-secondary transition-colors"
            >
              <Avatar 
                name={activity.product} 
                size={44} 
                className="bg-secondary text-primary"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">
                  {activity.product}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {activity.serial ? activity.serial.slice(0, 16) : `×${activity.quantity} units`} · {activity.date}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[13px] font-bold text-foreground mb-0.5">
                  {activity.type === 'issue' ? 'Issued' : activity.type === 'return' ? 'Returned' : 'Stock In'}
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <StatusDot status={activity.type === 'issue' ? 'In Field' : activity.type === 'return' ? 'Returned' : 'Received'} />
                  <span className="text-[11px] text-muted-foreground">
                    {activity.type === 'issue' ? 'In Field' : activity.type === 'return' ? 'Returned' : 'Received'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
