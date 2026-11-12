import type { ReactNode } from 'react'
import { categorias, estadosConservacao, type Categoria, type EstadoConservacao } from '../lib/types'

interface Props {
  nome: string
  descricao: string | null
  imagem?: string | null
  categoria: Categoria
  estadoConservacao: EstadoConservacao
  quantidade: number
  rodape?: ReactNode
  destaque?: ReactNode
}

export const iconeCategoria: Record<Categoria, string> = {
  Caderno: '📓',
  Livro: '📚',
  Mochila: '🎒',
  Estojo: '🖊️',
  LapisECanetas: '✏️',
  MaterialDeArte: '🎨',
  Uniforme: '👕',
  Outros: '📦',
}

// Cartão de material desenhado como uma folha de caderno pautada.
export function FolhaMaterial({ nome, descricao, imagem, categoria, estadoConservacao, quantidade, rodape, destaque }: Props) {
  return (
    <article className="folha-caderno flex h-full flex-col overflow-hidden rounded-xl border-2 border-pauta shadow-[0_1px_0_var(--color-pauta)]">
      {/* Área de imagem ou placeholder */}
      <div className="-mt-[14px] -mr-[20px] mb-4 -ml-[48px]">
        {imagem ? (
          <img src={imagem} alt={nome} className="h-44 w-full object-cover" />
        ) : (
          <div className="flex h-36 items-center justify-center bg-tinta-clara">
            <span className="text-5xl opacity-50" aria-hidden="true">{iconeCategoria[categoria]}</span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-tinta">{categorias[categoria]}</p>
        {destaque}
      </div>

      <h2 className="text-xl font-bold text-grafite leading-snug">{nome}</h2>

      {descricao && <p className="mt-1 text-sm text-grafite-suave line-clamp-2">{descricao}</p>}

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full border border-pauta bg-mesa px-3 py-0.5 text-xs font-semibold text-grafite-suave">
          {estadosConservacao[estadoConservacao]}
        </span>
        <span className="inline-flex items-center rounded-full border border-pauta bg-mesa px-3 py-0.5 text-xs font-semibold text-grafite-suave">
          {quantidade} {quantidade === 1 ? 'unidade' : 'unidades'}
        </span>
      </div>

      {rodape && <div className="mt-auto pt-4">{rodape}</div>}
    </article>
  )
}
