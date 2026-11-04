import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DadosContato } from '../components/Contato'
import { FolhaMaterial } from '../components/FolhaMaterial'
import { EtiquetaStatus } from '../components/StatusSolicitacao'
import { Aviso, Botao, Cabecalho, Carregando, ErroApi, Etiqueta, Vazio } from '../components/ui'
import { formatarData } from '../lib/format'
import { useMeusMateriais, useResponderSolicitacao, useSolicitacoesRecebidas, type AcaoSolicitacao } from '../lib/queries'
import { categorias, statusMaterial, type Solicitacao, type StatusMaterial } from '../lib/types'

const ordemStatus = { Pendente: 0, Aceita: 1, Entregue: 2, Recusada: 3 } as const

const corStatusMaterial: Record<StatusMaterial, 'verde' | 'amarelo' | 'cinza'> = {
  Disponivel: 'verde',
  Reservado: 'amarelo',
  Doado: 'cinza',
}

function ModalConfirmacaoAceitar({ onConfirmar, onCancelar }: { onConfirmar: () => void; onCancelar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div className="absolute inset-0 bg-black/50" onClick={onCancelar} />
      <div className="relative w-full max-w-sm rounded-2xl border-2 border-pauta bg-papel p-6 shadow-xl">
        <h2 id="modal-titulo" className="mb-2 text-lg font-bold">Aceitar solicitação?</h2>
        <p className="mb-6 text-grafite">Ao aceitar, as outras solicitações deste material serão recusadas automaticamente.</p>
        <div className="flex justify-end gap-3">
          <Botao variante="secundario" onClick={onCancelar}>Cancelar</Botao>
          <Botao onClick={onConfirmar}>Aceitar</Botao>
        </div>
      </div>
    </div>
  )
}

function ModalConfirmacaoRecusar({ onConfirmar, onCancelar }: { onConfirmar: (obs: string) => void; onCancelar: () => void }) {
  const [obs, setObs] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-recusar-titulo">
      <div className="absolute inset-0 bg-black/50" onClick={onCancelar} />
      <div className="relative w-full max-w-sm rounded-2xl border-2 border-pauta bg-papel p-6 shadow-xl">
        <h2 id="modal-recusar-titulo" className="mb-2 text-lg font-bold">Recusar solicitação?</h2>
        <p className="mb-4 text-grafite">Você pode deixar uma observação opcional para quem fez o pedido.</p>
        <textarea
          className="mb-4 w-full resize-none rounded-lg border-2 border-pauta bg-papel p-3 text-sm focus:border-tinta focus:outline-none"
          rows={3}
          maxLength={500}
          placeholder="Motivo da recusa (opcional)"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Botao variante="secundario" onClick={onCancelar}>Cancelar</Botao>
          <Botao variante="perigo" onClick={() => onConfirmar(obs)}>Recusar</Botao>
        </div>
      </div>
    </div>
  )
}

