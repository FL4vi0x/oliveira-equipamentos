# UI Preview Mode

O **UI Preview Mode** é uma funcionalidade exclusiva do ambiente de desenvolvimento que permite rodar o frontend de forma completamente isolada do backend e do banco de dados. 

Seu principal objetivo é facilitar testes de interface, debug de componentes, e o fornecimento de contexto para ferramentas de Inteligência Artificial (como o V0 da Vercel) que precisam visualizar as rotas protegidas do sistema sem configurar um banco de dados real ou realizar autenticação.

## 🚀 Como Ativar

Para ativar o modo de preview, basta rodar o servidor de desenvolvimento injetando a variável de ambiente `VITE_UI_PREVIEW_MODE=true`.

No terminal, dentro de `packages/frontend`, execute:
```bash
VITE_UI_PREVIEW_MODE=true npm run dev
```

> No Windows (Powershell), utilize:
> ```powershell
> $env:VITE_UI_PREVIEW_MODE="true"; npm run dev
> ```

## ⚙️ Como Funciona?

O modo de preview altera o comportamento do sistema de forma não destrutiva, garantindo que nada disso vaze para o ambiente de produção:

1. **Autenticação Mockada:** O `AuthContext` irá definir `isAuthenticated` como `true` instantaneamente e fornecerá um usuário fictício ("Administrador Oliveira"). Isso significa que a tela de Login será ignorada, redirecionando você direto para as rotas internas (`/erp/*`).
2. **Interceptação de API:** O utilitário central de requisições (`services/api.ts`) interceptará qualquer chamada antes de tentar atingir a rede. Ele redireciona o endpoint requisitado para o nosso `mockHandler.ts` central.
3. **Mocks de Dados:** O sistema utilizará os dados encontrados na pasta `packages/frontend/src/mocks/` para povoar as tabelas de Vendas, Produtos, Clientes, Dashboard e Estoque.

## 📁 Estrutura de Mocks

Você pode expandir os dados do preview editando os seguintes arquivos na pasta `src/mocks/`:
- `sales.mock.ts`
- `products.mock.ts`
- `categories.mock.ts`
- `customers.mock.ts`
- `previewUser.mock.ts`

Para criar mocks para novas rotas da API, basta atualizar a função `handleMockRequest` dentro de `src/mocks/mockHandler.ts`.

## 🔒 Segurança (Production-Safe)

Este modo é ativado apenas se as duas condições forem verdadeiras:
1. `import.meta.env.DEV` for verdadeiro (garantindo que o Vite está rodando no modo dev).
2. A flag `VITE_UI_PREVIEW_MODE` for `"true"`.

Durante a compilação (build) para produção, o empacotador identificará que `import.meta.env.DEV` é falso e descartará completamente o código do preview mode usando "Dead Code Elimination", garantindo um bundle limpo e sem acesso aos mocks.
