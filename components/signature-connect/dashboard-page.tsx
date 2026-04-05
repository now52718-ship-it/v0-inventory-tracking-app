"use client"

import { useAuth } from '@/lib/auth-context'
import { PRODUCTS, RECENT_ACTIVITY } from '@/lib/constants'
import { Avatar, StatusDot } from './ui-components'
import { Plus, ArrowUpRight, ArrowDownLeft, Package } from 'lucide-react'

interface DashboardPageProps {
  onNavigate: (page: string) => void
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth()
  const inStock = PRODUCTS.filter((p) => p.status === 'In Stock').length
  const lowStock = PRODUCTS.filter((p) => p.status === 'Low Stock').length
  const outOfStock = PRODUCTS.filter((p) => p.status === 'Out of Stock').length

  return (
    <div className="flex-1 overflow-y-auto flex flex-col p-5 scrollbar-hide">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-3 items-center">
          <Avatar name={user?.username || 'User'} size={44} />
          <div>
            <div className="text-[11px] text-muted-foreground">
              {user?.role === 'admin' ? 'Manager' : 'Staff'}
            </div>
            <div className="text-[15px] font-bold text-foreground">{user?.username}</div>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('stock')}
          className="w-9 h-9 rounded-full bg-primary border-none flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Stock Overview Card */}
      <div className="bg-card rounded-[22px] p-5 mb-5">
        <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-3">
          Stock Overview
        </div>
        <div className="flex justify-between">
          <div>
            <div className="text-[11px] text-muted-foreground">Total Products</div>
            <div className="text-[32px] font-extrabold text-foreground">{PRODUCTS.length}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground">In Stock</div>
            <div className="text-[32px] font-extrabold text-primary">{inStock}</div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF9F0A]" />
            <span className="text-xs text-muted-foreground">Low Stock: {lowStock}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="text-xs text-muted-foreground">Out: {outOfStock}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <button 
          onClick={() => onNavigate('products')}
          className="bg-card rounded-2xl p-4 border-none cursor-pointer flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs text-foreground font-medium">Issue</span>
        </button>
        <button 
          onClick={() => onNavigate('products')}
          className="bg-card rounded-2xl p-4 border-none cursor-pointer flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#5AC8FA]/20 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-[#5AC8FA]" />
          </div>
          <span className="text-xs text-foreground font-medium">Return</span>
        </button>
        <button 
          onClick={() => onNavigate('stock')}
          className="bg-card rounded-2xl p-4 border-none cursor-pointer flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#4CD964]/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-[#4CD964]" />
          </div>
          <span className="text-xs text-foreground font-medium">Add Stock</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide mb-3">
        Recent Activity
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        {RECENT_ACTIVITY.map((activity) => (
          <div 
            key={activity.id}
            className="bg-card rounded-2xl p-3 flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              activity.type === 'issue' ? 'bg-[#FF9F0A]/20' :
              activity.type === 'return' ? 'bg-[#5AC8FA]/20' :
              'bg-[#4CD964]/20'
            }`}>
              {activity.type === 'issue' ? (
                <ArrowUpRight className={`w-4 h-4 text-[#FF9F0A]`} />
              ) : activity.type === 'return' ? (
                <ArrowDownLeft className="w-4 h-4 text-[#5AC8FA]" />
              ) : (
                <Package className="w-4 h-4 text-[#4CD964]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">
                {activity.product}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {activity.type === 'issue' ? 'Issued to' : activity.type === 'return' ? 'Returned by' : 'Added by'} {activity.staff}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-foreground">
                {activity.type === 'issue' ? '-' : '+'}{activity.quantity}
              </div>
              <div className="text-[10px] text-muted-foreground">{activity.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
