import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { FolhaMaterial } from '../components/FolhaMaterial'
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

  if (usuario.perfil !== 'Beneficiario') {
    return <p className="text-sm text-grafite-suave">Doado por {material.doadorNome}</p>
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

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="max-w-3xl text-2xl font-bold leading-tight text-grafite sm:text-5xl sm:leading-tight">
          Material escolar parado em casa pode voltar para a sala de aula.
        </h1>
        <p className="max-w-2xl text-base text-grafite-suave sm:text-lg">
          Quem tem cadernos, livros, mochilas e outros materiais em bom estado cadastra aqui. Quem precisa encontra e
          solicita. Depois do aceite, as duas pessoas combinam a entrega.
        </p>
        {!usuario && (
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link to="/cadastro" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-tinta px-5 font-bold text-white hover:bg-tinta-escura">
              Criar conta
            </Link>
            <Link to="/entrar" className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-tinta bg-papel px-5 font-bold text-tinta hover:bg-tinta-clara">
              Entrar
            </Link>
          </div>
        )}
      </section>

      <section aria-labelledby="titulo-lista" className="flex flex-col gap-4">
        <h2 id="titulo-lista" className="text-2xl font-bold">
          Materiais disponíveis
        </h2>

        <form onSubmit={buscar} role="search" className="flex gap-2">
          <label htmlFor="busca" className="sr-only">
            Buscar material
          </label>
          <input
            id="busca"
            type="search"
            value={textoBusca}
            onChange={(e) => setTextoBusca(e.target.value)}
            placeholder="Buscar material, ex: “dicionário”"
            className={classeCampo}
          />
          <Botao type="submit" variante="secundario" className="shrink-0">
            Buscar
          </Botao>
        </form>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filtrar por categoria">
          <BotaoCategoria ativo={!categoria} onClick={() => setCategoria(undefined)}>
            Todas
          </BotaoCategoria>
          {listaCategorias.map((c) => (
            <BotaoCategoria key={c} ativo={categoria === c} onClick={() => setCategoria(c)}>
              {categorias[c]}
            </BotaoCategoria>
          ))}
        </div>

        {isPending && <Carregando texto="Carregando materiais…" />}
        <ErroApi erro={error} />

        {data && data.length === 0 && (
          <Vazio
            titulo={filtrando ? 'Nenhum material encontrado com esse filtro.' : 'Ainda não há materiais disponíveis.'}
            acao={usuario?.perfil === 'Doador' ? { texto: 'Doar material', para: '/doar' } : undefined}
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

function BotaoCategoria({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`min-h-10 whitespace-nowrap rounded-full border-2 px-4 font-bold transition-colors ${
        ativo ? 'border-tinta bg-tinta text-white' : 'border-pauta bg-papel text-grafite hover:border-tinta'
      }`}
    >
      {children}
    </button>
  )
}
