"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PRODUCTS, type Product } from '@/lib/constants'
import { PhoneFrame, StatusBar, NavButton, Toast } from './ui-components'
import { LoginPage } from './login-page'
import { DashboardPage } from './dashboard-page'
import { ProductsPage } from './products-page'
import { DetailPage } from './detail-page'
import { IssuePage } from './issue-page'
import { ReturnPage } from './return-page'
import { StockPage } from './stock-page'
import { ScanPage } from './scan-page'
import { Home, ScanLine, Package, User, LogOut } from 'lucide-react'

type Screen = 'dashboard' | 'products' | 'detail' | 'issue' | 'return' | 'stock' | 'scan'

export function AppContent() {
  const { user, logout, isLoading } = useAuth()
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0])
  const [action, setAction] = useState<'issue' | 'return' | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }

  const handleNavigate = (page: string) => {
    setScreen(page as Screen)
  }

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleAction = (act: 'issue' | 'return') => {
    setAction(act)
  }

  const handleSubmit = async (type: string, data: Record<string, unknown>) => {
    console.log(`${type} submission:`, data)
    // In production, this would call your API
    return Promise.resolve()
  }

  const handleLogout = () => {
    logout()
    setScreen('dashboard')
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-[#C8DEEA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-primary mb-2">SC</div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  // Show login if no user
  if (!user) {
    return <LoginPage />
  }

  const lightScreens: Screen[] = ['detail', 'issue', 'return', 'stock']
  const isLightScreen = lightScreens.includes(screen)
  const showNav = !['issue', 'return', 'stock', 'scan', 'detail'].includes(screen)

  const getScreenContent = () => {
    switch (screen) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />
      case 'products':
        return <ProductsPage onSelectProduct={handleSelectProduct} onNavigate={handleNavigate} />
      case 'detail':
        return <DetailPage product={selectedProduct} onNavigate={handleNavigate} onAction={handleAction} onToast={showToast} />
      case 'issue':
        return <IssuePage product={selectedProduct} onNavigate={handleNavigate} onSubmit={handleSubmit} onToast={showToast} />
      case 'return':
        return <ReturnPage product={selectedProduct} onNavigate={handleNavigate} onSubmit={handleSubmit} onToast={showToast} />
      case 'stock':
        return <StockPage onNavigate={handleNavigate} onSubmit={handleSubmit} onToast={showToast} />
      case 'scan':
        return <ScanPage onNavigate={handleNavigate} onToast={showToast} onSelectProduct={handleSelectProduct} />
      default:
        return <DashboardPage onNavigate={handleNavigate} />
    }
  }

  return (
    <PhoneFrame>
      {/* Status bar */}
      <StatusBar light={isLightScreen} />

      {/* Content */}
      <div 
        className={`flex-1 overflow-hidden flex flex-col min-h-0 ${
          isLightScreen ? 'bg-[#F4F4F4]' : 'bg-background'
        }`}
      >
        {getScreenContent()}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} />}

      {/* Bottom nav */}
      {showNav && (
        <div 
          className={`h-[68px] flex items-center shrink-0 pb-1 border-t ${
            isLightScreen 
              ? 'bg-white border-[#EBEBEB]' 
              : 'bg-card border-border'
          }`}
        >
          <NavButton 
            icon={<Home className="w-5 h-5" />} 
            label="Home" 
            active={screen === 'dashboard'} 
            light={isLightScreen} 
            onClick={() => handleNavigate('dashboard')} 
          />
          <NavButton 
            icon={<ScanLine className="w-5 h-5" />} 
            label="Scan" 
            active={screen === 'scan'} 
            light={isLightScreen} 
            onClick={() => handleNavigate('scan')} 
          />
          <NavButton 
            icon={<Package className="w-5 h-5" />} 
            label="Products" 
            active={screen === 'products'} 
            light={isLightScreen} 
            onClick={() => handleNavigate('products')} 
          />
          <NavButton 
            icon={<LogOut className="w-5 h-5" />} 
            label="Logout" 
            active={false} 
            light={isLightScreen} 
            onClick={handleLogout} 
          />
        </div>
      )}
    </PhoneFrame>
  )
}
