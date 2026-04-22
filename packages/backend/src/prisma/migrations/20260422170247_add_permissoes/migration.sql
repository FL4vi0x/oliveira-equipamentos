-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "permissoes" TEXT[] DEFAULT ARRAY[]::TEXT[];
