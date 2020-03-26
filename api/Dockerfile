FROM node:12.16.1-alpine
WORKDIR ./usr/src/app
COPY ./package.json ./
COPY ./.env ./
RUN npm install
COPY . .
CMD ["npm", "start"]
