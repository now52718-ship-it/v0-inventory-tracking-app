"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from './constants'

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

  const login = (userData: User) => {
    localStorage.setItem('sc_user', JSON.stringify(userData))
    localStorage.setItem('sc_token', userData.token)
    setUser(userData)
  }

  const logout = () => {
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
