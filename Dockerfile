FROM node:16.2.0 AS node

RUN npm install -g @angular/cli@12.0.1

COPY ./app/package*.json /app/

WORKDIR /app
RUN npm ci

EXPOSE 4200