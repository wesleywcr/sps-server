<br />
<h1 align="center"> <strong>SPS SERVER</strong></h1>

<div align="center">
  <p align="center">
<img alt="author" src="https://img.shields.io/static/v1?label=WesleyRodrigues&message=Author&color=41b883&labelColor=000000">

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)

</p>
</div>
<br />


# Sobre
API REST para gerenciamento de usuários com autenticação JWT. Permite login, cadastro, listagem paginada, edição e exclusão de usuários, com controle de acesso por perfis (admin e user).

---

## Tecnologias

- **Node.js** — Runtime JavaScript
- **Express** — Framework web
- **jsonwebtoken** — Geração e validação de JWT
- **swagger** — Documentação interativa da API (OpenAPI 3.0)


---

## Estrutura de pastas

```
sps-server/
├── .env.example          # Modelo de variáveis de ambiente
├── package.json
├── README.md
└── src/
    ├── index.js          # Ponto de entrada do servidor
    ├── app.js            # Configuração da aplicação Express
    ├── swagger.json      # Especificação OpenAPI
    ├── common/
    │   ├── errors/       # Erros customizados
    │   ├── middleware/   # Autenticação e autorização
    │   └── utils/        # Utilitários
    ├── db/
    │   └── db.json       # Armazenamento em JSON (usuários)
    ├── http/
    │   └── requests.http # Exemplos de requisições HTTP
    └── modules/
        ├── auth/         # Módulo de autenticação (login)
        └── user/         # Módulo de usuários (CRUD)
```

---

## Pré-requisitos

- **Node.js** 18 ou superior (necessário para `--env-file` no script de desenvolvimento)
- **npm** ou **yarn**

---

## Instalação e execução

1. **Clone o repositório** (ou acesse a pasta do projeto):

   ```bash
   git clone https://github.com/wesleywcr/sps-server.git
   cd sps-server
   ```

2. **Instale as dependências:**
 ```bash
  yarn install
   ```


3. **Configure as variáveis de ambiente:**

   Edite o `.env` e defina pelo menos `JWT_SECRET` (e opcionalmente `PORT`). Veja a seção [Variáveis de ambiente](#variáveis-de-ambiente).

4. **Inicie o servidor em modo desenvolvimento:**


   ```bash
   yarn dev
   ```

   O servidor estará disponível em **http://localhost:3333** (ou na porta definida em `PORT`).

---

## Variáveis de ambiente

| Variável     | Descrição                          | Obrigatória | Padrão |
|-------------|-------------------------------------|-------------|--------|
| `PORT`      | Porta em que o servidor escuta      | Não         | `3333` |
| `JWT_SECRET`| Chave secreta para assinatura JWT  | Sim         | —      |


---

## Endpoints da API

### Autenticação

| Método | Rota      | Descrição | Autenticação |
|--------|-----------|-----------|--------------|
| POST   | `/signin` | Login (retorna token JWT) | Não |

### Usuários (prefixo `/user`)

| Método | Rota               | Descrição              | Autenticação   |
|--------|--------------------|------------------------|----------------|
| GET    | `/user`            | Listar usuários (paginado) | JWT obrigatório |
| POST   | `/user`            | Criar usuário          | Apenas admin   |
| GET    | `/user/:id`        | Buscar usuário por ID  | JWT obrigatório |
| PATCH  | `/user/:id`        | Editar usuário         | Dono do perfil ou admin  |
| DELETE | `/user/:id`        | Excluir usuário        | Dono do perfil ou admin  |
| PATCH  | `/user/:id/password` | Alterar senha        | Dono do perfil ou admin  |

**Query params em `GET /user`:** `page` (página, 1-based), `perPage` (itens por página; padrão 10, máximo 100).

### Outros Endpoints

| Método | Rota   | Descrição        |
|--------|--------|------------------|
| GET    | `/docs`| Documentação Swagger UI |

---

## Autenticação

A API usa **JWT**:

1. **Login:** envie `POST /signin` com `{ "email": "...", "password": "..." }`. A resposta inclui `accessToken`.
2. **Requisições protegidas:** envie o token no cabeçalho:
   ```
   Authorization: Bearer <seu_accessToken>
   ```
3. O token expira em **7 dias** e contém `id`, `email`, `name` e `type` do usuário.

**Perfis (roles):**

- **admin** — Pode criar usuários e acessar todas as rotas de usuário.
- **user** — Pode editar/excluir apenas o próprio usuário e alterar a própria senha.

---

## Documentação Swagger

A documentação interativa da API (OpenAPI 3.0) está disponível em:

**http://localhost:3333/docs**

Lá você pode visualizar todos os endpoints, schemas e testar as requisições diretamente pelo navegador.

---



Released in 2026.
By [Wesley Rodrigues](https://github.com/wesleywcr)🤙👊
