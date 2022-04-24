FROM node:lts-alpine AS dev
ENV NODE_ENV development
RUN mkdir -p /usr/app/src
WORKDIR /usr/app/src
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]

FROM node:lts-alpine AS build
ENV NODE_ENV production
ENV DISABLE_ESLINT_PLUGIN=true
RUN mkdir -p /usr/app/src
WORKDIR /usr/app/src
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx 
COPY --from=build /usr/app/src/build /usr/share/nginx/html