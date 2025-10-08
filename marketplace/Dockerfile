# stage 1: build
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# stage 2: serve
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
