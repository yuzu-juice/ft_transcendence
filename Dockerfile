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
