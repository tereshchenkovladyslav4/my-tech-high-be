FROM node:12.22.12-alpine AS development


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

EXPOSE 3001

FROM node:12.22.12-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG ENVIRONMENT=""

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY .${ENVIRONMENT}.env .env

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]