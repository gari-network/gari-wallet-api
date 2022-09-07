FROM node:15.0-alpine3.10

WORKDIR /app
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

RUN apk update
RUN npm i --quiet

RUN rm /app/node_modules/kool/lib/index.d.ts

ADD . /app
EXPOSE PORT
RUN npm run build
CMD ["npm","run","start:prod"]