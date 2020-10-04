FROM node:14.11.0-alpine3.12 as build
ENV NPM_CONFIG_LOGLEVEL warn
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# RUN apk add --no-cache \
#     ffmpeg \
#     chromium \
#     ttf-freefont \
#     ca-certificates

# RUN apk add --no-cache --virtual build-dependencies \
#     python3 \
#     build-base

RUN npm i -g pnpm
# Create app directory
RUN mkdir -p /home/node/robbot/node_modules && chown -R node:node /home/node/robbot
WORKDIR /home/node/robbot/

USER node
COPY --chown=node:node . .
RUN pnpm install && \
    pnpm run build && \
    pnpm test

# ---

FROM node:14.11.0-alpine3.12

RUN mkdir -p /home/node/robbot/node_modules && \
    chown -R node:node /home/node/robbot
WORKDIR /home/node/robbot/

COPY --from=build \
    --chown=node:node \
    /home/node/robbot/node_modules/ ./node_modules/

COPY --from=build \
    --chown=node:node \
    /home/node/robbot/dist/ ./dist/

COPY --from=build \
    --chown=node:node \
    /home/node/robbot/packages/ ./packages/

COPY --from=build \
    --chown=node:node \
    /home/node/robbot/middleware/ ./middleware/

USER node
CMD [ "node", "./dist/index.js" ]
