import { statusSolicitacao, type StatusSolicitacao } from '../lib/types'
import { Etiqueta } from './ui'

const cores = {
  Pendente: 'amarelo',
  Aceita: 'azul',
  Recusada: 'cinza',
  Entregue: 'verde',
} as const

export function EtiquetaStatus({ status }: { status: StatusSolicitacao }) {
  return <Etiqueta cor={cores[status]}>{statusSolicitacao[status]}</Etiqueta>
}
