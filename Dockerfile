FROM node:alpine

# App setup

COPY client/.next/ /app/.next/
COPY client/package.json /app/
COPY client/yarn.lock /app/
COPY client/config/ /config/

WORKDIR /app

RUN yarn --prod

# Configuration

ENV NODE_CONFIG_DIR=/config
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
VOLUME /clips
VOLUME /config

CMD yarn start -p ${PORT}
