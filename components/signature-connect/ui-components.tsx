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
  className 
}: { 
  name: string
  size?: number
  className?: string 
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
        fontSize: size * 0.34 
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
        "px-4 py-2 rounded-full border-none cursor-pointer text-sm whitespace-nowrap transition-colors",
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
        "flex-1 bg-transparent border-none cursor-pointer flex flex-col items-center gap-1 py-2 transition-colors",
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
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-background text-foreground px-6 py-3 rounded-full text-sm font-semibold z-50 whitespace-nowrap border border-border shadow-lg">
      {message}
    </div>
  )
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#C8DEEA] min-h-screen p-4 md:p-7 flex justify-center items-start">
      <div className="w-full max-w-[375px] rounded-[46px] overflow-hidden bg-background shadow-[0_0_0_8px_#111,0_0_0_10px_#3A3A3A,0_28px_70px_rgba(0,0,0,0.45)] flex flex-col h-[760px] relative">
        {children}
      </div>
    </div>
  )
}

export function StatusBar({ light }: { light?: boolean }) {
  return (
    <div 
      className={cn(
        "h-[46px] flex items-center justify-between px-6 shrink-0",
        light ? "bg-[#F4F4F4]" : "bg-[#0A0A0A]"
      )}
    >
      <span className={cn("text-sm font-bold", light ? "text-foreground" : "text-white")}>
        9:41
      </span>
      <div 
        className={cn(
          "w-[110px] h-[22px] rounded-xl bg-[#0A0A0A] absolute left-1/2 -translate-x-1/2",
          light && "border border-[#DDD]"
        )} 
      />
      <span className={cn("text-xs tracking-[2px]", light ? "text-[#555]" : "text-[#888]")}>
        ●▲▌
      </span>
    </div>
  )
}
