# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Instalando pnpm
RUN npm install -g pnpm

# Copiando arquivos do monorepo
COPY . .

# Instalando dependências e buildando
RUN pnpm install --frozen-lockfile
RUN cd packages/backend && pnpm prisma generate && pnpm run build

# Estágio de Produção
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copiamos o workspace inteiro no estágio de produção (ajustado para ser leve)
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/backend/package.json ./packages/backend/
COPY --from=build /app/packages/backend/dist ./packages/backend/dist
COPY --from=build /app/packages/backend/node_modules ./packages/backend/node_modules

EXPOSE 3001

CMD ["pnpm", "--filter", "backend", "start:prod"]

