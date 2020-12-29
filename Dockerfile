FROM node:alpine

# Dependencies

#RUN apk update && apk upgrade \
#    && apk add --no-cache ...
#    && rm -rf /var/cache/apk/*

#RUN npm install --quiet --no-progress --unsafe-perm -g yarn

# App setup

ADD client /app
WORKDIR /app

RUN rm -rf /app/node_modules \
  && yarn \
  && yarn build

# Configuration

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
VOLUME /clips
VOLUME /config

CMD yarn start -p ${PORT}
