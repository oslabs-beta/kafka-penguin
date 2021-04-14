FROM node:12.18.3

RUN npm i -g webpack
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build2
# RUN npm run tsc
EXPOSE 3000
# ENTRYPOINT [ "nodemon", "./server/server.ts" ]
CMD ["npm", "start"]
