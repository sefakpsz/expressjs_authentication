FROM node:18.14.2

WORKDIR /app

COPY package.json .

RUN npm install

COPY . ./

EXPOSE 1907

CMD ["yarn", "dev"]