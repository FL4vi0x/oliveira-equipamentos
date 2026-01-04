# Oliveira Equipamentos - ERP

Sistema de gestão integrado para a Oliveira Equipamentos, focado em controle de estoque, ordens de serviço e vendas.

> [!NOTE]
> Para detalhes sobre a estrutura técnica e padrões de código, veja o documento de [Arquitetura](docs/ARCHITECTURE.md).


## 🚀 Tecnologias principais

- **Monorepo:** PNPM Workspaces
- **Backend:** NestJS, Prisma, PostgreSQL
- **Frontend:** React, Vite, Zustand, TanStack Query
- **Desktop:** Electron
- **Containerização:** Docker & Docker Compose
- **Qualidade de Código:** ESLint, Prettier, Husky

## 🛠️ Como rodar o projeto

### Pré-requisitos
- Node.js lts/iron (v20+)
- PNPM (`npm install -g pnpm`)
- Docker & Docker Compose

### Passos para execução

1. **Instale as dependências:**
   ```bash
   pnpm install
   ```

2. **Configure o ambiente:**
   - Crie um arquivo `.env` na raiz (baseado no `.env.example`, se disponível).

3. **Suba o Banco de Dados:**
   ```bash
   docker-compose up -d
   ```

4. **Rode as migrações do banco:**
   ```bash
   pnpm prisma:migrate
   ```

5. **Inicie o ambiente de desenvolvimento:**
   ```bash
   pnpm dev
   ```
   Isso iniciará o Backend, Frontend e Electron simultaneamente.

## 🏗️ Estrutura do Projeto

- `packages/backend`: API NestJS.
- `packages/frontend`: Aplicação Web React.
- `packages/electron`: Wrapper desktop.

## 👷 CI/CD e Qualidade

- **GitHub Actions:** Pipeline configurado para lint e testes automáticos em cada Push/PR.
- **Husky:** Hooks de pre-commit para garantir a formatação do código.

## 🌿 Estrutura de Branches

Para manter a estabilidade do projeto, utilizamos o seguinte modelo:

- **`main`**: Código em produção. Apenas merges via Pull Request.
- **`develop`**: Integração de novas funcionalidades. É a branch de trabalho estável.
- **`feature/*`**: Desenvolvimento de novas tarefas (ex: `feature/cadastrar-produto`).

> [!TIP]
> Sempre desenvolva em uma branch separada e faça o merge para a `develop` quando terminar.

---
Desenvolvido por Oliveira Equipamentos.
