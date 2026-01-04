# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

RUN npm install -g pnpm

# Copiando arquivos de configuração do monorepo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/frontend/package.json ./packages/frontend/

# Instalando dependências
RUN pnpm install --filter frontend...

# Copiando código e buildando
COPY packages/frontend ./packages/frontend
RUN cd packages/frontend && pnpm run build

# Estágio de Servidor (Nginx)
FROM nginx:stable-alpine

COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html

# Configuração customizada do Nginx para Single Page Application (opcional mas recomendado)
# RUN rm /etc/nginx/conf.d/default.conf
# COPY packages/frontend/nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
