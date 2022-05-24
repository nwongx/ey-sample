FROM node:lts-alpine AS dev
RUN apk update && apk add python3 make g++
ENV NODE_ENV development
RUN mkdir -p /usr/app/src
WORKDIR /usr/app/src
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]

# FROM node:lts-alpine AS build
# RUN apk update && apk add python3 make g++
# RUN npm install -g react-app-rewired stream-browserify
# ENV NODE_ENV production
# ENV DISABLE_ESLINT_PLUGIN=true
# RUN mkdir -p /usr/app/src
# WORKDIR /usr/app/src
# COPY package.json .
# COPY package-lock.json .
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx 
# COPY --from=build /usr/app/src/build /usr/share/nginx/html