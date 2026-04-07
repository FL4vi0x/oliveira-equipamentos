/*
  Warnings:

  - You are about to drop the column `forma_pagamento` on the `vendas` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "StatusVenda" ADD VALUE 'ORCAMENTO';

-- AlterTable
ALTER TABLE "vendas" DROP COLUMN "forma_pagamento";

-- CreateTable
CREATE TABLE "pagamentos_venda" (
    "id" TEXT NOT NULL,
    "venda_id" TEXT NOT NULL,
    "forma_pagamento" "FormaPagamento" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagamentos_venda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pagamentos_venda" ADD CONSTRAINT "pagamentos_venda_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "vendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
