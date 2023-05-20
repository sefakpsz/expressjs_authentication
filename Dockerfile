FROM node:latest

WORKDIR /app

COPY package.json .

RUN yarn add

COPY . ./

EXPOSE 1907

CMD ["yarn", "dev"]