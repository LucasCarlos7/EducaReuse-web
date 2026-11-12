import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { FolhaMaterial, iconeCategoria } from '../components/FolhaMaterial'
import { Aviso, Botao, Carregando, ErroApi, Vazio, classeCampo } from '../components/ui'
import { useMateriais, useSolicitarMaterial } from '../lib/queries'
import { categorias, listaCategorias, type Categoria, type Material } from '../lib/types'

function AcaoSolicitar({ material }: { material: Material }) {
  const { usuario } = useAuth()
  const solicitar = useSolicitarMaterial()
  const [aberto, setAberto] = useState(false)
  const [mensagem, setMensagem] = useState('')

  if (!usuario) {
    return (
      <Link to="/entrar" state={{ de: '/' }} className="font-bold text-tinta underline underline-offset-4">
        Entre para solicitar
      </Link>
    )
  }

  if (material.ehMeu) {
    return (
      <p className="text-sm text-grafite-suave">
        Você cadastrou este material.{' '}
        <Link to="/minhas-doacoes" className="font-bold text-tinta underline underline-offset-4">
          Ver pedidos
        </Link>
      </p>
    )
  }

  if (solicitar.isSuccess) {
    return (
      <Aviso tipo="sucesso">
        Solicitação enviada.{' '}
        <Link to="/minhas-solicitacoes" className="font-bold underline underline-offset-4">
          Acompanhe em Minhas solicitações
        </Link>
      </Aviso>
    )
  }

  if (!aberto) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-grafite-suave">Doado por {material.doadorNome}</span>
        <Botao onClick={() => setAberto(true)}>Solicitar</Botao>
      </div>
    )
  }

  function enviar(e: FormEvent) {
    e.preventDefault()
    solicitar.mutate({ materialId: material.id, mensagem: mensagem.trim() || undefined })
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-2 rounded-lg bg-papel/90 p-3">
      <label htmlFor={`msg-${material.id}`} className="text-sm font-bold">
        Mensagem para quem doa (opcional)
      </label>
      <textarea
        id={`msg-${material.id}`}
        rows={2}
        maxLength={300}
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Ex.: é para meu filho do 5º ano."
        className={classeCampo}
      />
      <ErroApi erro={solicitar.error} />
      <div className="flex flex-wrap gap-2">
        <Botao type="submit" carregando={solicitar.isPending}>
          Enviar solicitação
        </Botao>
        <Botao type="button" variante="discreto" onClick={() => setAberto(false)}>
          Cancelar
        </Botao>
      </div>
    </form>
  )
}

export function MateriaisPage() {
  const { usuario } = useAuth()
  const [categoria, setCategoria] = useState<Categoria | undefined>()
  const [textoBusca, setTextoBusca] = useState('')
  const [busca, setBusca] = useState('')
  const { data, isPending, error } = useMateriais(categoria, busca)

  function buscar(e: FormEvent) {
    e.preventDefault()
    setBusca(textoBusca.trim())
  }

  const filtrando = !!categoria || !!busca
  // Para quem está logado a lista é o conteúdo principal da página.
  const TituloLista = usuario ? 'h1' : 'h2'

  return (
    <div className="flex flex-col gap-8">
      {!usuario && (
        <section className="flex flex-col gap-4">
          {data && data.length > 0 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-folha-clara bg-folha-clara px-4 py-1.5 text-sm font-bold text-folha">
              <span className="h-2 w-2 shrink-0 rounded-full bg-folha" aria-hidden="true" />
              {data.length} {data.length === 1 ? 'material disponível agora' : 'materiais disponíveis agora'}
            </div>
          )}
          <h1 className="max-w-3xl text-2xl font-bold leading-tight text-grafite sm:text-5xl sm:leading-tight">
            Material escolar parado em casa pode voltar para a sala de aula.
          </h1>
          <p className="max-w-2xl text-base text-grafite-suave sm:text-lg">
            Quem tem cadernos, livros, mochilas e outros materiais em bom estado cadastra aqui. Quem precisa encontra e
            solicita. Depois do aceite, as duas pessoas combinam a entrega.
          </p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <Link to="/cadastro" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-tinta px-5 font-bold text-sobre-tinta hover:bg-tinta-escura">
              Criar conta
            </Link>
            <Link to="/entrar" className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-tinta bg-papel px-5 font-bold text-tinta hover:bg-tinta-clara">
              Entrar
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {listaCategorias.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-pauta bg-papel px-3 py-1.5 text-sm text-grafite-suave">
                <span aria-hidden="true">{iconeCategoria[c]}</span>
                {categorias[c]}
              </span>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="titulo-lista" className="flex flex-col gap-4">
        <TituloLista id="titulo-lista" className="text-2xl font-bold sm:text-3xl">
          Materiais disponíveis
        </TituloLista>

        <form onSubmit={buscar} role="search" className="flex gap-2">
          <label htmlFor="busca" className="sr-only">
            Buscar material
          </label>
          <input
            id="busca"
            type="search"
            value={textoBusca}
            onChange={(e) => setTextoBusca(e.target.value)}
            placeholder="Ex.: dicionário"
            className={classeCampo}
          />
          <Botao type="submit" variante="secundario" className="shrink-0">
            Buscar
          </Botao>
        </form>

        <div className="-mx-4 flex gap-2 overflow-x-auto scroll-oculto px-4 py-1 sm:-mx-1 sm:flex-wrap sm:overflow-x-visible sm:px-1" role="group" aria-label="Filtrar por categoria">
          <BotaoCategoria ativo={!categoria} onClick={() => setCategoria(undefined)}>
            Todas
          </BotaoCategoria>
          {listaCategorias.map((c) => (
            <BotaoCategoria key={c} ativo={categoria === c} onClick={() => setCategoria(c)} icone={iconeCategoria[c]}>
              {categorias[c]}
            </BotaoCategoria>
          ))}
        </div>

        {isPending && <Carregando texto="Carregando materiais…" />}
        <ErroApi erro={error} />

        {data && data.length === 0 && (
          <Vazio
            titulo={filtrando ? 'Nenhum material encontrado com esse filtro.' : 'Ainda não há materiais disponíveis.'}
            acao={usuario ? { texto: 'Doar material', para: '/doar' } : undefined}
          >
            {filtrando ? 'Tente outra categoria ou outra palavra.' : 'Volte em breve: novos materiais podem ser cadastrados a qualquer momento.'}
          </Vazio>
        )}

        {data && data.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((m) => (
              <li key={m.id}>
                <FolhaMaterial
                  nome={m.nome}
                  descricao={m.descricao}
                  imagem={m.imagem}
                  categoria={m.categoria}
                  estadoConservacao={m.estadoConservacao}
                  quantidade={m.quantidade}
                  rodape={<AcaoSolicitar material={m} />}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function BotaoCategoria({ ativo, onClick, icone, children }: { ativo: boolean; onClick: () => void; icone?: string; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`inline-flex items-center gap-1.5 min-h-10 whitespace-nowrap rounded-full border-2 px-4 font-bold transition-colors ${
        ativo ? 'border-tinta bg-tinta text-sobre-tinta' : 'border-pauta bg-papel text-grafite hover:border-tinta'
      }`}
    >
      {icone && <span aria-hidden="true">{icone}</span>}
      {children}
    </button>
  )
}
