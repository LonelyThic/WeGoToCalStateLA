FROM node:25-alpine AS builder
WORKDIR /build
COPY ./client/package.json ./client/package-lock.json ./
RUN node -v && npm -v && npm config get strict-peer-deps && npm config get legacy-peer-deps
RUN npm ci --legacy-peer-deps
COPY ./client/ ./
RUN npx expo export --platform web

FROM nginx:alpine AS runner
COPY --from=builder /build/dist/ /usr/share/nginx/html/
