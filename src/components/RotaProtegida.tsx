import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Perfil } from '../lib/types'

export function RotaProtegida({ perfil, children }: { perfil?: Perfil; children: ReactNode }) {
  const { usuario } = useAuth()
  const location = useLocation()

  if (!usuario) {
    return <Navigate to="/entrar" replace state={{ de: location.pathname }} />
  }

  if (perfil && usuario.perfil !== perfil) {
    return <Navigate to="/" replace />
  }

  return children
}
