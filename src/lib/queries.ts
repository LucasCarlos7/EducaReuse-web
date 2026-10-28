import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { Categoria, EstadoConservacao, Material, MeuMaterial, Solicitacao } from './types'

export const chaves = {
  materiais: (categoria?: Categoria, busca?: string) => ['materiais', 'disponiveis', categoria ?? 'todas', busca ?? ''] as const,
  meusMateriais: ['materiais', 'meus'] as const,
  minhasSolicitacoes: ['solicitacoes', 'minhas'] as const,
  solicitacoesRecebidas: ['solicitacoes', 'recebidas'] as const,
}

export function useMateriais(categoria?: Categoria, busca?: string) {
  const params = new URLSearchParams()
  if (categoria) params.set('categoria', categoria)
  if (busca) params.set('busca', busca)
  const query = params.toString()

  return useQuery({
    queryKey: chaves.materiais(categoria, busca),
    queryFn: () => api<Material[]>(`/api/materiais${query ? `?${query}` : ''}`),
  })
}

export function useMeusMateriais() {
  return useQuery({ queryKey: chaves.meusMateriais, queryFn: () => api<MeuMaterial[]>('/api/materiais/meus') })
}

export function useMinhasSolicitacoes() {
  return useQuery({ queryKey: chaves.minhasSolicitacoes, queryFn: () => api<Solicitacao[]>('/api/solicitacoes/minhas') })
}

export function useSolicitacoesRecebidas() {
  return useQuery({ queryKey: chaves.solicitacoesRecebidas, queryFn: () => api<Solicitacao[]>('/api/solicitacoes/recebidas') })
}

export interface NovoMaterial {
  nome: string
  descricao?: string
  categoria: Categoria
  estadoConservacao: EstadoConservacao
  quantidade: number
}

export function useCriarMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: NovoMaterial) => api<Material>('/api/materiais', { method: 'POST', body: dados }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materiais'] }),
  })
}

export function useSolicitarMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ materialId, mensagem }: { materialId: string; mensagem?: string }) =>
      api(`/api/materiais/${materialId}/solicitacoes`, { method: 'POST', body: { mensagem: mensagem || null } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solicitacoes'] }),
  })
}

export type AcaoSolicitacao = 'aceitar' | 'recusar' | 'entregar'

export function useResponderSolicitacao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, acao }: { id: string; acao: AcaoSolicitacao }) =>
      api<void>(`/api/solicitacoes/${id}/${acao}`, { method: 'POST' }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['solicitacoes'] }),
        queryClient.invalidateQueries({ queryKey: ['materiais'] }),
      ])
    },
  })
}
