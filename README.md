# Perfil — Negócio Fechado

MVP de captação de profissionais para a Plataforma Negócio Fechado.

## Fluxo

1. O profissional acessa `/#/criar-perfil`.
2. Preenche nome, profissão, cidade, WhatsApp e e-mail.
3. O cadastro é salvo no Supabase pela API da Vercel.
4. O sistema gera automaticamente uma URL pública em `/perfil/<slug>`.
5. Você acompanha os cadastros em `/#/admin/leads`.

O perfil original do Negócio Fechado continua disponível em `/#/perfil`.

## Configuração do banco

Crie um projeto no Supabase e execute `supabase/schema.sql`.

No Vercel, configure estas variáveis de ambiente:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_KEY`

A chave `SUPABASE_SERVICE_ROLE_KEY` fica somente no backend da Vercel. Nunca coloque essa chave no frontend.

## Rotas

- `/#/perfil` — perfil principal
- `/#/criar-perfil` — formulário público de captação
- `/#/admin/leads` — painel de leads
- `/perfil/<slug>` — perfil público de um profissional captado
- `/#/perfil/editar` — edição local do perfil principal

## Desenvolvimento

```bash
npm install
npm run dev
```

## Meta do MVP

A primeira versão foi desenhada para validar a captação dos primeiros 10 profissionais antes de adicionar autenticação completa, upload de fotos, pagamentos ou automações comerciais.

<!-- Vercel Git integration smoke test -->


## Edição segura do perfil

A área `/perfil/editar` usa Supabase Auth com link mágico por e-mail. Para habilitar em produção, configure na Vercel:

- `VITE_SUPABASE_URL` = URL pública do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` = chave pública anon/publishable do Supabase
- `SUPABASE_ANON_KEY` = a mesma chave pública, usada pela API para validar sessões
- mantenha `SUPABASE_SERVICE_ROLE_KEY` somente no servidor.

No Supabase Authentication → URL Configuration, adicione:
`https://onegociofechado.vercel.app/perfil/editar`

O usuário recebe um link de acesso por e-mail, e somente uma sessão autenticada cujo e-mail corresponde ao cadastro consegue editar o perfil. O e-mail do perfil não é alterável pela área de edição nesta versão.
