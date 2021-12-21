FROM node:16-alpine as dev
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
# RUN yarn database:migrate

# FROM dev as prod
# RUN yarn build