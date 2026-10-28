import { useEffect, useState } from 'react'

type Tema = 'light' | 'dark'

export function useTheme() {
  const [tema, setTema] = useState<Tema>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
    const html = document.documentElement
    if (tema === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('tema', tema)
  }, [tema])

  return { tema, alternar: () => setTema((t) => (t === 'dark' ? 'light' : 'dark')) }
}
