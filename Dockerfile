FROM node:slim AS build

WORKDIR /build

COPY package.json tsconfig.json yarn.lock ./
COPY src ./src
RUN yarn
RUN ./node_modules/.bin/tsc --outDir dist --sourceMap false

FROM node:slim AS prod
ENV NODE_ENV="production"

WORKDIR /app
COPY --from=build /build/package.json ./
COPY --from=build /build/dist ./
RUN yarn --prod

ENTRYPOINT ["node", "index.js"]
