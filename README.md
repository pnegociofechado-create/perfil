# Perfil — Negócio Fechado

Módulo independente de Perfil profissional extraído do projeto Obras.

## Rotas
- `#/perfil` — perfil público principal
- `#/perfil/editar` — edição local do perfil
- `#/perfil/joao-pereira` — perfil demonstrativo
- `#/perfil/joao-pereira/kit` — kit com QR Code e impressão

## Desenvolvimento
```bash
npm install
npm run dev
```

O perfil principal usa localStorage no navegador. Não há backend ou banco de dados neste módulo.
