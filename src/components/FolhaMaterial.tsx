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

// Cartão de material desenhado como uma folha de caderno pautada.
export function FolhaMaterial({ nome, descricao, imagem, categoria, estadoConservacao, quantidade, rodape, destaque }: Props) {
  return (
    <article className="folha-caderno flex h-full flex-col rounded-xl border-2 border-pauta shadow-[0_1px_0_var(--color-pauta)]">
      {imagem && (
        // margens negativas compensam o padding (20px lateral, 14px topo) + borda (2px) da .folha-caderno
        <div className="-mx-[22px] -mt-[16px] mb-3 overflow-hidden rounded-t-xl">
          <img src={imagem} alt={nome} className="h-40 w-full object-cover" />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-tinta">{categorias[categoria]}</p>
        {destaque}
      </div>
      <h2 className="text-xl font-bold text-grafite">{nome}</h2>
      {descricao && <p className="text-grafite-suave">{descricao}</p>}
      <p className="text-grafite">
        {estadosConservacao[estadoConservacao]}, {quantidade} {quantidade === 1 ? 'unidade' : 'unidades'}
      </p>
      {rodape && <div className="mt-auto pt-[14px]">{rodape}</div>}
    </article>
  )
}
