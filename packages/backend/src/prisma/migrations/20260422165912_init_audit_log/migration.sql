-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidade_id" TEXT,
    "usuario_id" TEXT,
    "payload" JSONB,
    "old_payload" JSONB,
    "metodo" TEXT,
    "rota" TEXT,
    "status_code" INTEGER,
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);
