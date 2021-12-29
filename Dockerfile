FROM node:16-alpine
WORKDIR /app
# RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
# run migrations

# FROM dev as prod
# RUN yarn build