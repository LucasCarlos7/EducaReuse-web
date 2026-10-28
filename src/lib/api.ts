const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const CHAVE_TOKEN = 'educareuse.token'

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(CHAVE_TOKEN)
    } catch {
      return null
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(CHAVE_TOKEN, token)
    } catch {
      // armazenamento indisponível: a sessão dura até fechar a página
    }
  },
  clear() {
    try {
      localStorage.removeItem(CHAVE_TOKEN)
    } catch {
      // nada a fazer
    }
  },
}

export class ApiError extends Error {
  readonly status: number
  readonly campos: string[]

  constructor(status: number, message: string, campos: string[] = []) {
    super(message)
    this.status = status
    this.campos = campos
  }
}

let aoExpirarSessao: (() => void) | null = null

export function definirAoExpirarSessao(callback: (() => void) | null) {
  aoExpirarSessao = callback
}

interface Opcoes {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

interface ProblemDetails {
  title?: string
  errors?: Record<string, string[]>
}

export async function api<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (opcoes.body !== undefined) headers['Content-Type'] = 'application/json'

  const token = tokenStorage.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let resposta: Response
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: opcoes.method ?? 'GET',
      headers,
      body: opcoes.body !== undefined ? JSON.stringify(opcoes.body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique sua internet e tente de novo.')
  }

  if (resposta.status === 401 && token) {
    aoExpirarSessao?.()
  }

  if (!resposta.ok) {
    let mensagem = 'Não foi possível concluir a ação. Tente de novo.'
    let campos: string[] = []

    try {
      const problema = (await resposta.json()) as ProblemDetails
      if (problema.title) mensagem = problema.title
      if (problema.errors) campos = Object.values(problema.errors).flat()
    } catch {
      // resposta sem corpo JSON
    }

    if (resposta.status === 401 && token) mensagem = 'Sua sessão expirou. Entre novamente.'
    if (resposta.status === 403) mensagem = 'Seu perfil não tem acesso a esta ação.'

    throw new ApiError(resposta.status, mensagem, campos)
  }

  if (resposta.status === 204) return undefined as T

  const texto = await resposta.text()
  return (texto ? JSON.parse(texto) : undefined) as T
}
