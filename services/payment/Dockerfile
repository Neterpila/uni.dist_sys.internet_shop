FROM node:15

WORKDIR /docker_app

COPY ./package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]