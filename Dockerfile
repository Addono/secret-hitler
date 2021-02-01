FROM node:12 AS builder
WORKDIR /application
COPY ./ ./
RUN yarn && yarn build && yarn cache clean 

FROM node:12-alpine
USER node
WORKDIR /application
COPY --from=builder /application .
ENTRYPOINT node bin/dev.js
