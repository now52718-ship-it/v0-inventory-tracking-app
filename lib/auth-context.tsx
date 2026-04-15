"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from './constants'
import { logLoginActivity } from './activityLogService'

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('sc_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('sc_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (userData: User) => {
    localStorage.setItem('sc_user', JSON.stringify(userData))
    localStorage.setItem('sc_token', userData.token)
    setUser(userData)
    
    // Log login activity
    try {
      await logLoginActivity(userData.id || '', userData.name || 'Unknown User')
    } catch (error) {
      console.error('Error logging login activity:', error)
    }
  }

  const logout = () => {
    // Log logout activity if user exists
    if (user) {
      try {
        // Create activity log for logout
        const { supabase } = require('./supabaseClient')
        supabase.from('activity_logs').insert({
          user_id: user.id,
          user_name: user.name,
          action: 'LOGOUT',
          description: `${user.name} logged out of the system`,
        })
      } catch (error) {
        console.error('Error logging logout activity:', error)
      }
    }
    
    localStorage.removeItem('sc_user')
    localStorage.removeItem('sc_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
