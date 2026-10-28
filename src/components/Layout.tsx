import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function LinkNav({ para, children }: { para: string; children: string }) {
  return (
    <NavLink
      to={para}
      end
      className={({ isActive }) =>
        `whitespace-nowrap rounded-lg px-3 py-2 font-bold transition-colors ${
          isActive ? 'bg-tinta-clara text-tinta-escura' : 'text-grafite-suave hover:text-tinta'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function Layout() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  function handleSair() {
    sair()
    navigate('/')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b-2 border-pauta bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-tinta">
              <span aria-hidden="true" className="inline-block h-7 w-1 rounded bg-margem" />
              EducaReuse
            </NavLink>
            {usuario && (
              <button onClick={handleSair} className="rounded-lg px-3 py-2 font-bold text-grafite-suave hover:text-margem sm:hidden">
                Sair
              </button>
            )}
          </div>

          <nav aria-label="Principal" className="-mx-1 flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <LinkNav para="/">Materiais</LinkNav>
            {usuario?.perfil === 'Doador' && (
              <>
                <LinkNav para="/doar">Doar material</LinkNav>
                <LinkNav para="/minhas-doacoes">Minhas doações</LinkNav>
              </>
            )}
            {usuario?.perfil === 'Beneficiario' && <LinkNav para="/minhas-solicitacoes">Minhas solicitações</LinkNav>}
            {!usuario && (
              <>
                <LinkNav para="/entrar">Entrar</LinkNav>
                <LinkNav para="/cadastro">Criar conta</LinkNav>
              </>
            )}
            {usuario && (
              <button onClick={handleSair} className="hidden rounded-lg px-3 py-2 font-bold text-grafite-suave hover:text-margem sm:inline-flex">
                Sair
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {usuario && (
          <p className="mb-6 text-grafite-suave">
            Olá, <strong className="text-grafite">{usuario.nome.split(' ')[0]}</strong>. Você está usando a conta de{' '}
            {usuario.perfil === 'Doador' ? 'doador' : 'beneficiário'}.
          </p>
        )}
        <Outlet />
      </main>

      <footer className="border-t-2 border-pauta bg-white">
        <p className="mx-auto max-w-5xl px-4 py-5 text-sm text-grafite-suave">
          Projeto de extensão do curso de Ciência da Computação da UNINTER, desenvolvido para a comunidade escolar de
          Araguaína, Tocantins.
        </p>
      </footer>
    </div>
  )
}
