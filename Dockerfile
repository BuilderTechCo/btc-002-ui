FROM node:26-alpine AS builder

WORKDIR /app

RUN npm install --global pnpm@9.12.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build-storybook

FROM nginx:alpine AS runtime

COPY --from=builder /app/storybook-static /usr/share/nginx/html

EXPOSE 80
