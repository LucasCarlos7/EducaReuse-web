import type { Contato } from '../lib/types'

export function DadosContato({ contato, papel }: { contato: Contato; papel: string }) {
  if (!contato.email && !contato.telefone) return null

  const whatsapp = contato.telefone ? contato.telefone.replace(/\D/g, '') : ''

  return (
    <div className="rounded-lg border-l-4 border-tinta bg-tinta-clara px-4 py-3">
      <p className="font-bold text-tinta-escura">
        Combine a entrega com {contato.nome} ({papel})
      </p>
      <ul className="mt-1 flex flex-col gap-0.5">
        {contato.email && (
          <li>
            E-mail:{' '}
            <a href={`mailto:${contato.email}`} className="font-bold text-tinta underline underline-offset-4">
              {contato.email}
            </a>
          </li>
        )}
        {contato.telefone && (
          <li>
            Telefone:{' '}
            <a
              href={whatsapp.length >= 10 ? `https://wa.me/55${whatsapp.replace(/^55/, '')}` : `tel:${contato.telefone}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-tinta underline underline-offset-4"
            >
              {contato.telefone}
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}
