FROM node:25-alpine AS builder
WORKDIR /server
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM node:25-alpine AS runner
WORKDIR /server
RUN adduser --disabled-password dev && chown -R dev:dev /server
USER dev
COPY --from=builder /server/. ./

EXPOSE 3000
CMD ["npm", "start"]