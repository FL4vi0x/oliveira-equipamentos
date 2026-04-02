-- CreateEnum
CREATE TYPE "StatusCaixa" AS ENUM ('ABERTO', 'FECHADO');

-- AlterTable
ALTER TABLE "vendas" ADD COLUMN     "caixa_id" TEXT;

-- CreateTable
CREATE TABLE "caixas_registro" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "status" "StatusCaixa" NOT NULL DEFAULT 'ABERTO',
    "saldo_abertura" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saldo_fechamento" DECIMAL(10,2),
    "total_vendas" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "data_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fechamento" TIMESTAMP(3),
    "observacoes" TEXT,

    CONSTRAINT "caixas_registro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_caixa_id_fkey" FOREIGN KEY ("caixa_id") REFERENCES "caixas_registro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixas_registro" ADD CONSTRAINT "caixas_registro_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
