FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm \
	&& corepack install -g pnpm@11.20.0 \
	&& mkdir -p /workspace /pnpm/store /data/avatars \
	&& chown -R node:node /workspace /pnpm /data/avatars

WORKDIR /workspace

USER node


FROM base AS deps

COPY --chown=node:node pnpm-lock.yaml pnpm-workspace.yaml package.json ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 \
	pnpm fetch

COPY --chown=node:node . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 \
	pnpm install --offline --frozen-lockfile


FROM deps AS development

ENV NODE_ENV="development"

RUN pnpm --filter otsukimi-ui build


FROM deps AS production

ENV NODE_ENV="production"


FROM deps AS builder

ENV NODE_ENV="production"

# Hono RPC型を含む backend/dist を先に生成
RUN pnpm --filter @ft/backend build

RUN pnpm --filter otsukimi-ui build

RUN pnpm --filter otsukimi-ui build-storybook

RUN pnpm --filter @ft/frontend build


FROM deps AS backend-production

ENV NODE_ENV="production"

COPY --from="builder" /workspace/apps/backend/dist /workspace/apps/backend/dist

CMD ["pnpm", "--filter", "@ft/backend", "start"]


FROM owasp/modsecurity-crs:3.3.10-nginx-202608131208@sha256:ccec5e3ecd1dcf6b48903268f4fe415fd17914e8bf30fc21263fd05cc7045f29 AS reverse-proxy-production

COPY --from="builder" /workspace/apps/frontend/dist /usr/share/nginx/html

COPY --from="builder" /workspace/packages/otsukimi-ui/storybook-static /usr/share/nginx/html/storybook
