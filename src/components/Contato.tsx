import type { Contato } from '../lib/types'

// Monta o número no formato do WhatsApp (55 + DDD + número). Retorna null se não parecer um celular/fixo brasileiro.
function numeroWhatsapp(telefone: string): string | null {
  let digitos = telefone.replace(/\D/g, '')
  if (digitos.startsWith('0')) digitos = digitos.replace(/^0+/, '')
  if (digitos.length === 10 || digitos.length === 11) return `55${digitos}`
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith('55')) return digitos
  return null
}

const classeBotao =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 font-bold transition-colors sm:w-auto'

export function DadosContato({ contato, papel, material }: { contato: Contato; papel: string; material: string }) {
  if (!contato.email && !contato.telefone) return null

  const primeiroNome = contato.nome.split(' ')[0]
  const whatsapp = contato.telefone ? numeroWhatsapp(contato.telefone) : null
  const texto = `Olá, ${primeiroNome}! Falo sobre o material "${material}" do EducaReuse. Podemos combinar a entrega?`

  return (
    <div className="flex flex-col gap-3 rounded-lg border-l-4 border-tinta bg-tinta-clara px-4 py-3">
      <p className="font-bold text-tinta-escura">
        Combine a entrega com {contato.nome} ({papel})
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`}
            target="_blank"
            rel="noreferrer"
            className={`${classeBotao} bg-[#1d7a46] text-white hover:bg-[#17663a]`}
          >
            <IconWhatsapp />
            Chamar no WhatsApp
          </a>
        )}
        {contato.telefone && !whatsapp && (
          <a href={`tel:${contato.telefone}`} className={`${classeBotao} bg-tinta text-sobre-tinta hover:bg-tinta-escura`}>
            Ligar para {contato.telefone}
          </a>
        )}
        {contato.email && (
          <a
            href={`mailto:${contato.email}?subject=${encodeURIComponent(`EducaReuse: ${material}`)}&body=${encodeURIComponent(texto)}`}
            className={`${classeBotao} border-2 border-tinta bg-papel text-tinta hover:bg-tinta-clara`}
          >
            Enviar e-mail
          </a>
        )}
      </div>

      <p className="break-words text-sm text-grafite-suave">
        {[contato.telefone, contato.email].filter(Boolean).join(' · ')}
      </p>
    </div>
  )
}

function IconWhatsapp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
    </svg>
  )
}
