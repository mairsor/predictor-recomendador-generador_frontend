# Dockerfile - Frontend Next.js
# Sistema de Recomendación y Generación de Horarios - UNI

# Etapa 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps && \
    npm cache clean --force

# Etapa 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build-time arguments para Next.js
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_PREDICTOR_URL
ARG NEXT_PUBLIC_RECOMENDADOR_URL

# Convertir args a env vars para Next.js
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_PREDICTOR_URL=$NEXT_PUBLIC_PREDICTOR_URL
ENV NEXT_PUBLIC_RECOMENDADOR_URL=$NEXT_PUBLIC_RECOMENDADOR_URL

# Construir aplicación
RUN npm run build

# Etapa 3: Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copiar archivos necesarios
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Exponer puerto
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Comando de inicio
CMD ["node", "server.js"]
