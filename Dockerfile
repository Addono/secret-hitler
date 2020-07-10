FROM node:12

WORKDIR /application

COPY ./ ./

RUN yarn
RUN yarn build

ENTRYPOINT node bin/dev.js
