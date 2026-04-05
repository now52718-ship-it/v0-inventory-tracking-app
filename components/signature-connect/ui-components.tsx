"use client"

import { cn } from "@/lib/utils"
import type { ProductStatus } from "@/lib/constants"

export function StatusDot({ status }: { status: ProductStatus }) {
  const colors: Record<string, string> = {
    'In Stock': 'bg-[#4CD964]',
    'In Field': 'bg-[#FF9F0A]',
    'Low Stock': 'bg-[#FF9F0A]',
    'Out of Stock': 'bg-[#FF3B30]',
    'Returned': 'bg-[#5AC8FA]',
    'Received': 'bg-[#4CD964]',
    'Faulty': 'bg-[#FF3B30]',
    'Damaged': 'bg-[#FF3B30]',
  }
  
  return (
    <span className={cn(
      "w-2 h-2 rounded-full inline-block shrink-0",
      colors[status] || 'bg-muted-foreground'
    )} />
  )
}

export function Avatar({ 
  name, 
  size = 40, 
  className,
  style
}: { 
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  
  return (
    <div 
      className={cn(
        "rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0",
        className
      )}
      style={{ 
        width: size, 
        height: size, 
        fontSize: size * 0.34,
        ...style
      }}
    >
      {initials}
    </div>
  )
}

export function Pill({ 
  label, 
  active, 
  onClick 
}: { 
  label: string
  active?: boolean
  onClick?: () => void 
}) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "px-4 py-2 rounded-full border-none cursor-pointer text-[13px] whitespace-nowrap transition-all active:scale-95",
        active 
          ? "bg-primary text-primary-foreground font-bold" 
          : "bg-secondary text-muted-foreground font-normal hover:bg-secondary/80"
      )}
    >
      {label}
    </button>
  )
}

export function NavButton({ 
  icon, 
  label, 
  active, 
  onClick, 
  light 
}: { 
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  light?: boolean
}) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "flex-1 bg-transparent border-none cursor-pointer flex flex-col items-center gap-1 py-2 transition-all active:scale-95",
        active 
          ? "text-primary" 
          : light 
            ? "text-[#AAAAAA]" 
            : "text-muted-foreground"
      )}
    >
      <span className="text-xl">{icon}</span>
      <span className={cn("text-[10px]", active ? "font-bold" : "font-normal")}>{label}</span>
    </button>
  )
}

export function FormLabel({ text }: { text: string }) {
  return (
    <div className="text-xs text-muted-foreground mb-1.5 mt-3.5">{text}</div>
  )
}

export function SelectField({ 
  value, 
  onChange, 
  options,
  placeholder = "Select an option"
}: { 
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-xl border-[1.5px] border-[#E8E8E8] bg-white text-sm text-foreground appearance-none"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-card text-foreground px-6 py-3 rounded-full text-sm font-semibold z-50 whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
      {message}
    </div>
  )
}
