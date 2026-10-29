export type Categoria =
  | 'Caderno'
  | 'Livro'
  | 'Mochila'
  | 'Estojo'
  | 'LapisECanetas'
  | 'MaterialDeArte'
  | 'Uniforme'
  | 'Outros'

export type EstadoConservacao = 'Novo' | 'Seminovo' | 'Usado'

export type StatusMaterial = 'Disponivel' | 'Reservado' | 'Doado'

export type StatusSolicitacao = 'Pendente' | 'Aceita' | 'Recusada' | 'Entregue'

export interface Usuario {
  id: string
  nome: string
  email: string
  telefone: string | null
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export interface Material {
  id: string
  nome: string
  descricao: string | null
  imagem: string | null
  categoria: Categoria
  estadoConservacao: EstadoConservacao
  quantidade: number
  status: StatusMaterial
  doadorNome: string
  criadoEm: string
  ehMeu: boolean
}

export interface MeuMaterial {
  id: string
  nome: string
  descricao: string | null
  imagem: string | null
  categoria: Categoria
  estadoConservacao: EstadoConservacao
  quantidade: number
  status: StatusMaterial
  solicitacoesPendentes: number
  criadoEm: string
}

export interface Contato {
  nome: string
  email: string | null
  telefone: string | null
}

export interface Solicitacao {
  id: string
  materialId: string
  materialNome: string
  categoria: Categoria
  status: StatusSolicitacao
  mensagem: string | null
  criadoEm: string
  atualizadoEm: string | null
  contato: Contato
}

export const categorias: Record<Categoria, string> = {
  Caderno: 'Caderno',
  Livro: 'Livro',
  Mochila: 'Mochila',
  Estojo: 'Estojo',
  LapisECanetas: 'Lápis e canetas',
  MaterialDeArte: 'Material de arte',
  Uniforme: 'Uniforme',
  Outros: 'Outros',
}

export const estadosConservacao: Record<EstadoConservacao, string> = {
  Novo: 'Novo',
  Seminovo: 'Seminovo',
  Usado: 'Usado, em bom estado',
}

export const statusMaterial: Record<StatusMaterial, string> = {
  Disponivel: 'Disponível',
  Reservado: 'Reservado',
  Doado: 'Doado',
}

export const statusSolicitacao: Record<StatusSolicitacao, string> = {
  Pendente: 'Aguardando resposta',
  Aceita: 'Aceita',
  Recusada: 'Recusada',
  Entregue: 'Entregue',
}

export const listaCategorias = Object.keys(categorias) as Categoria[]
export const listaEstados = Object.keys(estadosConservacao) as EstadoConservacao[]
