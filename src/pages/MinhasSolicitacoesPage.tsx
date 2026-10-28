import { DadosContato } from '../components/Contato'
import { EtiquetaStatus } from '../components/StatusSolicitacao'
import { Cabecalho, Carregando, ErroApi, Vazio } from '../components/ui'
import { formatarData } from '../lib/format'
import { useMinhasSolicitacoes } from '../lib/queries'
import { categorias, type StatusSolicitacao } from '../lib/types'

const explicacao: Record<StatusSolicitacao, string> = {
  Pendente: 'Quem doou ainda não respondeu.',
  Aceita: 'Seu pedido foi aceito. Combine a entrega pelos contatos abaixo.',
  Recusada: 'Este pedido não foi aceito. Procure outros materiais na lista.',
  Entregue: 'Quem doou confirmou a entrega.',
}

export function MinhasSolicitacoesPage() {
  const { data, isPending, error } = useMinhasSolicitacoes()

  return (
    <div className="flex flex-col gap-6">
      <Cabecalho titulo="Minhas solicitações">Acompanhe a resposta de quem doou cada material.</Cabecalho>

      {isPending && <Carregando />}
      <ErroApi erro={error} />

      {data && data.length === 0 && (
        <Vazio titulo="Você ainda não solicitou nenhum material." acao={{ texto: 'Ver materiais disponíveis', para: '/' }} />
      )}

      {data && data.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2">
          {data.map((s) => (
            <li key={s.id} className="flex flex-col gap-3 rounded-xl border-2 border-pauta bg-papel p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-tinta">{categorias[s.categoria]}</p>
                  <p className="text-lg font-bold">{s.materialNome}</p>
                  <p className="text-grafite-suave">Pedido em {formatarData(s.criadoEm)}</p>
                </div>
                <EtiquetaStatus status={s.status} />
              </div>
              <p>{explicacao[s.status]}</p>
              <DadosContato contato={s.contato} papel="doador" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
