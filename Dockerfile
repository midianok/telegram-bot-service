FROM node:slim AS restore

WORKDIR /restore

COPY package.json tsconfig.json yarn.lock ./
RUN yarn

FROM node:slim AS build

WORKDIR /build

COPY --from=build /restore/* ./
COPY src ./src

RUN ./node_modules/.bin/tsc --outDir dist --sourceMap false

FROM node:slim AS prod
WORKDIR /app

COPY --from=build /build/package.json ./
COPY --from=build /build/dist ./
COPY healthcheck.sh ./
RUN yarn --prod

ENTRYPOINT ["node", "index.js"]
