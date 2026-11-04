import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiForm } from './api'
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
  return useQuery({
    queryKey: chaves.minhasSolicitacoes,
    queryFn: () => api<Solicitacao[]>('/api/solicitacoes/minhas'),
    refetchInterval: 20_000,
  })
}

export function useSolicitacoesRecebidas() {
  return useQuery({
    queryKey: chaves.solicitacoesRecebidas,
    queryFn: () => api<Solicitacao[]>('/api/solicitacoes/recebidas'),
    refetchInterval: 20_000,
  })
}

export interface NovoMaterial {
  nome: string
  descricao?: string
  categoria: Categoria
  estadoConservacao: EstadoConservacao
  quantidade: number
  imagem?: File | null
}

export function useCriarMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: NovoMaterial) => {
      const form = new FormData()
      form.append('nome', dados.nome)
      form.append('categoria', dados.categoria)
      form.append('estadoConservacao', dados.estadoConservacao)
      form.append('quantidade', String(dados.quantidade))
      if (dados.descricao) form.append('descricao', dados.descricao)
      if (dados.imagem) form.append('imagem', dados.imagem)
      return apiForm<Material>('/api/materiais', form)
    },
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
    mutationFn: ({ id, acao, obsRecusa }: { id: string; acao: AcaoSolicitacao; obsRecusa?: string }) =>
      api<void>(`/api/solicitacoes/${id}/${acao}`, {
        method: 'POST',
        body: acao === 'recusar' ? { obs: obsRecusa ?? null } : undefined,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['solicitacoes'] }),
        queryClient.invalidateQueries({ queryKey: ['materiais'] }),
      ])
    },
  })
}
