// Reduz a foto no navegador antes do envio. Fotos de celular costumam ter vários megabytes;
// depois da redução ficam com algumas centenas de KB, o que acelera o envio e a listagem.

const LADO_MAXIMO = 1280
const QUALIDADE = 0.8

export class ErroImagem extends Error {}

async function carregar(arquivo: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      // 'from-image' respeita a orientação EXIF (foto tirada com o celular "em pé").
      return await createImageBitmap(arquivo, { imageOrientation: 'from-image' })
    } catch {
      // alguns navegadores não decodificam certos formatos aqui; tenta pelo <img>
    }
  }

  const url = URL.createObjectURL(arquivo)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
  } catch {
    throw new ErroImagem('Não foi possível abrir esta imagem. Tente outra foto, de preferência em JPEG ou PNG.')
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function reduzirImagem(arquivo: File): Promise<File> {
  if (!arquivo.type.startsWith('image/') && !/\.(heic|heif)$/i.test(arquivo.name)) {
    throw new ErroImagem('Envie um arquivo de imagem.')
  }

  const imagem = await carregar(arquivo)
  const largura = 'naturalWidth' in imagem ? imagem.naturalWidth : imagem.width
  const altura = 'naturalHeight' in imagem ? imagem.naturalHeight : imagem.height
  const escala = Math.min(1, LADO_MAXIMO / Math.max(largura, altura))

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(largura * escala)
  canvas.height = Math.round(altura * escala)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new ErroImagem('Seu navegador não conseguiu processar a imagem.')
  ctx.fillStyle = '#ffffff' // PNG com transparência vira fundo branco no JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height)
  if ('close' in imagem) imagem.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALIDADE))
  if (!blob) throw new ErroImagem('Seu navegador não conseguiu processar a imagem.')

  const nome = arquivo.name.replace(/\.[^.]+$/, '') || 'foto'
  return new File([blob], `${nome}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
}
