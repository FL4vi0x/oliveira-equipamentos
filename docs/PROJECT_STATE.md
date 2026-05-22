# 📚 Documentação do Estado Atual do Projeto: Oliveira Equipamentos (ERP & PDV)

Este documento foi gerado automaticamente e reflete o **estado atual, arquitetura e os módulos** do projeto `oliveira-equipamentos`. Ele é ideal para ser usado como contexto principal ao introduzir o projeto a uma nova IA (como o ChatGPT) para continuar o desenvolvimento.

---

## 🎯 1. Visão Geral
O sistema é um **ERP integrado com Frente de Caixa (PDV)** desenvolvido sob uma arquitetura de **Monorepo**. O objetivo é gerenciar vendas, estoque, catálogo de produtos, clientes e gerar documentos legais (contratos e promissórias), podendo rodar tanto no navegador quanto encapsulado como um aplicativo Desktop via Electron.

## 🛠 2. Stack Tecnológica
*   **Backend:** NestJS, Prisma ORM, PostgreSQL, Handlebars (motor de templates para geração de documentos em HTML/PDF).
*   **Frontend:** React, TypeScript, Vite, TailwindCSS (e/ou Vanilla CSS componentizado), TanStack Query (React Query para chamadas assíncronas e cache de estado), e ícones do `lucide-react`.
*   **Desktop App:** Electron (com preload script e IPC handlers) usado para evitar problemas de CORS, acesso nativo a impressoras e empacotamento offline-first.
*   **Gerenciador de Pacotes:** `pnpm` e workspaces. Rodamos todo o ecossistema local com `concurrently` (comando `pnpm run dev`).

---

## 🏗 3. Estrutura do Monorepo

O projeto está dividido em `packages/`:

*   **`backend/`**: A API REST em NestJS estruturada por domínios/módulos. Contém a configuração do Prisma.
*   **`frontend/`**: O SPA em React que consome a API. Contém toda a interface do ERP e do PDV.
*   **`electron/`**: Um empacotador minimalista. Nele temos `main.ts` (processo principal) e `preload.ts` que expõe `window.electronAPI` para o frontend.
*   **`shared/`**: Tipagens TypeScript (ex: `venda.types.ts`) e constantes compartilhadas entre Frontend, Backend e Electron, garantindo contratos estritos.

---

## 📦 4. Módulos Implementados

### 🟢 Backend (NestJS)
Localizados em `packages/backend/src/modules/`:

1.  **Auth:** Autenticação via JWT (`JwtAuthGuard`, geração de tokens e endpoints de refresh token).
2.  **Caixa:** Gerencia a abertura e fechamento de caixas operacionais, vinculados ao usuário logado e cruciais para liberar operações de venda no PDV.
3.  **Categorias & Produtos:** CRUD completo do catálogo. Produtos controlam precificação (custo, venda, margem) e regras de estoque (estoqueAtual, mínimo).
4.  **Clientes:** Cadastro de clientes pessoa física ou jurídica (com validação de CPF/CNPJ via schema Prisma).
5.  **Dashboard:** Agregadores SQL/Prisma otimizados para KPIs (Faturamento do dia, vendas concluídas, alertas de baixo estoque).
6.  **Documentos:** Serviço dedicado (`TemplateService`) com Handlebars para montar visualmente **Contratos de Compra e Venda**, **Promissórias** e **Recibos**.
7.  **Estoque:** Trata inventário, movimentações avulsas e o histórico rastreável (`MovimentacaoEstoque`) de entradas/saídas por ajuste ou devolução.
8.  **Vendas:** Lógica transacional pesada. Uma venda cria itens, pagamentos, parcela de dívidas e, em uma única transação de banco de dados (`$transaction`), faz a baixa no saldo do estoque e soma o valor nas métricas do `CaixaRegistro`.
9.  **Usuários:** Operadores do sistema, com perfis (ADMIN, VENDEDOR, etc).

