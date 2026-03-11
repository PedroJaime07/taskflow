# TaskFlow

Sistema de gerenciamento de tarefas — Stack: Node.js + Express + Prisma + PostgreSQL + React + TypeScript

---

## ⚙️ Pré-requisitos

- Node.js 18+
- npm 9+
- PostgreSQL 18 rodando localmente
- Banco de dados `taskflow` criado no pgAdmin

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/taskflow.git
cd taskflow
```

### 2. Configure o backend

```bash
cd api
cp .env.example .env
```

Abra o arquivo `.env` e edite:

```
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/taskflow"
JWT_SECRET="qualquer_string_longa_e_aleatoria"
JWT_EXPIRES_IN="7d"
PORT=3333
```

> Substitua `SUA_SENHA` pela senha que você definiu ao instalar o PostgreSQL.

### 3. Instale as dependências

Na raiz do projeto:

```bash
npm install
```

### 4. Rode as migrations do banco

```bash
cd api
npx prisma migrate dev --name init
```

Se tudo correr bem, as tabelas serão criadas no banco `taskflow`.

### 5. Gere o Prisma Client

```bash
npx prisma generate
```

### 6. Suba o projeto

Abra **dois terminais**:

**Terminal 1 — API:**
```bash
cd api
npm run dev
```

Deve aparecer: `🚀 Server running on http://localhost:3333`

**Terminal 2 — Web:**
```bash
cd web
npm run dev
```

Deve aparecer: `Local: http://localhost:5173`

### 7. Acesse

Abra o navegador em: **http://localhost:5173**

---

## 📁 Estrutura do projeto

```
taskflow/
├── api/
│   ├── prisma/
│   │   └── schema.prisma       # Modelos do banco
│   └── src/
│       ├── controllers/        # Lógica das rotas
│       ├── middlewares/        # Auth, error handler
│       ├── routes/             # Definição das rotas
│       ├── utils/              # Prisma client, AppError
│       ├── app.ts              # Express app
│       └── server.ts           # Entry point
└── web/
    └── src/
        ├── contexts/           # AuthContext
        ├── pages/              # LoginPage, RegisterPage, DashboardPage
        ├── services/           # api.ts (axios)
        └── App.tsx             # Rotas do React
```

---

## 🔗 Endpoints disponíveis

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /api/auth/register | Criar conta | ❌ |
| POST | /api/auth/login | Login | ❌ |
| GET | /api/auth/me | Dados do usuário logado | ✅ |
| POST | /api/workspaces | Criar workspace | ✅ |
| GET | /api/workspaces | Listar workspaces | ✅ |
| GET | /api/workspaces/:slug | Detalhe do workspace | ✅ |
| POST | /api/workspaces/:id/projects | Criar projeto | ✅ |
| GET | /api/workspaces/:id/projects | Listar projetos | ✅ |
| GET | /api/workspaces/:id/projects/:id | Detalhe do projeto | ✅ |
| POST | /api/projects/:id/tasks | Criar tarefa | ✅ |
| PATCH | /api/tasks/:id | Atualizar tarefa | ✅ |
| DELETE | /api/tasks/:id | Deletar tarefa | ✅ |

---

## ❓ Problemas comuns

**Erro de conexão com o banco:**
- Confirme que o PostgreSQL está rodando
- Verifique se a senha no `.env` está correta
- Confirme que o banco `taskflow` existe no pgAdmin

**`prisma migrate dev` falhou:**
- Verifique o `DATABASE_URL` no `.env`
- Certifique que está rodando o comando dentro da pasta `api/`
