FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock .

RUN yarn install

COPY . .

RUN yarn build
RUN node compress.js

FROM fholzer/nginx-brotli:latest

COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

