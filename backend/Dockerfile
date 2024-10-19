FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --global nodemon
RUN yarn install

CMD ["yarn", "serve"]
