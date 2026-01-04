# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Instalando pnpm
RUN npm install -g pnpm

# Copiando arquivos de configuração do monorepo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/backend/package.json ./packages/backend/

# Instalando dependências (apenas do backend)
RUN pnpm install --filter backend...

# Copiando o resto do código do backend
COPY packages/backend ./packages/backend

# Gerando Prisma Client e Build
RUN cd packages/backend && pnpm prisma generate && pnpm run build

# Estágio de Produção
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=build /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=build /app/packages/backend/package.json ./packages/backend/
COPY --from=build /app/packages/backend/dist ./packages/backend/dist
COPY --from=build /app/packages/backend/node_modules ./packages/backend/node_modules

EXPOSE 3001

CMD ["pnpm", "--filter", "backend", "start:prod"]
