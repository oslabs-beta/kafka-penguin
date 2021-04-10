FROM node:12.18.3
RUN npm i -g webpack
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 3000
ENTRYPOINT [ "node", "./server/server.ts" ]