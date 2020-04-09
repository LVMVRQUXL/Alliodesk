### STAGE 1: BUILD ###
FROM node:12.16.1-alpine AS build
WORKDIR ./usr/src/app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build --prod

### STAGE 2: RUN ###
FROM nginx:1.17.9-alpine
COPY --from=build ./usr/src/app/dist/frontend ./usr/share/nginx/html
