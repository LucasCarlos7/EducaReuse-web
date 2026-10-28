const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export function formatarData(iso: string): string {
  return formatoData.format(new Date(iso))
}
