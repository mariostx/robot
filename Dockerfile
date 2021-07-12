FROM node:16.4.2-alpine3.12
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --silent
COPY . /usr/src/app
CMD ["node", "build/main/RobotsApp.js"]

RUN npm run build
