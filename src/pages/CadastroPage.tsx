import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../auth/AuthContext'
import { Botao, Cabecalho, Campo, ErroApi, classeCampo } from '../components/ui'

const schema = z.object({
  nome: z.string().trim().min(1, 'Informe seu nome.').max(120, 'Use no máximo 120 caracteres.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .email('Informe um e-mail válido.')
    .max(160, 'E-mail muito longo.'),
  telefone: z
    .string()
    .trim()
    .min(1, 'Informe seu telefone ou WhatsApp.')
    .refine(
      (v) => { const d = v.replace(/\D/g, ''); return d.length === 10 || d.length === 11 },
      'Informe um telefone com DDD e 10 ou 11 dígitos.',
    ),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.').max(100),
})

function mascaraTelefone(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

type Formulario = z.infer<typeof schema>

export function CadastroPage() {
  const { usuario, cadastrar } = useAuth()
  const navigate = useNavigate()
  const [erro, setErro] = useState<unknown>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({ resolver: zodResolver(schema) })

  if (usuario) return <Navigate to="/" replace />

  async function onSubmit(dados: Formulario) {
    setErro(null)
    try {
      await cadastrar({ ...dados, telefone: dados.telefone })
      navigate('/', { replace: true })
    } catch (e) {
      setErro(e)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Cabecalho titulo="Criar conta">
        Com uma única conta você pode doar o material que não usa mais e solicitar o que precisar.
      </Cabecalho>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 rounded-xl bg-papel p-6 shadow-sm">
        <ErroApi erro={erro} />

        <Campo rotulo="Nome completo" htmlFor="nome" erro={errors.nome?.message}>
          <input id="nome" autoComplete="name" className={classeCampo} aria-invalid={!!errors.nome} {...register('nome')} />
        </Campo>

        <Campo rotulo="E-mail" htmlFor="email" erro={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className={classeCampo} aria-invalid={!!errors.email} {...register('email')} />
        </Campo>

        <Campo
          rotulo="Telefone ou WhatsApp"
          htmlFor="telefone"
          erro={errors.telefone?.message}
          dica="Usado para combinar a entrega quando uma doação for aceita."
        >
          <input
            id="telefone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            placeholder="(XX) XXXXX-XXXX"
            className={classeCampo}
            aria-invalid={!!errors.telefone}
            {...register('telefone', {
              onChange: (e) => setValue('telefone', mascaraTelefone(e.target.value), { shouldValidate: true }),
            })}
          />
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
