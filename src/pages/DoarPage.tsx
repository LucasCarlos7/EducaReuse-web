import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Botao, Cabecalho, Campo, ErroApi, classeCampo } from '../components/ui'
import { useCriarMaterial } from '../lib/queries'
import { categorias, estadosConservacao, listaCategorias, listaEstados } from '../lib/types'

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

export function DoarPage() {
  const navigate = useNavigate()
  const criar = useCriarMaterial()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Entrada, unknown, Formulario>({
    resolver: zodResolver(schema),
    defaultValues: { quantidade: 1 },
  })

  function onSubmit(dados: Formulario) {
    criar.mutate(
      {
        nome: dados.nome,
        categoria: dados.categoria as keyof typeof categorias,
        estadoConservacao: dados.estadoConservacao as keyof typeof estadosConservacao,
        quantidade: dados.quantidade,
        descricao: dados.descricao || undefined,
      },
      { onSuccess: () => navigate('/minhas-doacoes', { state: { aviso: 'Material cadastrado. Ele já aparece na lista de materiais disponíveis.' } }) },
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <Cabecalho titulo="Doar material">
        Descreva o material com clareza. Quem precisa vai ver estas informações antes de solicitar.
      </Cabecalho>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
        <ErroApi erro={criar.error} />

        <Campo rotulo="Nome do material" htmlFor="nome" erro={errors.nome?.message} dica="Ex.: Caderno universitário 10 matérias">
          <input id="nome" className={classeCampo} aria-invalid={!!errors.nome} {...register('nome')} />
        </Campo>

        <Campo rotulo="Categoria" htmlFor="categoria" erro={errors.categoria?.message}>
          <select id="categoria" defaultValue="" className={classeCampo} aria-invalid={!!errors.categoria} {...register('categoria')}>
            <option value="" disabled>
              Escolha uma categoria
            </option>
            {listaCategorias.map((c) => (
              <option key={c} value={c}>
                {categorias[c]}
              </option>
            ))}
          </select>
        </Campo>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 font-bold">Estado de conservação</legend>
          <div className="flex flex-wrap gap-3">
            {listaEstados.map((e) => (
              <label key={e} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 border-pauta bg-white px-3 has-checked:border-tinta has-checked:bg-tinta-clara">
                <input type="radio" value={e} className="h-4 w-4 accent-tinta" {...register('estadoConservacao')} />
                {estadosConservacao[e]}
              </label>
            ))}
          </div>
          {errors.estadoConservacao && (
            <p className="text-sm font-bold text-margem" role="alert">
              {errors.estadoConservacao.message}
            </p>
          )}
        </fieldset>

        <Campo rotulo="Quantidade" htmlFor="quantidade" erro={errors.quantidade?.message}>
          <input id="quantidade" type="number" min={1} max={100} inputMode="numeric" className={`${classeCampo} max-w-32`} aria-invalid={!!errors.quantidade} {...register('quantidade')} />
        </Campo>

        <Campo rotulo="Descrição (opcional)" htmlFor="descricao" erro={errors.descricao?.message} dica="Ex.: poucas folhas usadas, capa intacta.">
          <textarea id="descricao" rows={3} maxLength={500} className={classeCampo} aria-invalid={!!errors.descricao} {...register('descricao')} />
        </Campo>

        <Botao type="submit" carregando={criar.isPending}>
          Cadastrar material
        </Botao>
      </form>
    </div>
  )
}
