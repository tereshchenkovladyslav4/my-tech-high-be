FROM node:12.22.12-alpine AS development

RUN apk add fontconfig ttf-dejavu
# if ever you need to change phantom js version number in future ENV comes handy as it can be used as a dynamic variable
ENV PHANTOMJS_VERSION=2.1.1
# magic command
RUN apk add --no-cache curl && \
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls https://infocenter-v2-devops.s3.us-west-2.amazonaws.com/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -jxf - && \
    cp phantomjs-${PHANTOMJS_VERSION}-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
    rm -fR phantomjs-${PHANTOMJS_VERSION}-linux-x86_64 && \
    apk del curl


WORKDIR /usr/src/app

ARG DB_HOST
ARG DB_USER
ARG DB_PASS

ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASS=$DB_PASS

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

RUN npm run db:migrate

EXPOSE 3004

FROM node:12.22.12-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG ENVIRONMENT=""

RUN apk add fontconfig ttf-dejavu
# if ever you need to change phantom js version number in future ENV comes handy as it can be used as a dynamic variable
ENV PHANTOMJS_VERSION=2.1.1

# magic command
RUN apk add --no-cache curl && \
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls https://infocenter-v2-devops.s3.us-west-2.amazonaws.com/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -jxf - && \
    cp phantomjs-${PHANTOMJS_VERSION}-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
    rm -fR phantomjs-${PHANTOMJS_VERSION}-linux-x86_64 && \
    apk del curl


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY .${ENVIRONMENT}.env .env

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]