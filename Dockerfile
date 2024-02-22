FROM node:18

WORKDIR /usr/src/app

COPY receipt-processor/package*.json ./

RUN npm install

COPY receipt-processor/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]