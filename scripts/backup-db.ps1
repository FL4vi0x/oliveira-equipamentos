# Script de Backup do Banco de Dados - Oliveira Equipamentos

$DATE = Get-Date -Format "yyyyMMdd_HHmm"
$BACKUP_DIR = "./backups"
$FILENAME = "backup_oliveira_erp_$DATE.sql"
$DB_CONTAINER = "oliveira-db" 
$DB_USER = "oliveira"
$DB_NAME = "oliveira_erp"

# Criar diretório de backup se não existir
if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR
}

Write-Host "🚀 Iniciando backup do banco de dados..." -ForegroundColor Cyan

# Executar pg_dump dentro do container Docker
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/$FILENAME"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup concluído com sucesso: $BACKUP_DIR/$FILENAME" -ForegroundColor Green
}
else {
    Write-Host "❌ Erro ao realizar o backup. Verifique se o container está rodando." -ForegroundColor Red
}
