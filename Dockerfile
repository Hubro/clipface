FROM node:alpine

# Dependencies

RUN apk update && apk upgrade \
    && apk add --no-cache python3 g++ make \
    && rm -rf /var/cache/apk/*

RUN npm install --quiet --no-progress --unsafe-perm -g zero

ADD requirements.txt /
RUN pip3 install --upgrade pip \
    && install -r /requirements.txt

# App setup

ADD app /app
WORKDIR /app

RUN zero build

# Configuration

ENV NODE_ENV production
ENV PORT 80
ENV VIDEO_PATH=/clips
EXPOSE 80
VOLUME /clips

CMD ["zero"]