### 🔵 Frontend (React)
Localizados em `packages/frontend/src/pages/erp/`:

1.  **Login & Auth:** Contexto React (`AuthContext`) controlando rotas protegidas e sessão.
2.  **Dashboard:** Resumo executivo interativo.
3.  **Gestão de Estoque e Produtos:** Listagem, tabelas de dados paginadas e modais de criação/ajuste rápido.
4.  **Gestão de Vendas (`VendasPage.tsx`):** Histórico retroativo, visualização de vendas completas, funcionalidade de cancelamento de vendas (que gera estorno de estoque imediato na API) e atalho para o modal de **Geração de Documentos Legais**.
5.  **Frente de Caixa (PDV) (`PDVPage.tsx`):**
    *   Fluxo hiper-otimizado e focado em atalhos de teclado (`F1` para identificar cliente, `F12` para cobrar).
    *   Carrinho de compras reativo e busca de produtos rápida.
    *   Modal multi-formas de pagamento (Dinheiro, Cartão, PIX, Promissória).
    *   Verificação constante de "Caixa Aberto" (exige que o usuário abra um caixa para operar).
6.  **Integração API (`services/api.ts`):** Camada de rede inteligente. Tenta usar o `electronAPI.apiRequest` via IPC. Se der um erro comum como `401 Unauthorized`, realiza fallback em background para o Axios (chamada HTTP padrão da web), o qual executa a interceptação do Token Refresh (`/auth/refresh`), garantindo UX contínua.

---

## 🗄 5. Entidades Principais do Banco de Dados (Prisma Schema)

*   **Comercial:** `Produto`, `Categoria`, `MovimentacaoEstoque` (Entrada, Saída, Venda, Devolução).
*   **Vendas & Operação:** `Venda` (com Status: PENDENTE, ORCAMENTO, CONCLUIDA, CANCELADA), `ItemVenda`, `PagamentoVenda`, `ParcelaVenda` (para vendas feitas na "promissória").
*   **Financeiro e PDV:** `CaixaRegistro` (saldo de abertura, fechamento, e total acumulado do dia).
*   **Pessoas & Acessos:** `Usuario`, `Cliente`, `Empresa`.
*   **Logs e Administrativo:** `AuditLog` (histórico de ações para segurança).
*   *(WIP / Planejadas)*: `Fornecedor`, `Compra`, `ContaPagar`, `ContaReceber`.

---

## 🔧 6. Contexto de Fixes e Decisões Recentes

Ao introduzir o ChatGPT neste projeto, tenha em mente estas particularidades e soluções recém-implementadas:

1.  **Problemas de "Zumbis" na Porta 3001:** Historicamente ocorreram conflitos com processos Node antigos não finalizados no Windows (`EADDRINUSE`). O projeto foi validado garantindo encerramento correto e limpeza de portas.
2.  **Lógica de Revalidação do React Query:** Os dados das páginas (como a lista de Vendas) usam cache do `@tanstack/react-query` (com `staleTime` de 5 minutos). Quando uma venda é concluída na tela do PDV (`finalizarVenda`), fazemos explicitamente o comando `queryClient.invalidateQueries({ queryKey: ['vendas'] })` para evitar exibir dados congelados quando o usuário volta à listagem geral.
3.  **Logs do Electron Limitados:** O terminal do NestJS/Electron foi limpado de disparar stacks enormes para erros benignos HTTP (como 401 e 404), deixando que o Frontend trate isso via Refresh Token ou Modais de Not found sem causar pânico no terminal (`[ELECTRON API ERROR]`).
4.  **CSP Header Adjustments:** A política de segurança de conteúdo (`index.html`) foi atualizada para permitir flexibilidade de chamadas híbridas (IPC e `127.0.0.1:*`) nas rotinas de fallback do `axiosClient`.

---
*Fim do documento. Você pode fornecer este conteúdo integralmente como base para prompts de continuação de desenvolvimento do ERP.*
