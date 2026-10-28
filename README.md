# EducaReuse — Web

Frontend da plataforma EducaReuse (React + TypeScript + Vite + Tailwind CSS).

## Rodar localmente

```bash
npm install
npm run dev
```

A URL da API fica em `.env.development` (`VITE_API_URL`, padrão `http://localhost:5080`).

## Build

```bash
npm run build   # gera a pasta dist/
```

## Deploy no Render (Static Site)

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Variável de ambiente: `VITE_API_URL=https://<sua-api>.onrender.com`
- Redirects/Rewrites: origem `/*`, destino `/index.html`, ação **Rewrite** (necessário para as rotas do React Router).
