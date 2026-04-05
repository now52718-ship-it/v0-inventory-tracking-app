"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export function LoginPage() {
  const { login } = useAuth()
  const [role, setRole] = useState<'admin' | 'staff'>('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Demo authentication - in production, this would call an API
    if (password === 'admin' || password === 'staff') {
      const userData = {
        username: role === 'admin' ? 'Mr Isaac' : 'Staff User',
        role,
        token: `demo-token-${Date.now()}`
      }
      login(userData)
    } else {
      setError('Invalid credentials. Try "admin" or "staff"')
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#C8DEEA] min-h-screen p-4 md:p-7 flex justify-center items-center">
      <div className="w-full max-w-[400px] bg-background rounded-3xl p-8 shadow-[0_0_0_8px_#111,0_0_0_10px_#3A3A3A]">
        <div className="text-center mb-8">
          <div className="text-4xl font-extrabold text-primary mb-2">SC</div>
          <div className="text-lg font-bold text-foreground">Signature Connect</div>
          <div className="text-xs text-muted-foreground mt-1">Inventory Tracking System</div>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground block mb-1.5">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as 'admin' | 'staff')}
              className="w-full p-3 rounded-xl border-[1.5px] border-border bg-card text-foreground appearance-none"
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="text-xs text-muted-foreground block mb-1.5">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 rounded-xl border-[1.5px] border-border bg-card text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          {error && (
            <div className="text-destructive text-sm mb-4 text-center">{error}</div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-4 rounded-xl border-none bg-primary text-primary-foreground font-extrabold text-base cursor-pointer disabled:opacity-50 transition-opacity hover:opacity-90"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-xs text-muted-foreground text-center mt-6">
          Demo: Use password &quot;admin&quot; or &quot;staff&quot;
        </p>
      </div>
    </div>
  )
}
