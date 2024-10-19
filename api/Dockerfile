FROM node:21-alpine
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /api

COPY package*.json ./
RUN npm i
COPY . ./