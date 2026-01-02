-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE', 'VENDA', 'DEVOLUCAO');

-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO', 'TRANSFERENCIA', 'CHEQUE', 'OUTROS');

-- CreateEnum
CREATE TYPE "StatusVenda" AS ENUM ('PENDENTE', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMIN', 'GERENTE', 'VENDEDOR', 'ESTOQUISTA');

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "codigo_interno" TEXT NOT NULL,
    "codigo_barras" TEXT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria_id" TEXT NOT NULL,
    "unidade_medida" TEXT NOT NULL,
    "preco_compra" DECIMAL(10,2) NOT NULL,
    "preco_venda" DECIMAL(10,2) NOT NULL,
    "margem_lucro" DECIMAL(5,2) NOT NULL,
    "estoque_atual" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "estoque_minimo" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "estoque_maximo" DECIMAL(10,3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ncm" TEXT,
    "cest" TEXT,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes_estoque" (
    "id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "quantidade" DECIMAL(10,3) NOT NULL,
    "motivo" TEXT,
    "usuario_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "tipo" "TipoCliente" NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "celular" TEXT,
    "endereco" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" CHAR(2),
    "cep" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "cliente_id" TEXT,
    "usuario_id" TEXT NOT NULL,
    "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "forma_pagamento" "FormaPagamento" NOT NULL,
    "status" "StatusVenda" NOT NULL DEFAULT 'CONCLUIDA',
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_venda" (
    "id" TEXT NOT NULL,
    "venda_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "quantidade" DECIMAL(10,3) NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "itens_venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_codigo_interno_key" ON "produtos"("codigo_interno");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_codigo_barras_key" ON "produtos"("codigo_barras");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_cnpj_key" ON "clientes"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "vendas_numero_key" ON "vendas"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_venda" ADD CONSTRAINT "itens_venda_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "vendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_venda" ADD CONSTRAINT "itens_venda_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
