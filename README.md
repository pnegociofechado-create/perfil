# Perfil — Negócio Fechado

MVP de captação de profissionais para a Plataforma Negócio Fechado.

## Fluxo

1. O profissional acessa `/#/criar-perfil`.
2. Preenche nome, profissão, cidade, WhatsApp e e-mail.
3. O cadastro é salvo no Supabase pela API da Vercel.
4. O perfil é publicado imediatamente em `/perfil/<slug>`, mesmo que o e-mail de acesso não seja enviado.
5. O sistema tenta enviar um Magic Link para o e-mail informado, mas uma falha de envio não bloqueia a publicação.
6. O profissional pode usar `/perfil/editar` para solicitar o acesso à edição posteriormente.
7. Você acompanha os cadastros em `/#/admin/leads`.

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
- `/perfil/editar` — edição protegida do perfil por Magic Link

## Desenvolvimento

```bash
npm install
npm run dev
```

## Meta do MVP

A primeira versão foi desenhada para validar a captação dos primeiros 10 profissionais antes de adicionar autenticação completa, upload de fotos, pagamentos ou automações comerciais.

<!-- Vercel Git integration smoke test -->


## Edição segura do perfil

A área `/perfil/editar` continua protegida por Supabase Auth com Magic Link. A autenticação não é exigida para publicar o perfil: o profissional primeiro cria e publica sua vitrine, e o e-mail é usado apenas como mecanismo de acesso à edição.

Para habilitar a edição por e-mail em produção, configure na Vercel:

- `VITE_SUPABASE_URL` = URL pública do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` = chave pública anon/publishable do Supabase
- `SUPABASE_ANON_KEY` = a mesma chave pública, usada pela API para validar sessões
- mantenha `SUPABASE_SERVICE_ROLE_KEY` somente no servidor.

No Supabase Authentication → URL Configuration, adicione:
`https://onegociofechado.vercel.app/perfil/editar`

Se o provedor de e-mail do Supabase atingir o rate limit, o cadastro continua funcionando e o perfil continua público. SMTP próprio pode ser configurado depois, quando o MVP precisar de maior volume de e-mails.
