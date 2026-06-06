FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY server.js ./
COPY config ./config
COPY controllers ./controllers
COPY models ./models
COPY routes ./routes


FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY --from=builder /app/server.js ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/models ./models
COPY --from=builder /app/routes ./routes

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/server/health || exit 1

CMD ["npx", "nodemon", "-L", "server.js"]