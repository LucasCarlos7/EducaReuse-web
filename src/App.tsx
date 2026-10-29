import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RotaProtegida } from './components/RotaProtegida'
import { CadastroPage } from './pages/CadastroPage'
import { DoarPage } from './pages/DoarPage'
import { EntrarPage } from './pages/EntrarPage'
import { MateriaisPage } from './pages/MateriaisPage'
import { MinhasDoacoesPage } from './pages/MinhasDoacoesPage'
import { MinhasSolicitacoesPage } from './pages/MinhasSolicitacoesPage'
import { NaoEncontradaPage } from './pages/NaoEncontradaPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <MateriaisPage /> },
      { path: '/entrar', element: <EntrarPage /> },
      { path: '/cadastro', element: <CadastroPage /> },
      {
        path: '/doar',
        element: (
          <RotaProtegida>
            <DoarPage />
          </RotaProtegida>
        ),
      },
      {
        path: '/minhas-doacoes',
        element: (
          <RotaProtegida>
            <MinhasDoacoesPage />
          </RotaProtegida>
        ),
      },
      {
        path: '/minhas-solicitacoes',
        element: (
          <RotaProtegida>
            <MinhasSolicitacoesPage />
          </RotaProtegida>
        ),
      },
      { path: '*', element: <NaoEncontradaPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
