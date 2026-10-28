import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../auth/AuthContext'
import { Botao, Cabecalho, Campo, ErroApi, classeCampo } from '../components/ui'

const schema = z.object({
  perfil: z.enum(['Doador', 'Beneficiario'], { error: 'Escolha como você vai usar a plataforma.' }),
  nome: z.string().trim().min(1, 'Informe seu nome.').max(120, 'Use no máximo 120 caracteres.'),
  email: z.email('Informe um e-mail válido.').max(160),
  telefone: z.string().trim().max(20, 'Use no máximo 20 caracteres.').optional(),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.').max(100),
})

type Formulario = z.infer<typeof schema>

const opcoesPerfil = [
  { valor: 'Doador', titulo: 'Quero doar', texto: 'Tenho material escolar em bom estado que não uso mais.' },
  { valor: 'Beneficiario', titulo: 'Preciso de material', texto: 'Procuro material escolar para mim ou para um estudante da família.' },
] as const

export function CadastroPage() {
  const { usuario, cadastrar } = useAuth()
  const navigate = useNavigate()
  const [erro, setErro] = useState<unknown>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({ resolver: zodResolver(schema) })

  const perfilEscolhido = useWatch({ control, name: 'perfil' })

  if (usuario) return <Navigate to="/" replace />

  async function onSubmit(dados: Formulario) {
    setErro(null)
    try {
      const novo = await cadastrar({ ...dados, telefone: dados.telefone || undefined })
      navigate(novo.perfil === 'Doador' ? '/doar' : '/', { replace: true })
    } catch (e) {
      setErro(e)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Cabecalho titulo="Criar conta">
        Cada conta tem um perfil. Se quiser doar e também receber materiais, crie duas contas com e-mails diferentes.
      </Cabecalho>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 rounded-xl bg-papel p-6 shadow-sm">
        <ErroApi erro={erro} />

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 font-bold">Como você vai usar o EducaReuse?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {opcoesPerfil.map((opcao) => (
              <label
                key={opcao.valor}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition-colors ${
                  perfilEscolhido === opcao.valor ? 'border-tinta bg-tinta-clara' : 'border-pauta hover:border-tinta'
                }`}
              >
                <span className="flex items-center gap-2 font-bold">
                  <input type="radio" value={opcao.valor} className="h-4 w-4 accent-tinta" {...register('perfil')} />
                  {opcao.titulo}
                </span>
                <span className="text-sm text-grafite-suave">{opcao.texto}</span>
              </label>
            ))}
          </div>
          {errors.perfil && (
            <p className="text-sm font-bold text-margem" role="alert">
              {errors.perfil.message}
            </p>
          )}
        </fieldset>

        <Campo rotulo="Nome completo" htmlFor="nome" erro={errors.nome?.message}>
          <input id="nome" autoComplete="name" className={classeCampo} aria-invalid={!!errors.nome} {...register('nome')} />
        </Campo>

        <Campo rotulo="E-mail" htmlFor="email" erro={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className={classeCampo} aria-invalid={!!errors.email} {...register('email')} />
        </Campo>

        <Campo
          rotulo="Telefone ou WhatsApp (opcional)"
          htmlFor="telefone"
          erro={errors.telefone?.message}
          dica="Só aparece para a outra pessoa depois que uma doação é aceita."
        >
          <input id="telefone" type="tel" autoComplete="tel" className={classeCampo} aria-invalid={!!errors.telefone} {...register('telefone')} />
        </Campo>

        <Campo rotulo="Senha" htmlFor="senha" erro={errors.senha?.message} dica="Pelo menos 8 caracteres.">
          <input id="senha" type="password" autoComplete="new-password" className={classeCampo} aria-invalid={!!errors.senha} {...register('senha')} />
        </Campo>

        <Botao type="submit" carregando={isSubmitting}>
          Criar conta
        </Botao>

        <p className="text-center text-grafite-suave">
          Já tem conta?{' '}
          <Link to="/entrar" className="font-bold text-tinta underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
