import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../lib/api'

type Variante = 'primario' | 'secundario' | 'perigo' | 'discreto'

const estilosBotao: Record<Variante, string> = {
  primario: 'bg-tinta text-white hover:bg-tinta-escura',
  secundario: 'bg-papel text-tinta border-2 border-tinta hover:bg-tinta-clara',
  perigo: 'bg-papel text-margem border-2 border-margem hover:bg-[var(--color-erro-fundo)]',
  discreto: 'bg-transparent text-tinta hover:bg-tinta-clara',
}

export function Botao({
  variante = 'primario',
  carregando = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; carregando?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || carregando}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${estilosBotao[variante]} ${className}`}
    >
      {carregando ? 'Aguarde…' : children}
    </button>
  )
}

export const classeCampo =
  'w-full rounded-lg border-2 border-pauta bg-papel px-3 py-2.5 text-grafite placeholder:text-grafite-suave/70 focus:border-tinta focus:outline-none aria-invalid:border-margem'

export function Campo({
  rotulo,
  htmlFor,
  erro,
  dica,
  children,
}: {
  rotulo: string
  htmlFor: string
  erro?: string
  dica?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-bold">
        {rotulo}
      </label>
      {children}
      {dica && !erro && <p className="text-sm text-grafite-suave">{dica}</p>}
      {erro && (
        <p className="text-sm font-bold text-margem" role="alert">
          {erro}
        </p>
      )}
    </div>
  )
}

export function Aviso({ tipo = 'erro', children }: { tipo?: 'erro' | 'sucesso' | 'info'; children: ReactNode }) {
  const estilos = {
    erro: 'border-margem bg-[var(--color-erro-fundo)] text-margem',
    sucesso: 'border-folha bg-folha-clara text-folha',
    info: 'border-tinta bg-tinta-clara text-tinta-escura',
  }[tipo]

  return (
    <div role={tipo === 'erro' ? 'alert' : 'status'} className={`rounded-lg border-l-4 px-4 py-3 ${estilos}`}>
      {children}
    </div>
  )
}

export function ErroApi({ erro }: { erro: unknown }) {
  if (!erro) return null
  const mensagem = erro instanceof Error ? erro.message : 'Não foi possível concluir a ação.'
  const campos = erro instanceof ApiError ? erro.campos : []

  return (
    <Aviso>
      <p className="font-bold">{mensagem}</p>
      {campos.length > 0 && (
        <ul className="mt-1 list-disc pl-5">
          {campos.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
    </Aviso>
  )
}

const coresEtiqueta = {
  azul: 'bg-tinta-clara text-tinta-escura',
  amarelo: 'bg-lapis-claro text-grafite',
  verde: 'bg-folha-clara text-folha',
  vermelho: 'bg-[var(--color-erro-fundo)] text-margem',
  cinza: 'bg-[var(--color-cinza-fundo)] text-grafite-suave',
}

export function Etiqueta({ cor = 'azul', children }: { cor?: keyof typeof coresEtiqueta; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-bold leading-6 ${coresEtiqueta[cor]}`}>
      {children}
    </span>
  )
}

export function Cabecalho({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-grafite sm:text-4xl">{titulo}</h1>
      {children && <div className="max-w-2xl text-grafite-suave">{children}</div>}
    </div>
  )
}

export function Vazio({ titulo, children, acao }: { titulo: string; children?: ReactNode; acao?: { texto: string; para: string } }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-pauta bg-papel px-6 py-10 text-center">
      <p className="text-lg font-bold">{titulo}</p>
      {children && <p className="mt-1 text-grafite-suave">{children}</p>}
      {acao && (
        <Link to={acao.para} className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-tinta px-4 font-bold text-white hover:bg-tinta-escura">
          {acao.texto}
        </Link>
      )}
    </div>
  )
}

export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <p className="py-10 text-center text-grafite-suave" role="status">
      {texto}
    </p>
  )
}
