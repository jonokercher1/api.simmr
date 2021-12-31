FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
# run migrations

# FROM dev as prod
# RUN yarn build