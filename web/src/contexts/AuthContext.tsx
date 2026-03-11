import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface AuthContextData {
  user: User | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('@taskflow:token')
    const storedUser = localStorage.getItem('@taskflow:user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }

    setIsLoading(false)
  }, [])

  async function signIn(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    const { user, token } = response.data

    localStorage.setItem('@taskflow:token', token)
    localStorage.setItem('@taskflow:user', JSON.stringify(user))

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    setUser(user)
    setToken(token)
  }

  function signOut() {
    localStorage.removeItem('@taskflow:token')
    localStorage.removeItem('@taskflow:user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
