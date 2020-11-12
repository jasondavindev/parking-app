FROM node:14-alpine

RUN mkdir /app && \
  chown -R node:node /app

WORKDIR /app

COPY dist/package.json ./

RUN yarn --prod

COPY dist .

USER node

ARG PORT

EXPOSE ${PORT}

ENV NODE_ENV production

CMD [ "yarn", "start:prod" ]
