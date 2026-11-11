FROM node:26-alpine AS builder

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build-storybook

FROM nginx:alpine AS runtime

COPY --from=builder /app/storybook-static /usr/share/nginx/html

EXPOSE 80
