import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../auth/AuthContext'
import { Botao, Cabecalho, Campo, ErroApi, classeCampo } from '../components/ui'

const schema = z.object({
  email: z.email('Informe um e-mail válido.'),
  senha: z.string().min(1, 'Informe sua senha.'),
})

type Formulario = z.infer<typeof schema>

export function EntrarPage() {
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = (location.state as { de?: string } | null)?.de ?? '/'
  const [erro, setErro] = useState<unknown>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({ resolver: zodResolver(schema) })

  if (usuario) return <Navigate to={destino} replace />

  async function onSubmit(dados: Formulario) {
    setErro(null)
    try {
      await entrar(dados.email, dados.senha)
      navigate(destino, { replace: true })
    } catch (e) {
      setErro(e)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Cabecalho titulo="Entrar">Use o e-mail e a senha que você cadastrou.</Cabecalho>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
        <ErroApi erro={erro} />

        <Campo rotulo="E-mail" htmlFor="email" erro={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className={classeCampo} aria-invalid={!!errors.email} {...register('email')} />
        </Campo>

        <Campo rotulo="Senha" htmlFor="senha" erro={errors.senha?.message}>
          <input id="senha" type="password" autoComplete="current-password" className={classeCampo} aria-invalid={!!errors.senha} {...register('senha')} />
        </Campo>

        <Botao type="submit" carregando={isSubmitting}>
          Entrar
        </Botao>

        <p className="text-center text-grafite-suave">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-bold text-tinta underline underline-offset-4">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  )
}
