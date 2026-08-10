import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationPending, setVerificationPending] = useState(false)

  // 1. Sinkronkan key localStorage dengan yang digunakan Header (wr_session & wr_user_header)
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('wr_session')
      const savedUser = localStorage.getItem('wr_user_header')
      
      if (savedSession && savedUser) {
        const sessionData = JSON.parse(savedSession)
        const userData = JSON.parse(savedUser)
        
        // Cek apakah sesi valid / belum expired
        const now = new Date().getTime()
        if (sessionData.isLoggedIn && (!sessionData.expiredAt || now < sessionData.expiredAt)) {
          setToken(sessionData.token || "active_session") // Gunakan token atau penanda sesi aktif
          setUser(userData)
        } else {
          // Hapus jika sudah expired
          localStorage.removeItem('wr_session')
          localStorage.removeItem('wr_user_header')
        }
      }
    } catch (err) {
      console.error("Gagal membaca localStorage:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const data = await response.json()
      const newToken = data.token
      const newUser = data.user
      
      // Buat struktur wr_session sesuai dengan gambar storage Anda sebelumnya
      const sessionPayload = {
        isLoggedIn: true,
        loginTime: new Date().getTime(),
        expiredAt: new Date().getTime() + (24 * 60 * 60 * 1000), // Contoh expired 24 jam
        token: newToken
      }

      setToken(newToken)
      setUser(newUser)
      
      // Simpan menggunakan key yang seragam di seluruh aplikasi
      localStorage.setItem('wr_session', JSON.stringify(sessionPayload))
      localStorage.setItem('wr_user_header', JSON.stringify(newUser))
      
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setEmailVerified(false)
    setVerificationPending(false)
    localStorage.removeItem('wr_session')
    localStorage.removeItem('wr_user_header')
  }

  const value = {
    user,
    token,
    isLoading,
    error,
    emailVerified,
    verificationPending,
    login,
    logout,
    isAuthenticated: !!user || !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}