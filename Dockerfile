FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . ./

EXPOSE 1907

CMD ["yarn", "dev"]