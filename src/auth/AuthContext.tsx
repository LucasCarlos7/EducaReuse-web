import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, definirAoExpirarSessao, tokenStorage } from '../lib/api'
import type { AuthResponse, Usuario } from '../lib/types'

const CHAVE_USUARIO = 'educareuse.usuario'

export interface DadosCadastro {
  nome: string
  email: string
  senha: string
  telefone?: string
}

interface AuthContextValue {
  usuario: Usuario | null
  entrar: (email: string, senha: string) => Promise<Usuario>
  cadastrar: (dados: DadosCadastro) => Promise<Usuario>
  sair: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function lerUsuarioSalvo(): Usuario | null {
  if (!tokenStorage.get()) return null
  try {
    const bruto = localStorage.getItem(CHAVE_USUARIO)
    return bruto ? (JSON.parse(bruto) as Usuario) : null
  } catch {
    return null
  }
}

function salvarSessao(resposta: AuthResponse) {
  tokenStorage.set(resposta.token)
  try {
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.usuario))
  } catch {
    // armazenamento indisponível
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [usuario, setUsuario] = useState<Usuario | null>(lerUsuarioSalvo)

  const sair = useCallback(() => {
    tokenStorage.clear()
    try {
      localStorage.removeItem(CHAVE_USUARIO)
    } catch {
      // nada a fazer
    }
    setUsuario(null)
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    definirAoExpirarSessao(sair)
    return () => definirAoExpirarSessao(null)
  }, [sair])

  const entrar = useCallback(async (email: string, senha: string) => {
    const resposta = await api<AuthResponse>('/api/auth/login', { method: 'POST', body: { email, senha } })
    salvarSessao(resposta)
    setUsuario(resposta.usuario)
    return resposta.usuario
  }, [])

  const cadastrar = useCallback(async (dados: DadosCadastro) => {
    const resposta = await api<AuthResponse>('/api/auth/registrar', { method: 'POST', body: dados })
    salvarSessao(resposta)
    setUsuario(resposta.usuario)
    return resposta.usuario
  }, [])

  const valor = useMemo(() => ({ usuario, entrar, cadastrar, sair }), [usuario, entrar, cadastrar, sair])

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return contexto
}
