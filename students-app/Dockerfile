FROM node:12.22.12-alpine AS development

RUN apk update && apk add --no-cache fontconfig curl
RUN mkdir -p /usr/share
RUN cd /usr/share
RUN curl -L https://github.com/Overbryd/docker-phantomjs-alpine/releases/download/2.11/phantomjs-alpine-x86_64.tar.bz2 | tar xj
RUN ln -s /usr/share/phantomjs/phantomjs /usr/bin/phantomjs

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

EXPOSE 3001

FROM node:12.22.12-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk update && apk add --no-cache fontconfig curl
RUN mkdir -p /usr/share
RUN cd /usr/share
RUN curl -L https://github.com/Overbryd/docker-phantomjs-alpine/releases/download/2.11/phantomjs-alpine-x86_64.tar.bz2 | tar xj
RUN ln -s /usr/share/phantomjs/phantomjs /usr/bin/phantomjs

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]