FROM node:18-alpine as development

# Add time zone
RUN apk add --no-cache tzdata

# Set time zone
ENV TZ=Asia/Kathmandu

RUN set -x \
  && apk update \
  && apk upgrade

WORKDIR /usr/src/app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "dev"]

FROM node:18-alpine as production

# Add time zone
RUN apk add --no-cache tzdata

# Set time zone
ENV TZ=Asia/Kathmandu

RUN set -x \
  && apk update \
  && apk upgrade

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "preview"]
