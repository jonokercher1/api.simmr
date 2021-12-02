FROM node:16-alpine as dev
WORKDIR /app/item
COPY package*.json ./
RUN yarn install
COPY . .

FROM dev as prod
RUN yarn build