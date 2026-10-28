import { Vazio } from '../components/ui'

export function NaoEncontradaPage() {
  return <Vazio titulo="Esta página não existe." acao={{ texto: 'Ir para os materiais', para: '/' }} />
}
