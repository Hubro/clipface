FROM node:alpine

# App setup

ADD client/docker-bundle.tgz /

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
