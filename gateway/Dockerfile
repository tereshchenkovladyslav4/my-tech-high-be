FROM node:12.22.12-slim AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

EXPOSE 3002

FROM node:12.22.12-slim as production

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