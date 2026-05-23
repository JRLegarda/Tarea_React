import { createContext, useContext, useMemo, useState } from 'react'
import { request } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = async (username, password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })

    const jwt = data?.token
    if (!jwt) {
      throw new Error('El backend no devolvio un token valido')
    }

    localStorage.setItem('token', jwt)
    setToken(jwt)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}