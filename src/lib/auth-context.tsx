'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
}

interface LoginResponse {
  token: string
}

interface AuthContextType {
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
    isLoggedIn: boolean;
  user: { name: string; email: string; } | null;
  login: (user: { name: string; email: string; avatar: string }) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  
}

const API_URL = 'http://localhost:5000'
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem('token')
    if (token) {
      validateToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      const response = await axios.get<User>(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error validating token:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password })
      const { token } = response.data
      localStorage.setItem('token', token)
      await validateToken(token)
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await axios.post(`${API_URL}/register`, { email, password })
      // After successful registration, sign in the user
      await signIn(email, password)
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('token')
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }
  const login = (user: { name: string; email: string; avatar: string }) => {
    setUser({ id: '', name: user.name, email: user.email })
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('token')
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${API_URL}/register`, { name, email, password })
      await signIn(email, password)
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signIn, 
        signUp, 
        signOut, 
        isLoggedIn, 
        login, 
        logout,
        signup
      }}
    >
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