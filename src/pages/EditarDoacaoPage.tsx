import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { Botao, Cabecalho, Campo, Carregando, ErroApi, Vazio, classeCampo } from '../components/ui'
import { ErroImagem, reduzirImagem } from '../lib/imagem'
import { useEditarMaterial, useMeusMateriais } from '../lib/queries'
import { categorias, estadosConservacao, listaCategorias, listaEstados, type Categoria, type EstadoConservacao } from '../lib/types'

const TAMANHO_MAX = 5 * 1024 * 1024

const schema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome do material.').max(120, 'Use no máximo 120 caracteres.'),
  categoria: z.enum(listaCategorias as [string, ...string[]], { error: 'Escolha uma categoria.' }),
  estadoConservacao: z.enum(listaEstados as [string, ...string[]], { error: 'Escolha o estado do material.' }),
  quantidade: z.coerce
    .number({ error: 'Informe a quantidade.' })
    .int('Use um número inteiro.')
    .min(1, 'A quantidade mínima é 1.')
    .max(100, 'A quantidade máxima é 100.'),
  descricao: z.string().trim().max(500, 'Use no máximo 500 caracteres.').optional(),
})

type Entrada = z.input<typeof schema>
type Formulario = z.output<typeof schema>

export function EditarDoacaoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const editar = useEditarMaterial()
  const meusMateriais = useMeusMateriais()
  const material = meusMateriais.data?.find((m) => m.id === id)

  const inputImagemRef = useRef<HTMLInputElement>(null)
  const [previewImagem, setPreviewImagem] = useState<string | null>(null)
  const [erroImagem, setErroImagem] = useState<string | null>(null)
  const [arquivoImagem, setArquivoImagem] = useState<File | null>(null)
  const [preparandoImagem, setPreparandoImagem] = useState(false)
  const [imagemAtualRemovida, setImagemAtualRemovida] = useState(false)
  const [formularioPreenchido, setFormularioPreenchido] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Entrada, unknown, Formulario>({
    resolver: zodResolver(schema),
    defaultValues: { quantidade: 1 },
  })

  useEffect(() => {
    if (material && !formularioPreenchido) {
      reset({
        nome: material.nome,
        categoria: material.categoria,
        estadoConservacao: material.estadoConservacao,
        quantidade: material.quantidade,
        descricao: material.descricao ?? '',
      })
      setFormularioPreenchido(true)
    }
  }, [material, formularioPreenchido, reset])

  useEffect(() => () => {
    if (previewImagem) URL.revokeObjectURL(previewImagem)
  }, [previewImagem])

  async function onChangeImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0] ?? null
    setErroImagem(null)
    setPreviewImagem(null)
    setArquivoImagem(null)

    if (!arquivo) return

    setPreparandoImagem(true)
    try {
      const reduzida = await reduzirImagem(arquivo)
      if (reduzida.size > TAMANHO_MAX) {
        setErroImagem('A foto continua grande demais mesmo depois de reduzida. Tente outra.')
        return
      }
      setArquivoImagem(reduzida)
      setPreviewImagem(URL.createObjectURL(reduzida))
      setImagemAtualRemovida(false)
    } catch (erro) {
      setErroImagem(erro instanceof ErroImagem ? erro.message : 'Não foi possível preparar a foto. Tente outra.')
      if (inputImagemRef.current) inputImagemRef.current.value = ''
    } finally {
      setPreparandoImagem(false)
    }
  }

  function removerNovaImagem() {
    setPreviewImagem(null)
    setArquivoImagem(null)
    setErroImagem(null)
    if (inputImagemRef.current) inputImagemRef.current.value = ''
  }

  function removerImagemAtual() {
    setImagemAtualRemovida(true)
  }

  function onSubmit(dados: Formulario) {
    if (!id) return
    editar.mutate(
      {
        id,
        nome: dados.nome,
        categoria: dados.categoria as Categoria,
        estadoConservacao: dados.estadoConservacao as EstadoConservacao,
        quantidade: dados.quantidade,
        descricao: dados.descricao || undefined,
        imagem: arquivoImagem,
        removerImagem: imagemAtualRemovida && !arquivoImagem,
      },
      { onSuccess: () => navigate('/minhas-doacoes', { state: { aviso: 'Material atualizado com sucesso.' } }) },
    )
  }

  if (meusMateriais.isPending) return <Carregando />

  if (!material) {
    return (
      <Vazio titulo="Material não encontrado.">
        <span>O material que você tentou editar não existe ou não pertence a você.</span>
      </Vazio>
    )
  }

  const imagemExibida = previewImagem ?? (!imagemAtualRemovida ? material.imagem : null)

  return (
    <div className="mx-auto max-w-xl">
      <Cabecalho titulo="Editar doação">
        Atualize as informações do material. As mudanças ficam visíveis para quem buscar doações.
      </Cabecalho>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 rounded-xl bg-papel p-6 shadow-sm">
        <ErroApi erro={editar.error} />

        <Campo rotulo="Nome do material" htmlFor="nome" erro={errors.nome?.message} dica="Ex.: Caderno universitário 10 matérias">
          <input id="nome" className={classeCampo} aria-invalid={!!errors.nome} {...register('nome')} />
        </Campo>

        <Campo rotulo="Categoria" htmlFor="categoria" erro={errors.categoria?.message}>
          <select id="categoria" className={classeCampo} aria-invalid={!!errors.categoria} {...register('categoria')}>
            <option value="" disabled>Escolha uma categoria</option>
            {listaCategorias.map((c) => (
              <option key={c} value={c}>{categorias[c]}</option>
            ))}
          </select>
        </Campo>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 font-bold">Estado de conservação</legend>
          <div className="flex flex-wrap gap-3">
            {listaEstados.map((e) => (
              <label key={e} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 border-pauta bg-papel px-3 has-checked:border-tinta has-checked:bg-tinta-clara">
                <input type="radio" value={e} className="h-4 w-4 accent-tinta" {...register('estadoConservacao')} />
                {estadosConservacao[e]}
              </label>
            ))}
          </div>
          {errors.estadoConservacao && (
            <p className="text-sm font-bold text-margem" role="alert">{errors.estadoConservacao.message}</p>
          )}
        </fieldset>

        <Campo rotulo="Quantidade" htmlFor="quantidade" erro={errors.quantidade?.message}>
          <input id="quantidade" type="number" min={1} max={100} inputMode="numeric" className={`${classeCampo} max-w-32`} aria-invalid={!!errors.quantidade} {...register('quantidade')} />
        </Campo>

        <Campo rotulo="Descrição (opcional)" htmlFor="descricao" erro={errors.descricao?.message} dica="Ex.: poucas folhas usadas, capa intacta.">
          <textarea id="descricao" rows={3} maxLength={500} className={classeCampo} aria-invalid={!!errors.descricao} {...register('descricao')} />
        </Campo>

        <div className="flex flex-col gap-2">
          <span className="font-bold">Foto do material (opcional)</span>
          {imagemExibida ? (
            <div className="relative w-full overflow-hidden rounded-lg border-2 border-pauta">
              <img src={imagemExibida} alt="Foto do material" className="h-48 w-full object-cover" />
              <div className="absolute right-2 top-2 flex gap-2">
                <label className="inline-flex min-h-10 cursor-pointer items-center rounded-full bg-black/70 px-4 text-sm font-bold text-white hover:bg-black/80">
                  Trocar foto
                  <input
                    ref={inputImagemRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={preparandoImagem}
                    onChange={onChangeImagem}
                  />
                </label>
                <button
                  type="button"
                  onClick={previewImagem ? removerNovaImagem : removerImagemAtual}
                  className="inline-flex min-h-10 items-center rounded-full bg-black/70 px-4 text-sm font-bold text-white hover:bg-black/80"
                >
                  Remover
                </button>
              </div>
            </div>
          ) : (
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-pauta bg-papel text-sm text-grafite-suave hover:border-tinta hover:text-tinta active:bg-tinta-clara">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 opacity-40" aria-hidden="true">
                <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">{preparandoImagem ? 'Preparando a foto…' : 'Tirar foto ou escolher da galeria'}</span>
              <span className="text-xs">A foto é reduzida automaticamente antes do envio.</span>
              <input
                ref={inputImagemRef}
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={preparandoImagem}
                onChange={onChangeImagem}
              />
            </label>
          )}
          {erroImagem && (
            <p className="text-sm font-bold text-margem" role="alert">{erroImagem}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Botao type="submit" carregando={editar.isPending} disabled={preparandoImagem}>
            Salvar alterações
          </Botao>
          <Botao type="button" variante="secundario" onClick={() => navigate('/minhas-doacoes')}>
            Cancelar
          </Botao>
        </div>
      </form>
    </div>
  )
}
