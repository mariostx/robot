FROM node:12.18-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --silent
COPY . .
CMD ["node", "build/main/RobotsApp.js"]

RUN npm run build
