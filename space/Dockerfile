FROM node:16-alpine as dev
WORKDIR /app/space
COPY package*.json ./
RUN yarn install
COPY . .

FROM dev as prod
RUN yarn build