function CartaoSolicitacaoRecebida({ solicitacao }: { solicitacao: Solicitacao }) {
  const responder = useResponderSolicitacao()
  const [confirmandoAceitacao, setConfirmandoAceitacao] = useState(false)
  const [confirmandoRecusa, setConfirmandoRecusa] = useState(false)

  function executar(acao: AcaoSolicitacao) {
    if (acao === 'aceitar') {
      setConfirmandoAceitacao(true)
      return
    }
    if (acao === 'recusar') {
      setConfirmandoRecusa(true)
      return
    }
    responder.mutate({ id: solicitacao.id, acao })
  }

  function confirmarAceitacao() {
    setConfirmandoAceitacao(false)
    responder.mutate({ id: solicitacao.id, acao: 'aceitar' })
  }

  function confirmarRecusa(obs: string) {
    setConfirmandoRecusa(false)
    responder.mutate({ id: solicitacao.id, acao: 'recusar', obsRecusa: obs.trim() || undefined })
  }

  return (
    <>
    {confirmandoAceitacao && (
      <ModalConfirmacaoAceitar onConfirmar={confirmarAceitacao} onCancelar={() => setConfirmandoAceitacao(false)} />
    )}
    {confirmandoRecusa && (
      <ModalConfirmacaoRecusar onConfirmar={confirmarRecusa} onCancelar={() => setConfirmandoRecusa(false)} />
    )}
    <li className="flex flex-col gap-3 rounded-xl border-2 border-pauta bg-papel p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-tinta">{categorias[solicitacao.categoria]}</p>
          <p className="text-lg font-bold">{solicitacao.materialNome}</p>
          <p className="text-grafite-suave">
            Pedido por {solicitacao.contato.nome} em {formatarData(solicitacao.criadoEm)}
          </p>
        </div>
        <EtiquetaStatus status={solicitacao.status} />
      </div>

      {solicitacao.mensagem && <blockquote className="border-l-4 border-pauta pl-3 italic text-grafite">“{solicitacao.mensagem}”</blockquote>}

      <DadosContato contato={solicitacao.contato} papel="beneficiário" material={solicitacao.materialNome} />
      <ErroApi erro={responder.error} />

      {solicitacao.status === 'Pendente' && (
        <div className="flex flex-wrap gap-2">
          <Botao carregando={responder.isPending && responder.variables?.acao === 'aceitar'} disabled={responder.isPending} onClick={() => executar('aceitar')}>
            Aceitar
          </Botao>
          <Botao variante="perigo" carregando={responder.isPending && responder.variables?.acao === 'recusar'} disabled={responder.isPending} onClick={() => executar('recusar')}>
            Recusar
          </Botao>
        </div>
      )}

      {solicitacao.status === 'Aceita' && (
        <div>
          <Botao variante="secundario" carregando={responder.isPending} onClick={() => executar('entregar')}>
            Confirmar entrega
          </Botao>
        </div>
      )}
    </li>
    </>
  )
}

export function MinhasDoacoesPage() {
  const location = useLocation()
  const aviso = (location.state as { aviso?: string } | null)?.aviso
  const solicitacoes = useSolicitacoesRecebidas()
  const materiais = useMeusMateriais()

  const ordenadas = [...(solicitacoes.data ?? [])].sort((a, b) => ordemStatus[a.status] - ordemStatus[b.status])
  const pendentes = ordenadas.filter((s) => s.status === 'Pendente').length

  return (
    <div className="flex flex-col gap-10">
      <Cabecalho titulo="Minhas doações">Responda aos pedidos e confirme quando o material for entregue.</Cabecalho>

      {aviso && <Aviso tipo="sucesso">{aviso}</Aviso>}

      <section aria-labelledby="titulo-recebidas" className="flex flex-col gap-4">
        <h2 id="titulo-recebidas" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-bold">
          Solicitações recebidas
          {pendentes > 0 && <Etiqueta cor="amarelo">{pendentes === 1 ? '1 aguardando' : `${pendentes} aguardando`}</Etiqueta>}
        </h2>
        {solicitacoes.isPending && <Carregando />}
        <ErroApi erro={solicitacoes.error} />
        {solicitacoes.data && solicitacoes.data.length === 0 && (
          <Vazio titulo="Nenhuma solicitação por enquanto.">Quando alguém pedir um dos seus materiais, o pedido aparece aqui.</Vazio>
        )}
        {ordenadas.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-2">
            {ordenadas.map((s) => (
              <CartaoSolicitacaoRecebida key={s.id} solicitacao={s} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="titulo-materiais" className="flex flex-col gap-4">
        <h2 id="titulo-materiais" className="text-2xl font-bold">
          Materiais que cadastrei
        </h2>
        {materiais.isPending && <Carregando />}
        <ErroApi erro={materiais.error} />
        {materiais.data && materiais.data.length === 0 && (
          <Vazio titulo="Você ainda não cadastrou materiais." acao={{ texto: 'Doar material', para: '/doar' }} />
        )}
        {materiais.data && materiais.data.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {materiais.data.map((m) => (
              <li key={m.id}>
                <FolhaMaterial
                  nome={m.nome}
                  descricao={m.descricao}
                  imagem={m.imagem}
                  categoria={m.categoria}
                  estadoConservacao={m.estadoConservacao}
                  quantidade={m.quantidade}
                  destaque={<Etiqueta cor={corStatusMaterial[m.status]}>{statusMaterial[m.status]}</Etiqueta>}
                  rodape={
                    <p className="text-sm text-grafite-suave">
                      Cadastrado em {formatarData(m.criadoEm)}
                      {m.solicitacoesPendentes > 0 &&
                        `, ${m.solicitacoesPendentes} ${m.solicitacoesPendentes === 1 ? 'pedido aguardando' : 'pedidos aguardando'}`}
                    </p>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
