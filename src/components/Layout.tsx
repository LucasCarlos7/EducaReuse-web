import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../hooks/useTheme'

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
  const { tema, alternar } = useTheme()

  function handleSair() {
    sair()
    navigate('/')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b-2 border-pauta bg-papel">
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
            <button
              onClick={alternar}
              aria-label={tema === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              className="rounded-lg p-2 text-grafite-suave transition-colors hover:text-tinta"
            >
              {tema === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.42 1.42l-.71.7a1 1 0 01-1.41-1.41l.7-.71zM18 9a1 1 0 010 2h-1a1 1 0 110-2h1zM4.22 16.22a1 1 0 001.42-1.42l-.71-.7a1 1 0 00-1.41 1.41l.7.71zM2 10a1 1 0 001 1H4a1 1 0 000-2H3a1 1 0 00-1 1zm2.22-5.78a1 1 0 00-1.41 1.41l.7.71A1 1 0 004.93 4.93l-.71-.71zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm5.78.78a1 1 0 001.41-1.41l-.7-.71a1 1 0 00-1.42 1.42l.71.7zM10 6a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
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

      <footer className="border-t-2 border-pauta bg-papel">
        <p className="mx-auto max-w-5xl px-4 py-5 text-sm text-grafite-suave">
          Projeto de extensão do curso de Ciência da Computação da UNINTER, desenvolvido para a comunidade escolar de
          Araguaína, Tocantins.
        </p>
      </footer>
    </div>
  )
}
