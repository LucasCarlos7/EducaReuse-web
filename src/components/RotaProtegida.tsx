import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario } = useAuth()
  const location = useLocation()

  if (!usuario) {
    return <Navigate to="/entrar" replace state={{ de: location.pathname }} />
  }

  return children
}
