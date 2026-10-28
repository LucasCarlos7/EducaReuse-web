import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../hooks/useTheme'

function IconHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  )
}

function IconUserPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
    </svg>
  )
}

function IcneSol() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.42 1.42l-.71.7a1 1 0 01-1.41-1.41l.7-.71zM18 9a1 1 0 010 2h-1a1 1 0 110-2h1zM4.22 16.22a1 1 0 001.42-1.42l-.71-.7a1 1 0 00-1.41 1.41l.7.71zM2 10a1 1 0 001 1H4a1 1 0 000-2H3a1 1 0 00-1 1zm2.22-5.78a1 1 0 00-1.41 1.41l.7.71A1 1 0 004.93 4.93l-.71-.71zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm5.78.78a1 1 0 001.41-1.41l-.7-.71a1 1 0 00-1.42 1.42l.71.7zM10 6a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  )
}

function IcneLua() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  )
}

function BotaoTema() {
  const { tema, alternar } = useTheme()
  return (
    <button
      onClick={alternar}
      aria-label={tema === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="rounded-lg p-2 text-grafite-suave transition-colors hover:text-tinta"
    >
      {tema === 'dark' ? <IcneSol /> : <IcneLua />}
    </button>
  )
}

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

function NavInferior() {
  const { usuario } = useAuth()

  type ItemNav = { para: string; label: string; icone: React.ReactNode }

  const itens: ItemNav[] = !usuario
    ? [
        { para: '/', label: 'Materiais', icone: <IconHome /> },
        { para: '/entrar', label: 'Entrar', icone: <IconUser /> },
        { para: '/cadastro', label: 'Cadastro', icone: <IconUserPlus /> },
      ]
    : usuario.perfil === 'Doador'
      ? [
          { para: '/', label: 'Materiais', icone: <IconHome /> },
          { para: '/doar', label: 'Doar', icone: <IconPlus /> },
          { para: '/minhas-doacoes', label: 'Doações', icone: <IconClipboard /> },
        ]
      : [
          { para: '/', label: 'Materiais', icone: <IconHome /> },
          { para: '/minhas-solicitacoes', label: 'Solicitações', icone: <IconClipboard /> },
        ]

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-pauta bg-papel sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="flex h-16">
        {itens.map((item) => (
          <li key={item.para} className="flex-1">
            <NavLink
              to={item.para}
              end
              className={({ isActive }) =>
                `flex h-full flex-col items-center justify-center gap-0.5 px-1 text-xs font-bold transition-colors ${
                  isActive ? 'text-tinta' : 'text-grafite-suave'
                }`
              }
            >
              {item.icone}
              <span className="leading-none">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
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
    <div className="flex min-h-dvh flex-col pb-16 sm:pb-0">
      <header className="border-b-2 border-pauta bg-papel">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-tinta">
            <span aria-hidden="true" className="inline-block h-7 w-1 rounded bg-margem" />
            EducaReuse
          </NavLink>

          {/* Mobile: toggle de tema + sair */}
          <div className="flex items-center gap-1 sm:hidden">
            <BotaoTema />
            {usuario && (
              <button onClick={handleSair} className="rounded-lg px-3 py-2 font-bold text-grafite-suave hover:text-margem">
                Sair
              </button>
            )}
          </div>

          {/* Desktop: barra de navegação completa */}
          <nav aria-label="Principal" className="hidden items-center gap-1 sm:flex">
            <BotaoTema />
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
              <button onClick={handleSair} className="rounded-lg px-3 py-2 font-bold text-grafite-suave hover:text-margem">
                Sair
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-8 sm:py-8">
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

      <NavInferior />
    </div>
  )
}
