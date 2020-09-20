FROM node:14.11.0-alpine3.11
ENV NPM_CONFIG_LOGLEVEL warn
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# RUN apk add --no-cache \
#     ffmpeg \
#     chromium \
#     ttf-freefont \
#     ca-certificates

# RUN apk add --no-cache --virtual build-dependencies \
#     python \
#     build-base
RUN npm i -g pnpm
# Create app directory
RUN mkdir -p /home/node/robbot/node_modules && chown -R node:node /home/node/robbot
WORKDIR /home/node/robbot/

USER node
COPY --chown=node:node . .
RUN pnpm install
RUN pnpm run build && \
    pnpm test && \
    pnpm prune --production && \
    pnpm store prune

# USER root
# RUN apk del build-dependencies

USER node
CMD [ "pnpm", "start" ]
